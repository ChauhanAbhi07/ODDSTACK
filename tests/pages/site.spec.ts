import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { services } from "../../src/data/services";
import { industries } from "../../src/data/industries";

test("export serves public pages and assets under the GitHub project path", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const route of [
    "",
    "services",
    "solutions",
    "industries",
    "work",
    "team",
    "insights",
    "about",
    "contact",
    "privacy",
    "terms",
    ...services.map((s) => `services/${s.slug}`),
    ...industries.map((i) => `industries/${i.slug}`),
  ]) {
    const response = await request.get(`/ODDSTACK/${route}${route ? "/" : ""}`);
    expect(response.status(), route).toBe(200);
  }
  await page.goto("/ODDSTACK/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your business",
  );
  const links = await page
    .locator('a[href^="/"]')
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")!));
  for (const link of links) {
    expect(link.startsWith("/ODDSTACK/"), link).toBe(true);
    expect((await request.get(link)).status(), link).toBe(200);
  }
  expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toBe(
    "https://chauhanabhi07.github.io/ODDSTACK/",
  );
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  expect(
    (await request.get("/ODDSTACK/work/ai-voice-platform/")).status(),
  ).toBe(404);
  expect(errors).toEqual([]);
});

test("static enquiry sends all details to Formspree in two steps", async ({
  page,
}) => {
  let submitted: Record<string, unknown> = {};
  await page.route("https://formspree.io/f/mqpebnqe", async (route) => {
    submitted = route.request().postDataJSON();
    expect(route.request().headers().accept).toBe("application/json");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/")) apiRequests.push(request.url());
  });
  await page.goto("/ODDSTACK/");
  await page
    .getByRole("link", { name: "I need a website", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Build your stack", exact: true })
    .click();
  await page.waitForURL("**/contact/**");
  await expect(
    page.getByRole("button", { name: "Technology", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "UI/UX & Product", exact: true })
    .click();
  await expect(page.getByText("Step 1 of 2", { exact: true })).toBeVisible();
  await page
    .getByLabel("What do you need help with?")
    .fill("A new website for my local business with clear contact options.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Step 2 of 2", { exact: true })).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("Preview Visitor");
  await page
    .getByLabel("Company / project (optional)", { exact: true })
    .fill("Preview Business");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Thanks! Your enquiry has been submitted.",
    }),
  ).toBeVisible();
  expect(submitted).toMatchObject({
    name: "Preview Visitor",
    email: "visitor@example.com",
    company: "Preview Business",
    message: "A new website for my local business with clear contact options.",
    services: "Technology, UI/UX & Product",
    subject: "New ODDESTACK website enquiry",
    _gotcha: "",
  });
  expect(apiRequests).toEqual([]);
  await page.getByRole("button", { name: "Start a new enquiry" }).click();
  await expect(page.getByLabel("What do you need help with?")).toHaveValue("");
});

test("Formspree errors and network failures preserve details without showing success", async ({
  page,
}) => {
  let attempts = 0;
  await page.route("https://formspree.io/f/mqpebnqe", async (route) => {
    attempts++;
    if (attempts === 1)
      return route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          errors: [
            { field: "email", message: "Please use another email address." },
          ],
        }),
      });
    if (attempts === 2) return route.abort("failed");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
  await page.goto("/ODDSTACK/contact/");
  await page
    .getByLabel("What do you need help with?")
    .fill("Please build a website for my shop.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Preview Visitor");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByText("Please use another email address.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Thanks! Your enquiry has been submitted.",
    }),
  ).not.toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "visitor@example.com",
  );
  await page.getByLabel("Email", { exact: true }).fill("updated@example.com");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "We couldn't confirm your enquiry.",
  );
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "updated@example.com",
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Thanks! Your enquiry has been submitted.",
    }),
  ).toBeVisible();
  expect(attempts).toBe(3);
});
