import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const base = process.env.AUDIT_BASE_URL || "http://localhost:3001";
const browser = await launch({
  chromePath,
  chromeFlags: ["--headless", "--disable-gpu"],
  logLevel: "silent",
});
await mkdir("artifacts", { recursive: true });
try {
  const summary = [];
  for (const route of ["/", "/services/ai-automation", "/contact"]) {
    const result = await lighthouse(`${base}${route}`, {
      port: browser.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    });
    if (!result) throw new Error(`No audit result for ${route}`);
    const entry = {
      route,
      scores: Object.fromEntries(
        Object.entries(result.lhr.categories).map(([id, category]) => [
          id,
          Math.round(category.score * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "total-blocking-time",
          "cumulative-layout-shift",
        ].map((id) => [id, result.lhr.audits[id].displayValue]),
      ),
      issues: Object.values(result.lhr.audits)
        .filter(
          (a) =>
            a.score !== null &&
            a.score < 1 &&
            a.details?.type !== "opportunity",
        )
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.displayValue,
          details: a.details?.items?.slice(0, 4),
        })),
    };
    summary.push(entry);
    await writeFile(
      `artifacts/lighthouse-${route === "/" ? "home" : route.replaceAll("/", "-").slice(1)}.json`,
      result.report,
    );
    console.log(
      JSON.stringify({
        route: entry.route,
        scores: entry.scores,
        metrics: entry.metrics,
      }),
    );
  }
  await writeFile(
    "artifacts/lighthouse-summary.json",
    JSON.stringify(summary, null, 2),
  );
} finally {
  await browser.kill();
}
