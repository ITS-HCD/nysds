// web-test-runner.config.js
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: ["packages/**/*.test.ts", "src/**/*.test.ts"],
  nodeResolve: true,
  concurrency: 1, // Run tests sequentially for more consistent results
  browsers: [
    playwrightLauncher({ product: "chromium" }), // Run tests in Chromium by default
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
    }),
  ],
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "webkit" }),
  ],
};
