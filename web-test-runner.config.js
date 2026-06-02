import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher, devices } from "@web/test-runner-playwright";
// import { nysdsReporter } from './src/scripts/nysds-reporter.js';

// Firefox declared the Lit is in DEV mode. this filters out that message to reduce the chatter in the testing logs
const filteredLogs = [
  'Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.'
]

const filterBrowserLogs = (log) => {
  for (const arg of log.args) {
    if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
      return false
    }
  }
  return true
}

export default {
  files: ["packages/**/*.test.ts", "src/**/*.test.ts", "!packages/mcp-server/**"],
  nodeResolve: true,
  filterBrowserLogs,
  // reporters: [nysdsReporter()],
  browserStartTimeout: 60000,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      launchOptions: {
        headless: true,
        slowMo: 250,
      },
    }),
    playwrightLauncher({
      product: "webkit",
      launchOptions: {
        headless: true,
        slowMo: 250,
      },
    }),
    playwrightLauncher({
      product: 'webkit',
      launchOptions: {
        headless: true,
        slowMo: 250,
      },
      createBrowserContext({ browser }) {
        return browser.newContext({ ...devices['iPhone 14'], hasTouch: true });
      },
    }),
    playwrightLauncher({
      product: 'webkit',
      launchOptions: {
        headless: true,
        slowMo: 250,
      },
      createBrowserContext({ browser }) {
        return browser.newContext({ ...devices['Pixel 5'], hasTouch: true });
      },
    }),
    playwrightLauncher({
      product: 'webkit',
      launchOptions: {
        headless: true,
        slowMo: 250,
      },
      createBrowserContext({ browser }) {
        return browser.newContext({ ...devices['Desktop Edge'], channel: 'msedge' });
      },
    }),
    playwrightLauncher({
      product: "firefox",
      launchOptions: {
        headless: true,
        slowMo: 250,
      },
    }),
  ],
  coverage: true, // Enable coverage reporting
  testFramework: {
    config: {
      timeout: 9000,
      retries: 1,
    },
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      target: "es2021",
      decorators: true, // Enable decorator support
    }),
  ],
  coverageConfig: {
    exclude: ["**/node_modules/**", "**/test/**"],
    threshold: {
      statements: 80,
      functions: 80,
      branches: 80,
      lines: 80,
    }
  },
};
