import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the @nysds/angular smoke test.
 *
 * Spins up a vite preview server before running the spec. Run locally with
 * `npm run build && npm test` from `packages/angular/integration-test/`.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Use vite dev rather than preview so the suite is self-contained — no
    // separate `npm run build` step required before `npm test`. Analog
    // compiles the Angular standalone components on the first request.
    command: 'npm run dev',
    port: 4321,
    timeout: 120_000,
    reuseExistingServer: !process.env['CI'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
