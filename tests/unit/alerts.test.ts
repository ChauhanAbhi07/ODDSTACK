import { describe, test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { clickEmailBody } from "../../src/lib/alerts/gmail";
import { alertMessage, clickTarget } from "../../src/lib/alerts/targets";
import {
  parseVisitorCookie,
  updateVisitor,
} from "../../src/lib/alerts/visitor";
import {
  sendWhatsApp,
  whatsappRequestUrl,
} from "../../src/lib/alerts/whatsapp";
import { clearAlertLimits, POST } from "../../src/app/api/alerts/route";

function configure(t: TestContext, enabled: boolean) {
  clearAlertLimits();
  const previous = {
    CALLMEBOT_API_KEY: process.env.CALLMEBOT_API_KEY,
    WHATSAPP_TO: process.env.WHATSAPP_TO,
  };
  if (enabled) {
    process.env.CALLMEBOT_API_KEY = "test-key-never-real";
    process.env.WHATSAPP_TO = "+911234567890";
  } else {
    delete process.env.CALLMEBOT_API_KEY;
    delete process.env.WHATSAPP_TO;
  }
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    clearAlertLimits();
  });
}

function alertRequest(body: unknown, origin = "http://localhost:3000") {
  return POST(
    new Request("http://localhost:3000/api/alerts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
      body: JSON.stringify(body),
    }),
  );
}

describe("owner alerts", { concurrency: 1 }, () => {
  test("click alerts accept services and contact actions only", () => {
    assert.deepEqual(
      clickTarget("/services/ai-automation", "AI & Automation"),
      {
        label: "AI & Automation",
        path: "/services/ai-automation",
      },
    );
    assert.deepEqual(
      clickTarget(
        "/contact?stack=technology&industry=Real+Estate",
        "Let’s talk",
      ),
      {
        label: "Let’s talk",
        path: "/contact?stack=technology&industry=Real+Estate",
      },
    );
    assert.equal(
      clickTarget(
        "/contact?industry=D2C+%2F+Ecommerce",
        "Let’s build this stack",
      )?.path,
      "/contact?industry=D2C+%2F+Ecommerce",
    );
    assert.equal(clickTarget("#services", "Explore services"), null);
    assert.equal(clickTarget("/about", "About us"), null);
    assert.equal(
      clickTarget("https://evil.example/services", "Services"),
      null,
    );
    assert.equal(clickTarget("mailto:hello@oddestack.com", "Email"), null);
    assert.equal(clickTarget("/services/../about", "About"), null);
    assert.equal(
      alertMessage({ kind: "enquiry" }),
      "ODDESTACK: New enquiry. Check your email.",
    );
    assert.equal(
      alertMessage({ label: "Let’s talk", path: "/contact" }),
      "ODDESTACK: Let’s talk — /contact",
    );
    const visitor = {
      visitor: "11111111-1111-4111-8111-111111111111",
      first_seen: "2026-10-11T09:00:00.000Z",
      visits: "2",
      page: "/",
      referrer: "Direct",
      language: "en-IN",
      timezone: "Asia/Kolkata",
      device: "Mobile",
      screen: "390x844",
    };
    assert.deepEqual(
      clickEmailBody({ label: "Let’s talk", path: "/contact" }, visitor),
      {
        name: "Website click",
        email: "hello@oddestack.com",
        message: "ODDESTACK: Let’s talk — /contact",
        button: "Let’s talk",
        button_page: "/contact",
        subject: "ODDESTACK website click",
        _subject: "ODDESTACK website click",
        _gotcha: "",
        ...visitor,
      },
    );
    const stored = encodeURIComponent(
      JSON.stringify({
        id: visitor.visitor,
        firstSeen: visitor.first_seen,
        visits: 1,
      }),
    );
    assert.deepEqual(parseVisitorCookie(`oddestack_visitor=${stored}`), {
      id: visitor.visitor,
      firstSeen: visitor.first_seen,
      visits: 1,
    });
    assert.equal(parseVisitorCookie("other=1"), null);
    const again = updateVisitor(
      { id: visitor.visitor, firstSeen: visitor.first_seen, visits: 1 },
      "2026-10-11T10:00:00.000Z",
      false,
    );
    assert.equal(again.visits, 2);
    assert.equal(
      updateVisitor(again, "2026-10-11T11:00:00.000Z", true).visits,
      2,
    );
  });

  test("WhatsApp requests stay on the server and skip when unconfigured", async (t) => {
    configure(t, false);
    assert.equal(whatsappRequestUrl("ODDESTACK: Let’s talk — /contact"), null);
    assert.equal(
      await sendWhatsApp("ODDESTACK: Let’s talk — /contact"),
      "skipped",
    );
    let called = false;
    t.mock.method(globalThis, "fetch", async () => {
      called = true;
      return new Response("Message queued.");
    });
    const response = await alertRequest({
      kind: "click",
      label: "Let’s talk",
      path: "/contact",
      email: "visitor@example.com",
    });
    assert.equal(response.status, 204);
    assert.equal(called, false);
  });

  test("configured alerts text the owner without visitor contact details", async (t) => {
    configure(t, true);
    const calls: string[] = [];
    t.mock.method(globalThis, "fetch", async (url: string | URL) => {
      calls.push(String(url));
      return new Response("<b>Message queued.</b>");
    });
    const click = await alertRequest({
      kind: "click",
      label: "AI & Automation",
      path: "/services/ai-automation",
    });
    assert.equal(click.status, 204);
    const enquiry = await alertRequest({
      kind: "enquiry",
      email: "visitor@example.com",
      name: "Test Person",
      phone: "+910000000000",
    });
    assert.equal(enquiry.status, 204);
    const repeat = await alertRequest({
      kind: "click",
      label: "AI & Automation",
      path: "/services/ai-automation",
    });
    assert.equal(repeat.status, 204);
    assert.equal(calls.length, 2);
    const clickUrl = new URL(calls[0]);
    assert.equal(clickUrl.origin, "https://api.callmebot.com");
    assert.equal(clickUrl.pathname, "/whatsapp.php");
    assert.equal(clickUrl.searchParams.get("phone"), "+911234567890");
    assert.equal(clickUrl.searchParams.get("apikey"), "test-key-never-real");
    assert.equal(
      clickUrl.searchParams.get("text"),
      "ODDESTACK: AI & Automation — /services/ai-automation",
    );
    assert.equal(
      new URL(calls[1]).searchParams.get("text"),
      "ODDESTACK: New enquiry. Check your email.",
    );
    assert.equal(calls.join("\n").includes("visitor@example.com"), false);
    const rejected = await alertRequest(
      { kind: "click", label: "About us", path: "/about" },
      "https://evil.example",
    );
    assert.equal(rejected.status, 403);
    const unrecognized = await alertRequest({
      kind: "click",
      label: "Visit https://evil.example",
      path: "/services",
    });
    assert.equal(unrecognized.status, 422);
  });

  test("alert delivery failures do not include the API key", async (t) => {
    configure(t, true);
    t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("ERROR", { status: 200 }),
    );
    await assert.rejects(
      sendWhatsApp("ODDESTACK: Let’s talk — /contact"),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "whatsapp_not_queued");
        assert.equal(error.message.includes("test-key-never-real"), false);
        return true;
      },
    );
  });

  test("repeated distinct clicks are capped", async (t) => {
    configure(t, true);
    t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("Message queued."),
    );
    for (let i = 0; i < 8; i++) {
      const response = await alertRequest({
        kind: "click",
        label: "Technology",
        path: `/services/item-${i}`,
      });
      assert.equal(response.status, 204);
    }
    const limited = await alertRequest({
      kind: "click",
      label: "Technology",
      path: "/services/one-more",
    });
    assert.equal(limited.status, 429);
    const separate = await alertRequest({
      kind: "click",
      label: "Technology",
      path: "/services/separate-session",
      session: "11111111-1111-4111-8111-111111111111",
    });
    assert.equal(separate.status, 204);
  });
});
