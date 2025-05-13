import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: ["packages/**/*.test.ts", "src/**/*.test.ts"],
  nodeResolve: true,
  concurrency: 1,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      launchOptions: {
        headless: false, // Forces the browser to open in non-headless mode
        slowMo: 250, // Optional: slows down operations to make debugging easier
      },
    }),
  ],
  coverage: true, // Enable coverage reporting
  testFramework: {
    config: {
      timeout: 3000,
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
