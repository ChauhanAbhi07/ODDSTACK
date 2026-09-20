import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await mkdir("artifacts", { recursive: true });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
await page.screenshot({ path: "artifacts/hero-desktop.png" });
for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  console.log(
    JSON.stringify(
      await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        elements: [...document.querySelectorAll("body *")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return (
              r.width &&
              r.right > innerWidth + 1 &&
              !e.closest(
                ".capability-strip,.industry-tabs,dialog,.stack-art,.avatar,.case-art,.industry-detail",
              )
            );
          })
          .map((e) => ({
            tag: e.tagName,
            class: e.className,
            right: e.getBoundingClientRect().right,
            text: e.textContent?.slice(0, 60),
          }))
          .slice(0, 15),
      })),
    ),
  );
}
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
await page.screenshot({ path: "artifacts/hero-mobile.png" });
await browser.close();
