import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/pages",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:4173/ODDSTACK/",
    browserName: "chromium",
    channel: process.env.CI ? undefined : "msedge",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/preview-pages.mjs",
    url: "http://127.0.0.1:4173/ODDSTACK/",
    reuseExistingServer: true,
  },
});
