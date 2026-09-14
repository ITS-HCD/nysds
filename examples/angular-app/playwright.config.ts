import { defineConfig, devices } from "@playwright/test";

const PORT = 4275;
// `npm run test:zoneless` points this at dist/app-zoneless/browser.
const DIST = process.env.APP_DIST ?? "dist/app/browser";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `node ../scripts/serve-static.mjs ${DIST} ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
  },
});
