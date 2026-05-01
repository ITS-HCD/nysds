import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Match all *.e2e.ts files under packages/
  testMatch: "packages/**/*.e2e.ts",

  // Fail fast — stop on first failure during CI
  // Set to 0 to run all tests regardless of failures
  maxFailures: 0,

  use: {
    headless: true,
    // Give each action generous timeout for web-component upgrade + Lit rendering
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  reporter: [
    ["list"],
    ["json", { outputFile: "playwright-results.json" }],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
});
