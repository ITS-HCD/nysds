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
    command: 'npm run preview',
    port: 4321,
    timeout: 60_000,
    reuseExistingServer: !process.env['CI'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
