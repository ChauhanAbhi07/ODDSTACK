import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { inquirySchema } from "../../src/lib/inquiry-schema";
import { sendInquiryEmail } from "../../src/lib/inquiries/email";
import { StorageError } from "../../src/lib/inquiries/errors";
import { POST } from "../../src/app/api/inquiries/route";

const brief = inquirySchema.parse({
  intent: "Build something",
  capabilities: ["technology", "design"],
  industry: "Other",
  companySize: "Just me",
  budget: "Let's figure it out",
  timeline: "Just exploring",
  description:
    "A business website with booking and enquiry pages. <b>Visitor text</b>",
  name: "Test Person",
  company: "Test Business",
  email: "visitor@example.com",
  phone: "",
  website: "",
});

function configure(t: TestContext) {
  const values = {
    INQUIRY_STORAGE_DRIVER: "email",
    RESEND_API_KEY: "test-key-never-real",
    INQUIRY_EMAIL_FROM: "forms@example.com",
    INQUIRY_EMAIL_TO: "owner@example.com",
  };
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, values);
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

test("email API routes to a fixed inbox and keeps retries stable without a database", async (t) => {
  configure(t);
  const calls: RequestInit[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    assert.equal(url, "https://api.resend.com/emails");
    calls.push(init);
    return Response.json({ id: "email-receipt-123" });
  });
  const key = randomUUID();
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await POST(
      new Request("http://localhost:3000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify({
          ...brief,
          to: "attacker@example.com",
          from: "spoof@example.com",
        }),
      }),
    );
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), {
      id: "email-receipt-123",
      mode: "email",
    });
  }
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(
    new Headers(calls[0].headers).get("Idempotency-Key"),
    new Headers(calls[1].headers).get("Idempotency-Key"),
  );
  assert.equal(calls[0].redirect, "error");
  assert.ok(calls[0].signal);
  const payload = JSON.parse(String(calls[0].body));
  assert.deepEqual(payload.to, ["owner@example.com"]);
  assert.equal(payload.from, "forms@example.com");
  assert.equal(payload.reply_to, brief.email);
  assert.equal(payload.html, undefined);
  assert.ok(payload.text.includes(brief.description));
  assert.ok(payload.text.includes("Technology, UI/UX & Product"));
  for (const value of [
    brief.name,
    brief.company,
    brief.budget,
    brief.timeline,
    brief.industry,
  ])
    assert.ok(payload.text.includes(value));
});

test("email never calls a provider when credentials or recipient configuration are missing", async (t) => {
  configure(t);
  const fetch = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected request");
  });
  delete process.env.RESEND_API_KEY;
  await assert.rejects(sendInquiryEmail(brief, randomUUID()), StorageError);
  process.env.RESEND_API_KEY = "test-key";
  process.env.INQUIRY_EMAIL_TO = "invalid";
  await assert.rejects(sendInquiryEmail(brief, randomUUID()), StorageError);
  assert.equal(fetch.mock.callCount(), 0);
});

test("provider errors and timeouts never become successful enquiry receipts", async (t) => {
  configure(t);
  const cases = [
    {
      status: 401,
      body: { message: "private-provider-detail" },
      expected: 503,
    },
    { status: 429, body: {}, expected: 429 },
    { status: 500, body: {}, expected: 503 },
    {
      status: 409,
      body: { name: "invalid_idempotent_request" },
      expected: 409,
    },
    {
      status: 409,
      body: { name: "concurrent_idempotent_requests" },
      expected: 503,
    },
    { status: 200, body: {}, expected: 503 },
  ];
  for (const fixture of cases) {
    const mocked = t.mock.method(globalThis, "fetch", async () =>
      Response.json(fixture.body, { status: fixture.status }),
    );
    await assert.rejects(sendInquiryEmail(brief, randomUUID()), (error) => {
      assert.ok(error instanceof StorageError);
      assert.equal(error.status, fixture.expected);
      assert.ok(!error.message.includes("private-provider-detail"));
      return true;
    });
    mocked.mock.restore();
  }
  t.mock.method(globalThis, "fetch", async () => {
    throw new DOMException("Timed out", "TimeoutError");
  });
  await assert.rejects(sendInquiryEmail(brief, randomUUID()), StorageError);
});
