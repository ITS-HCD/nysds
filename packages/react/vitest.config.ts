import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Smoke tests run in real Chromium (Playwright) because the components
 * are form-associated custom elements: they need a real custom element
 * registry, shadow DOM, and ElementInternals, which jsdom does not
 * provide. Playwright browsers are already installed for the repo's
 * web-test-runner suite.
 *
 * REACT_VERSION=18 aliases react and react-dom to the React 18 copy
 * installed under test/react18/ (see `npm run test:react18`), so the
 * same suite runs against both supported majors. WS5 wires the CI
 * matrix.
 */
const react18 = process.env.REACT_VERSION === "18";

const r18 = (subpath: string) =>
  fileURLToPath(
    new URL(`./test/react18/node_modules/${subpath}`, import.meta.url)
  );

export default defineConfig({
  resolve: react18
    ? {
        alias: [
          { find: /^react-dom\/client$/, replacement: r18("react-dom/client.js") },
          { find: /^react-dom$/, replacement: r18("react-dom/index.js") },
          { find: /^react\/jsx-runtime$/, replacement: r18("react/jsx-runtime.js") },
          { find: /^react\/jsx-dev-runtime$/, replacement: r18("react/jsx-dev-runtime.js") },
          { find: /^react$/, replacement: r18("react/index.js") },
        ],
      }
    : {},
  test: {
    globals: true,
    include: ["test/**/*.test.{ts,tsx}"],
    browser: {
      enabled: true,
      headless: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
      api: {
        host: "127.0.0.1",
        port: 51204,
      },
      fileParallelism: false,
    },
  },
});
