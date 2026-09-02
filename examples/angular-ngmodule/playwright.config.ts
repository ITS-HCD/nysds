import { defineConfig, devices } from "@playwright/test";

const PORT = 4276;

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
    command: "node ../scripts/serve-static.mjs dist/app/browser 4276",
    port: PORT,
    reuseExistingServer: false,
  },
});
