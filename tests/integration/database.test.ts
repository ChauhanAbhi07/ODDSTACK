import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { inquirySchema } from "../../src/lib/inquiry-schema";
import { savePostgres } from "../../src/lib/inquiries/postgres";
import { StorageError } from "../../src/lib/inquiries/errors";
import { deliverPending } from "../../src/lib/inquiries/notifications";

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString)
  throw new Error(
    "Set TEST_DATABASE_URL to a dedicated integration-test database.",
  );
const schema = `test_${randomUUID().replaceAll("-", "")}`;
const admin = new Pool({ connectionString });
const db = new Pool({
  connectionString,
  options: `-c search_path=${schema}`,
  max: 15,
});
const second = new Pool({
  connectionString,
  options: `-c search_path=${schema}`,
  max: 15,
});
const data = inquirySchema.parse({
  intent: "Build something",
  capabilities: ["technology"],
  industry: "Other",
  companySize: "Just me",
  budget: "Let's figure it out",
  timeline: "Just exploring",
  description:
    "A dedicated integration test enquiry with no real personal information.",
  name: "Test Person",
  company: "Test fixture",
  email: "fixture@example.com",
  phone: "",
  website: "",
});

before(async () => {
  await admin.query(`CREATE SCHEMA ${schema}`);
  await db.query(await readFile("database/001-inquiries.sql", "utf8"));
});
beforeEach(async () => {
  await db.query(
    "TRUNCATE oddestack_inquiry_notifications,oddestack_inquiry_limits,oddestack_inquiries",
  );
});
after(async () => {
  await db.end();
  await second.end();
  await admin.query(`DROP SCHEMA ${schema} CASCADE`);
  await admin.end();
});

test("concurrent requests across pools persist one record and one notification", async () => {
  const key = randomUUID();
  const receipts = await Promise.all(
    Array.from({ length: 12 }, (_, i) =>
      savePostgres(data, key, "same-client", i % 2 ? db : second),
    ),
  );
  assert.equal(new Set(receipts.map((r) => r.id)).size, 1);
  assert.equal(
    (await db.query("SELECT count(*)::int AS n FROM oddestack_inquiries"))
      .rows[0].n,
    1,
  );
  assert.equal(
    (
      await db.query(
        "SELECT count(*)::int AS n FROM oddestack_inquiry_notifications",
      )
    ).rows[0].n,
    1,
  );
  await assert.rejects(
    savePostgres(
      { ...data, company: "Different payload" },
      key,
      "same-client",
      db,
    ),
    (e: unknown) => e instanceof StorageError && e.status === 409,
  );
});
test("shared database rate limit admits ten distinct submissions across workers", async () => {
  const outcomes = await Promise.allSettled(
    Array.from({ length: 15 }, (_, i) =>
      savePostgres(data, randomUUID(), "limited-client", i % 2 ? db : second),
    ),
  );
  assert.equal(outcomes.filter((r) => r.status === "fulfilled").length, 10);
  for (const result of outcomes)
    if (result.status === "rejected") assert.equal(result.reason.status, 429);
  assert.equal(
    (await db.query("SELECT count(*)::int AS n FROM oddestack_inquiries"))
      .rows[0].n,
    10,
  );
});
test("a queue insertion failure rolls back the enquiry and quota update", async () => {
  await db.query(
    "ALTER TABLE oddestack_inquiry_notifications ADD CONSTRAINT simulate_failure CHECK(attempts < 0)",
  );
  try {
    await assert.rejects(
      savePostgres(data, randomUUID(), "rollback-client", db),
    );
    assert.equal(
      (await db.query("SELECT count(*)::int AS n FROM oddestack_inquiries"))
        .rows[0].n,
      0,
    );
    assert.equal(
      (
        await db.query(
          "SELECT count(*)::int AS n FROM oddestack_inquiry_limits",
        )
      ).rows[0].n,
      0,
    );
  } finally {
    await db.query(
      "ALTER TABLE oddestack_inquiry_notifications DROP CONSTRAINT simulate_failure",
    );
  }
});
test("notification failure retains the brief and retries with the same delivery ID", async () => {
  const receipt = await savePostgres(data, randomUUID(), "delivery-client", db);
  const attempts: string[] = [];
  const failed = await deliverPending(async (message) => {
    attempts.push(message.id);
    throw new Error("simulated failure");
  }, db);
  assert.equal(failed.failed, 1);
  assert.equal(
    (await db.query("SELECT count(*)::int AS n FROM oddestack_inquiries"))
      .rows[0].n,
    1,
  );
  await db.query(
    "UPDATE oddestack_inquiry_notifications SET next_attempt_at=clock_timestamp()-interval '1 second'",
  );
  const sent = await deliverPending(async (message) => {
    attempts.push(message.id);
    assert.equal(message.inquiry.email, data.email);
  }, db);
  assert.equal(sent.delivered, 1);
  assert.deepEqual(attempts, [receipt.id, receipt.id]);
  assert.equal(
    (
      await deliverPending(async () => {
        throw new Error("should not redeliver");
      }, db)
    ).delivered,
    0,
  );
});
test("competing delivery workers claim each queue entry once", async () => {
  await Promise.all(
    Array.from({ length: 5 }, () =>
      savePostgres(data, randomUUID(), "worker-client", db),
    ),
  );
  const sent: string[] = [];
  const deliver = async (message: { id: string }) => {
    await new Promise((r) => setTimeout(r, 10));
    sent.push(message.id);
  };
  await Promise.all([
    deliverPending(deliver, db),
    deliverPending(deliver, second),
  ]);
  assert.equal(sent.length, 5);
  assert.equal(new Set(sent).size, 5);
});
