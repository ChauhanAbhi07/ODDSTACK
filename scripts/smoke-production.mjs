import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3001";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname))
  throw new Error(
    "This fixture submission script is restricted to a local test server.",
  );
const response = await fetch(base);
assert.equal(response.status, 200);
const html = await response.text();
const assets = [
  ...new Set(
    [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+)[^"]*"/g)].map(
      (m) => m[1],
    ),
  ),
];
assert.ok(assets.length > 0);
for (const asset of assets)
  assert.equal((await fetch(base + asset)).status, 200, asset);
for (const route of [
  "/services/ai-automation",
  "/contact",
  "/sitemap.xml",
  "/robots.txt",
])
  assert.equal((await fetch(base + route)).status, 200, route);
assert.equal((await fetch(base + "/work/ai-voice-platform")).status, 404);
const key = randomUUID();
const fixture = {
  intent: "Build something",
  capabilities: ["technology"],
  industry: "Other",
  companySize: "Just me",
  budget: "Let's figure it out",
  timeline: "Just exploring",
  description:
    "Local production smoke test. This record contains only synthetic test details.",
  name: "Smoke Test",
  company: "Test fixture",
  email: "smoke@example.com",
  phone: "",
  website: "",
};
const send = (body) =>
  fetch(base + "/api/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
      Origin: base,
    },
    body: JSON.stringify(body),
  });
const first = await send(fixture);
assert.equal(first.status, 201);
const receipt = await first.json();
assert.equal(receipt.mode, "live");
const retry = await send(fixture);
assert.equal(retry.status, 201);
assert.equal((await retry.json()).id, receipt.id);
assert.equal(
  (await send({ ...fixture, company: "Changed fixture" })).status,
  409,
);
console.log(
  JSON.stringify({
    standalone: "passed",
    staticAssets: assets.length,
    routes: "passed",
    postgresApi: "passed",
    idempotency: "passed",
    publicFiltering: "passed",
  }),
);
