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
test("navigation, capability disclosure and solution dialog work with keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const capability = page.getByRole("button", { name: /02.*Technology/ });
  await capability.click();
  await expect(capability).toHaveAttribute("aria-expanded", "true");
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
});
test("finder hands a valid stack to the complete project wizard", async ({
  page,
}) => {
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
  await expect(page.getByText("Here's your starting stack.")).toBeVisible();
  await page.getByRole("link", { name: /build this stack/i }).click();
  await expect(page).toHaveURL(/\/contact\?stack=/);
  await expect(
    page.getByRole("button", { name: "AI & Automation", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Choose what you want to do.")).toBeVisible();
  await page
    .getByRole("button", { name: "Grow something", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Industry", { exact: true })).toHaveValue(
    "Real Estate",
  );
  await page.getByRole("button", { name: "2–10 people", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Let's figure it out", exact: true })
    .click();
  await page.getByRole("button", { name: "1–3 months", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Your project, in your words")
    .fill(
      "We want a connected real estate lead qualification and follow-up workflow.",
    );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "1–3 months", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Your project, in your words")).toHaveValue(
    /connected real estate/,
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Test Person");
  await page
    .getByLabel("Company / project", { exact: true })
    .fill("Browser Test Project");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByRole("button", { name: "Send my brief" }).click();
  await expect(
    page.getByText(/saved locally for this development demo/),
  ).toBeVisible();
});
test("wizard keeps answers when saving fails", async ({ page }) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Storage temporarily unavailable. Please retry.",
      }),
    }),
  );
  await page.goto("/contact");
  await page
    .getByRole("button", { name: "Build something", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Industry", { exact: true }).selectOption("Other");
  await page.getByRole("button", { name: "Just me", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Let's figure it out", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Just exploring", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Your project, in your words")
    .fill("A new customer portal with a connected operating workflow.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Test Person");
  await page
    .getByLabel("Company / project", { exact: true })
    .fill("Demo Project");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByRole("button", { name: "Send my brief" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Storage temporarily unavailable" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "test@example.com",
  );
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
    .getByRole("button", { name: "Build something", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Industry", { exact: true })).toBeVisible();
});
