import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { services } from "../../src/data/services";
import { industries } from "../../src/data/industries";
import { caseStudies } from "../../src/data/case-studies";
import { articles } from "../../src/data/articles";

test("homepage is accessible and responsive at every requested width", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your business",
  );
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(mobileAxe.violations).toEqual([]);
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
});
test("service navigation, FAQ and solution dialog work with keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore services", exact: true })
    .click();
  await expect(page).toHaveURL(/#services$/);
  const question = page
    .locator("summary")
    .filter({ hasText: "Can I start with just one service?" });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Yes. Start with a website", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "I need a website", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services\/technology/);
  await page.goto("/solutions");
  await page.getByRole("button", { name: /01 Generate more demand/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Services", exact: false })
    .click();
  await expect(page).toHaveURL(/\/services\/?$/);
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
test("finder selections and contact details survive the two-step enquiry", async ({
  page,
}) => {
  let payload: Record<string, unknown> = {};
  await page.route("https://formspree.io/f/mqpebnqe", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
  await page.goto("/solutions");
  await page.getByRole("button", { name: "Real Estate", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page
    .getByRole("button", { name: "Get more leads", exact: true })
    .click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page
    .getByRole("button", { name: "Leads slip through the cracks", exact: true })
    .click();
  await page.getByRole("button", { name: "Find my stack" }).click();
  await page.getByRole("link", { name: /build this stack/i }).click();
  await expect(page.getByText("Step 1 of 2", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "AI & Automation", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Add a little more detail (at least 10 characters).", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByLabel("What do you need help with?")
    .fill("We want a connected real estate lead qualification workflow.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Step 2 of 2", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "How can we reach you?" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Add your name.", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Enter a valid email address.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("What do you need help with?")).toHaveValue(
    /connected real estate/,
  );
  await expect(
    page.getByRole("button", { name: "AI & Automation", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "test@example.com",
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Thanks! Your enquiry has been submitted.",
    }),
  ).toBeVisible();
  expect(payload).toMatchObject({
    name: "Test Person",
    email: "test@example.com",
    industry: "Real Estate",
    company: "",
  });
  expect(payload.services).toContain("AI & Automation");
  expect(payload.message).toContain("connected real estate");
});

test("two-step enquiry keeps answers and retries a failed Formspree submission", async ({
  page,
}) => {
  const submissions: unknown[] = [];
  await page.route("https://formspree.io/f/mqpebnqe", async (route) => {
    submissions.push(route.request().postDataJSON());
    await route.fulfill({
      status: submissions.length === 1 ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        submissions.length === 1
          ? { error: "Storage temporarily unavailable. Please retry." }
          : { ok: true },
      ),
    });
  });
  await page.goto("/contact");
  await expect(
    page.getByRole("button", { name: "Technology", exact: true }),
  ).not.toBeVisible();
  await page
    .getByLabel("What do you need help with?")
    .fill("A new customer portal with a connected operating workflow.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "We couldn't send your enquiry" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "test@example.com",
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Thanks! Your enquiry has been submitted.",
    }),
  ).toBeVisible();
  expect(submissions).toHaveLength(2);
  expect(submissions[0]).toEqual(submissions[1]);
});
test("all 42 page URLs resolve and missing slugs return 404", async ({
  request,
}) => {
  test.setTimeout(180000);
  const routes = [
    "/",
    "/services",
    "/solutions",
    "/industries",
    "/work",
    "/team",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    ...caseStudies.map((c) => `/work/${c.slug}`),
    ...articles.map((a) => `/insights/${a.slug}`),
  ];
  const links = new Set<string>();
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
      if (!match[1].startsWith("/_next/"))
        links.add(match[1].replaceAll("&amp;", "&").split("#")[0]);
    }
  }
  for (const href of links)
    if (!routes.includes(href))
      expect((await request.get(href)).status(), href).toBe(200);
  for (const route of [
    "/services/not-real",
    "/industries/not-real",
    "/work/not-real",
    "/insights/not-real",
  ])
    expect((await request.get(route)).status()).toBe(404);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
});

test("mobile detail pages, form and reduced-motion navigation stay usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/services/ai-automation",
    "/industries/field-service",
    "/work/ai-voice-platform",
    "/team",
    "/insights/automation-before-ai",
    "/contact",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBe(true);
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page
    .getByLabel("What do you need help with?")
    .fill("I need a website for my shop.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const contactAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(contactAudit.violations).toEqual([]);
});
