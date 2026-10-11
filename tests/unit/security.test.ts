import { createElement } from "react";
import test, { describe, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { services } from "../../src/data/services";
import { engagements } from "../../src/data/engagements";
import { footerNavigation, navigation } from "../../src/data/navigation";
import { Footer } from "../../src/components/footer";
import { Wordmark } from "../../src/components/header";
import {
  ButtonLink,
  EmptyState,
  JsonLd,
  PageIntro,
  Tags,
} from "../../src/components/ui";
import {
  clearAlertLimits,
  POST as alertPost,
} from "../../src/app/api/alerts/route";
import { POST as inquiryPost } from "../../src/app/api/inquiries/route";
import { clickEmailBody } from "../../src/lib/alerts/gmail";
import { allowedPath, clickTarget } from "../../src/lib/alerts/targets";
import { parseVisitorCookie } from "../../src/lib/alerts/visitor";
import {
  sendWhatsApp,
  whatsappConfig,
  whatsappRequestUrl,
} from "../../src/lib/alerts/whatsapp";
import { inquirySchema } from "../../src/lib/inquiry-schema";
import { notificationDelivery } from "../../src/lib/inquiries/notifications";
import { saveInquiry, StorageError } from "../../src/lib/inquiries/storage";
import { contactLink } from "../../src/lib/recommendations";
import { finderIndustries } from "../../src/lib/recommendations";
import { visibleContent } from "../../src/lib/publication";
import { caseStudies } from "../../src/data/case-studies";
import { articles } from "../../src/data/articles";

const brief = {
  intent: "Build something",
  capabilities: ["technology"],
  industry: "Other",
  companySize: "Just me",
  budget: "Let's figure it out",
  timeline: "Just exploring",
  description: "A booking website for a local shop.",
  name: "Test Person",
  company: "Test Business",
  email: "visitor@example.com",
  phone: "",
  website: "",
};

function restoreEnv(t: TestContext, keys: string[]) {
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    clearAlertLimits();
  });
}

function alertRequest(body: unknown, headers: Record<string, string> = {}) {
  return alertPost(
    new Request("http://localhost:3000/api/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

test("real service and contact buttons stay inside the alert allowlist", () => {
  for (const service of services) {
    assert.deepEqual(clickTarget(`/services/${service.slug}`, service.title), {
      label: service.title,
      path: `/services/${service.slug}`,
    });
  }
  for (const label of [
    "Let’s talk",
    "Build your stack",
    "Discuss your project",
    "Let’s build this stack",
    "Build this stack",
    "Let’s connect",
    "Discuss your stack",
    "Let’s talk about your business",
    "I need a website",
    "I want more customers",
    "I want to save time",
  ])
    assert.ok(clickTarget("/contact", label), label);
  for (const industry of finderIndustries)
    assert.ok(
      allowedPath(contactLink(["technology", "design"], industry)),
      industry,
    );
  for (const engagement of engagements)
    assert.equal(
      allowedPath(
        `/contact?engagement=${encodeURIComponent(engagement.title)}`,
      ),
      `/contact?engagement=${encodeURIComponent(engagement.title)}`,
    );
});

test("click alerts reject open redirects, scripts and traversable paths", () => {
  for (const href of [
    "https://evil.example/services",
    "http://evil.example/contact",
    "//evil.example/contact",
    "javascript:alert(1)",
    "data:text/html,hi",
    "/contact?next=https%3A%2F%2Fevil.example",
    "/contact?stack=technology&redirect=https://evil.example",
    "/contact?stack=../../admin",
    "/contact?industry=Not%20a%20real%20industry",
    "/services/ai-automation?next=https://evil.example",
    "/services/../admin",
    "/services/%2e%2e/admin",
    "https://user:pass@alerts.oddestack.local/contact",
    "/about",
    "/work",
    "/privacy",
    "#services",
    "mailto:owner@example.com",
  ])
    assert.equal(allowedPath(href), null, href);
  for (const label of [
    "<script>alert(1)</script>",
    "Visit https://evil.example",
    "javascript:alert(1)",
    "",
  ])
    assert.equal(clickTarget("/contact", label), null, label);
  assert.equal(clickTarget("/contact", "Line\nbreak")?.label, "Line break");
});

test("shared navigation and rendered components only expose safe links", () => {
  for (const item of [...navigation, ...footerNavigation]) {
    assert.match(item.href, /^\/(?:[a-z0-9#/-]+)?$/);
    assert.equal(item.href.includes("javascript:"), false);
    assert.equal(item.label.includes("<"), false);
  }
  const footer = renderToStaticMarkup(createElement(Footer));
  const intro = renderToStaticMarkup(
    createElement(PageIntro, {
      label: "Services",
      title: "What we build",
      description: "Websites and apps.",
    }),
  );
  const tags = renderToStaticMarkup(
    createElement(Tags, { items: services.map((service) => service.title) }),
  );
  const empty = renderToStaticMarkup(
    createElement(EmptyState, { children: "Nothing published yet." }),
  );
  const button = renderToStaticMarkup(
    createElement(ButtonLink, { href: "/contact", children: "Let’s talk" }),
  );
  const mark = renderToStaticMarkup(createElement(Wordmark));
  const html = [footer, intro, tags, empty, button, mark].join("\n");
  assert.match(footer, /Good things happen/);
  assert.match(mark, /ODDESTACK/);
  assert.equal(html.includes("<script"), false);
  for (const href of html.matchAll(/href="([^"]+)"/g)) {
    assert.match(href[1], /^(\/|mailto:)/);
    assert.equal(href[1].includes("javascript:"), false);
  }
});

test("structured data cannot close the script tag", () => {
  const html = renderToStaticMarkup(
    createElement(JsonLd, {
      data: { name: "</script><script>alert(1)</script>" },
    }),
  );
  assert.equal(html.includes("</script><script>"), false);
  assert.match(html, /\\u003c/);
});

test("visitor cookies ignore tampered and injected values", () => {
  const id = "11111111-1111-4111-8111-111111111111";
  assert.equal(parseVisitorCookie(""), null);
  assert.equal(
    parseVisitorCookie(
      `oddestack_visitor=${encodeURIComponent(JSON.stringify({ id: "<script>", firstSeen: "2026-10-11", visits: 1 }))}`,
    ),
    null,
  );
  assert.equal(
    parseVisitorCookie(
      `oddestack_visitor=${encodeURIComponent(JSON.stringify({ id, firstSeen: "x".repeat(80), visits: 1 }))}`,
    ),
    null,
  );
  assert.equal(
    parseVisitorCookie(
      `oddestack_visitor=${encodeURIComponent(JSON.stringify({ id, firstSeen: "2026-10-11", visits: -1 }))}`,
    ),
    null,
  );
  const parsed = parseVisitorCookie(
    `oddestack_visitor=${encodeURIComponent(
      JSON.stringify({
        id,
        firstSeen: "2026-10-11T00:00:00.000Z",
        visits: 2,
        admin: true,
        __proto__: { admin: true },
      }),
    )}`,
  );
  assert.deepEqual(parsed, {
    id,
    firstSeen: "2026-10-11T00:00:00.000Z",
    visits: 2,
  });
  assert.equal("admin" in (parsed ?? {}), false);
});

test("click emails carry the button and visitor context without secrets", () => {
  const body = clickEmailBody(
    { label: "Let’s talk", path: "/contact" },
    {
      visitor: "11111111-1111-4111-8111-111111111111",
      first_seen: "2026-10-11T09:00:00.000Z",
      visits: "1",
      page: "/",
      referrer: "Direct",
      language: "en-IN",
      timezone: "Asia/Kolkata",
      device: "Desktop",
      screen: "1440x900",
    },
  );
  const serialized = JSON.stringify(body);
  assert.equal(body.button, "Let’s talk");
  assert.equal(body.button_page, "/contact");
  assert.equal(serialized.includes("CALLMEBOT_API_KEY"), false);
  assert.equal(serialized.includes("visitor@example.com"), false);
  assert.equal(body._gotcha, "");
});

test("inquiry validation rejects header injection and unpublished content stays hidden", () => {
  for (const email of [
    "visitor@example.com\nBcc: attacker@example.com",
    "visitor@example.com\r\nBcc: attacker@example.com",
    "not-an-email",
  ])
    assert.equal(inquirySchema.safeParse({ ...brief, email }).success, false);
  assert.equal(
    inquirySchema.safeParse({ ...brief, name: "Ann\r\nBcc: x" }).success,
    false,
  );
  assert.equal(visibleContent(caseStudies, false).length, 0);
  assert.equal(visibleContent(articles, false).length, 0);
  assert.ok(visibleContent(caseStudies, true).length > 0);
});

test("notification webhooks must be https and are not called for plain http", async (t) => {
  restoreEnv(t, [
    "INQUIRY_NOTIFICATION_WEBHOOK_URL",
    "INQUIRY_NOTIFICATION_WEBHOOK_SECRET",
    "INQUIRY_STORAGE_DRIVER",
    "INQUIRY_WEBHOOK_URL",
    "INQUIRY_WEBHOOK_SECRET",
  ]);
  process.env.INQUIRY_NOTIFICATION_WEBHOOK_URL = "http://evil.example/hook";
  process.env.INQUIRY_NOTIFICATION_WEBHOOK_SECRET = "secret";
  assert.throws(() => notificationDelivery(), /HTTPS/);
  process.env.INQUIRY_STORAGE_DRIVER = "webhook";
  process.env.INQUIRY_WEBHOOK_URL = "http://evil.example/inquiries";
  process.env.INQUIRY_WEBHOOK_SECRET = "secret";
  let called = false;
  t.mock.method(globalThis, "fetch", async () => {
    called = true;
    return Response.json({ id: "should-not-send" });
  });
  await assert.rejects(
    saveInquiry(inquirySchema.parse(brief), "security-test-key-1234"),
    (error: unknown) => error instanceof StorageError,
  );
  assert.equal(called, false);
});

describe("alert endpoint abuse", { concurrency: 1 }, () => {
  test("rejects foreign origins, bad content and smuggled destinations", async (t) => {
    restoreEnv(t, ["CALLMEBOT_API_KEY", "WHATSAPP_TO", "TRUST_PROXY"]);
    delete process.env.CALLMEBOT_API_KEY;
    delete process.env.WHATSAPP_TO;
    delete process.env.TRUST_PROXY;
    clearAlertLimits();
    assert.equal(
      (
        await alertRequest(
          { kind: "click", label: "Services", path: "/services" },
          { Origin: "https://evil.example" },
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await alertRequest(
          { kind: "click", label: "Services", path: "/services" },
          { "Content-Type": "text/plain" },
        )
      ).status,
      415,
    );
    assert.equal((await alertRequest("not-json")).status, 400);
    assert.equal((await alertRequest("x".repeat(3000))).status, 413);
    for (const path of [
      "https://evil.example/services",
      "/contact?next=https%3A%2F%2Fevil.example",
      "/services/../admin",
      "/about",
    ])
      assert.equal(
        (await alertRequest({ kind: "click", label: "Services", path })).status,
        422,
        path,
      );
    assert.equal(
      (
        await alertRequest({
          kind: "click",
          label: "<script>alert(1)</script>",
          path: "/services",
        })
      ).status,
      422,
    );
  });

  test("a forwarded address cannot reset the limit unless the proxy is trusted", async (t) => {
    restoreEnv(t, ["CALLMEBOT_API_KEY", "WHATSAPP_TO", "TRUST_PROXY"]);
    delete process.env.CALLMEBOT_API_KEY;
    delete process.env.WHATSAPP_TO;
    delete process.env.TRUST_PROXY;
    clearAlertLimits();
    for (let i = 0; i < 8; i++) {
      const response = await alertRequest(
        { kind: "click", label: "Technology", path: `/services/item-${i}` },
        { "X-Forwarded-For": `10.0.0.${i}` },
      );
      assert.equal(response.status, 204);
    }
    const blocked = await alertRequest(
      { kind: "click", label: "Technology", path: "/services/one-more" },
      { "X-Forwarded-For": "10.1.1.1" },
    );
    assert.equal(blocked.status, 429);
    process.env.TRUST_PROXY = "true";
    const separate = await alertRequest(
      { kind: "click", label: "Technology", path: "/services/other-network" },
      { "X-Forwarded-For": "203.0.113.10" },
    );
    assert.equal(separate.status, 204);
  });

  test("WhatsApp delivery stays on https and never echoes the API key", async (t) => {
    restoreEnv(t, ["CALLMEBOT_API_KEY", "WHATSAPP_TO"]);
    process.env.CALLMEBOT_API_KEY = "test-key-never-real";
    process.env.WHATSAPP_TO = "919927350826";
    assert.equal(whatsappConfig(), null);
    process.env.WHATSAPP_TO = "+91 99273 50826";
    assert.equal(whatsappConfig(), null);
    process.env.WHATSAPP_TO = "+919927350826";
    const url = whatsappRequestUrl("ODDESTACK: Let’s talk — /contact");
    assert.ok(url);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "api.callmebot.com");
    t.mock.method(globalThis, "fetch", async () => new Response("ERROR"));
    await assert.rejects(
      sendWhatsApp("ODDESTACK: Let’s talk — /contact"),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message.includes("test-key-never-real"), false);
        assert.equal(error.message.includes("+919927350826"), false);
        return true;
      },
    );
  });
});

test("enquiry API rejects a forged origin before storage", async () => {
  const response = await inquiryPost(
    new Request("http://localhost:3000/api/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": "security-test-key-123456",
        Origin: "https://evil.example",
      },
      body: JSON.stringify(brief),
    }),
  );
  assert.equal(response.status, 403);
});
