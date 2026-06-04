import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher, devices } from "@web/test-runner-playwright";
import { nysdsReporter } from "./src/scripts/nysds-reporter.js";

// Firefox declared the Lit is in DEV mode. this filters out that message to reduce the chatter in the testing logs
const filteredLogs = [
  "Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.",
];

const filterBrowserLogs = (log) => {
  for (const arg of log.args) {
    if (typeof arg === "string" && filteredLogs.some((l) => arg.includes(l))) {
      return false;
    }
  }
  return true;
};

const coverageThreshold = {
  statements: 70,
  functions: 70,
  branches: 70,
  lines: 70,
};

export default {
  files: [
    "packages/**/*.test.ts",
    "src/**/*.test.ts",
    "!packages/mcp-server/**",
  ],
  nodeResolve: true,
  filterBrowserLogs,
  reporters: [nysdsReporter({ coverageThreshold })],
  browserStartTimeout: 60000,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
    }),
    playwrightLauncher({
      product: "webkit",
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
    }),
    playwrightLauncher({
      product: "webkit",
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
      createBrowserContext({ browser }) {
        return browser.newContext({ ...devices["iPhone 14"], hasTouch: true });
      },
    }),
    playwrightLauncher({
      product: "webkit",
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
      createBrowserContext({ browser }) {
        return browser.newContext({ ...devices["Pixel 5"], hasTouch: true });
      },
    }),
    playwrightLauncher({
      product: "webkit",
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
      createBrowserContext({ browser }) {
        return browser.newContext({
          ...devices["Desktop Edge"],
          channel: "msedge",
        });
      },
    }),
    playwrightLauncher({
      product: "firefox",
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
      },
    }),
  ],
  coverage: true, // Enable coverage reporting
  testFramework: {
    config: {
      timeout: 90000,
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
    threshold: coverageThreshold,
  },
};
