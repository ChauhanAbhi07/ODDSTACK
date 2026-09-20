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

test("static enquiry preserves selections and prepares email without posting to a backend", async ({
  page,
}) => {
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/")) apiRequests.push(request.url());
  });
  await page.goto("/ODDSTACK/");
  await page
    .getByRole("link", { name: "Build my website", exact: true })
    .click();
  await page.waitForURL("**/contact/**");
  await expect(
    page.getByRole("button", { name: "Technology", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
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
    .fill("A new website for my local business with clear contact options.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Preview Visitor");
  await page
    .getByLabel("Company / project", { exact: true })
    .fill("Preview Business");
  await page.getByLabel("Email", { exact: true }).fill("visitor@example.com");
  await page.getByRole("button", { name: "Prepare email brief" }).click();
  await expect(
    page.getByRole("heading", { name: "Your brief is ready to email." }),
  ).toBeVisible();
  const href = await page
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(href).toContain("mailto:iamabhishekk2003@gmail.com?");
  expect(decodeURIComponent(href!)).toContain("visitor@example.com");
  await expect(page.getByRole("textbox")).toHaveValue(
    /Technology, UI\/UX & Product/,
  );
  await expect(page.getByText(/Nothing has been sent yet/)).toBeVisible();
  await page.getByRole("button", { name: "Edit my brief" }).click();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "visitor@example.com",
  );
  expect(apiRequests).toEqual([]);
});
