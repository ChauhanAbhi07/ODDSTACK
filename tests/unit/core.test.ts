import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import {
  recommend,
  goals,
  finderIndustries,
} from "../../src/lib/recommendations";
import { services } from "../../src/data/services";
import { industries } from "../../src/data/industries";
import { solutions } from "../../src/data/solutions";
import { caseStudies } from "../../src/data/case-studies";
import { articles } from "../../src/data/articles";
import { visibleContent } from "../../src/lib/publication";
import { inquirySchema } from "../../src/lib/inquiry-schema";
import { saveLocal, StorageError } from "../../src/lib/inquiries/storage";
import { POST } from "../../src/app/api/inquiries/route";

const brief = {
  intent: "Build something",
  capabilities: ["technology", "design"],
  industry: "Other",
  companySize: "2–10 people",
  budget: "Let's figure it out",
  timeline: "1–3 months",
  description: "We need a connected customer portal for our service team.",
  name: "Test Person",
  company: "Test Company",
  email: "test@example.com",
  phone: "",
  website: "",
};
test("recommendations cover all industry/goal pairs with valid, distinct capabilities", () => {
  for (const industry of finderIndustries)
    for (const goal of goals)
      for (const challenge of goal.challenges) {
        const results = recommend(industry, goal.id, challenge);
        assert.ok(results.length >= 3);
        assert.equal(new Set(results.map((r) => r.id)).size, results.length);
        for (const result of results) {
          assert.ok(services.some((s) => s.slug === result.id));
          assert.ok(result.reason);
        }
      }
  const realEstate = recommend("Real Estate", "leads").map((r) => r.id);
  for (const id of [
    "design",
    "growth",
    "erp-business-systems",
    "ai-automation",
    "data",
  ])
    assert.ok(realEstate.includes(id));
  assert.ok(recommend("Unknown", "unknown").length >= 3);
});
test("content relationships resolve and draft publication is consistent", () => {
  for (const collection of [
    services,
    industries,
    solutions,
    caseStudies,
    articles,
  ])
    assert.equal(
      new Set(collection.map((c) => c.slug)).size,
      collection.length,
    );
  for (const item of [...industries, ...solutions, ...caseStudies])
    for (const id of item.capabilities)
      assert.ok(services.some((s) => s.slug === id));
  assert.equal(visibleContent(caseStudies, false).length, 0);
  assert.equal(visibleContent(articles, false).length, 0);
  assert.equal(visibleContent(caseStudies, true).length, 7);
  assert.equal(visibleContent(articles, true).length, 6);
  assert.equal(
    11 +
      services.length +
      industries.length +
      caseStudies.length +
      articles.length,
    42,
  );
});
test("inquiry validation rejects invalid contacts, injected capability IDs and oversized descriptions", () => {
  assert.ok(inquirySchema.safeParse(brief).success);
  for (const change of [
    { email: "invalid" },
    { capabilities: ["made-up"] },
    { industry: "missing" },
    { description: "short" },
    { description: "x".repeat(4001) },
    { website: "spam" },
    { phone: "abc" },
  ])
    assert.equal(
      inquirySchema.safeParse({ ...brief, ...change }).success,
      false,
    );
});
test("local persistence survives retries and rejects key reuse with a different payload", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "oddestack-test-"));
  const data = inquirySchema.parse(brief);
  const key = randomUUID();
  const [first, duplicate] = await Promise.all([
    saveLocal(data, key, root),
    saveLocal(data, key, root),
  ]);
  assert.equal(first.id, duplicate.id);
  assert.equal(first.mode, "local");
  const folders = await readdir(root);
  assert.equal(folders.length, 1);
  const record = JSON.parse(
    await readFile(path.join(root, folders[0], "record.json"), "utf8"),
  );
  assert.equal(record.inquiry.email, brief.email);
  await assert.rejects(
    saveLocal(
      { ...data, description: "An entirely different business requirement." },
      key,
      root,
    ),
    (e: unknown) => e instanceof StorageError && e.status === 409,
  );
});
test("API enforces payload limits, JSON, origin and validation", async () => {
  const req = (body: string, headers: Record<string, string> = {}) =>
    new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": randomUUID(),
        ...headers,
      },
      body,
    });
  assert.equal(
    (
      await POST(
        req(JSON.stringify(brief), { origin: "https://unrelated.example" }),
      )
    ).status,
    403,
  );
  assert.equal(
    (await POST(req(JSON.stringify(brief), { "Content-Type": "text/plain" })))
      .status,
    415,
  );
  assert.equal((await POST(req("not json"))).status, 400);
  assert.equal(
    (
      await POST(
        req(JSON.stringify({ ...brief, email: "invalid" }), {
          origin: "http://127.0.0.1:3000",
          host: "127.0.0.1:3000",
        }),
      )
    ).status,
    422,
  );
  assert.equal(
    (await POST(req(JSON.stringify({ ...brief, email: "broken" })))).status,
    422,
  );
  assert.equal((await POST(req("x".repeat(17000)))).status, 413);
  assert.equal(
    (await POST(req(JSON.stringify(brief), { "Idempotency-Key": "" }))).status,
    400,
  );
});
test("API never claims success when storage is disabled", async () => {
  const previous = process.env.INQUIRY_STORAGE_DRIVER;
  process.env.INQUIRY_STORAGE_DRIVER = "disabled";
  try {
    const result = await POST(
      new Request("http://localhost:3000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": randomUUID(),
        },
        body: JSON.stringify(brief),
      }),
    );
    assert.equal(result.status, 503);
    assert.match((await result.json()).error, /isn't connected/);
  } finally {
    if (previous === undefined) delete process.env.INQUIRY_STORAGE_DRIVER;
    else process.env.INQUIRY_STORAGE_DRIVER = previous;
  }
});
