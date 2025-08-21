import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

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
  files: ["packages/**/*.test.ts", "src/**/*.test.ts"],
  nodeResolve: true,
  filterBrowserLogs,
  concurrentBrowsers: 3,
  concurrency: 4,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      launchOptions: {
        headless: true, // Forces the browser to open in headless mode
        slowMo: 250, // Optional: slows down operations to make debugging easier
      },
    }),
    playwrightLauncher({
      product: "webkit",
      launchOptions: {
        headless: true, // Forces the browser to open in non-headless mode
        slowMo: 250, // Optional: slows down operations to make debugging easier
      },
    }),
    playwrightLauncher({
      product: "firefox",
      launchOptions: {
        headless: true, // Forces the browser to open in non-headless mode
        slowMo: 250, // Optional: slows down operations to make debugging easier
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
      target: "es2020",
      decorators: true, // Enable decorator support
    }),
  ],
  coverageConfig: {
    exclude: ["**/node_modules/**", "**/test/**"],
  },
};
