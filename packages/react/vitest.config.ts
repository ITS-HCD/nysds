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
  // Pre-bundle the CommonJS React entry points up front. Discovering them
  // mid-run makes the browser page reload while the tester is connecting,
  // which can wedge the run before any test reports.
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "react-dom/test-utils",
      "@lit/react",
    ],
  },
  resolve: {
    alias: react18
      ? [
          { find: /^react-dom\/client$/, replacement: r18("react-dom/client.js") },
          { find: /^react-dom$/, replacement: r18("react-dom/index.js") },
          { find: /^react\/jsx-runtime$/, replacement: r18("react/jsx-runtime.js") },
          { find: /^react\/jsx-dev-runtime$/, replacement: r18("react/jsx-dev-runtime.js") },
          { find: /^react$/, replacement: r18("react/index.js") },
        ]
      : [],
  },
  test: {
    include: ["test/**/*.test.tsx"],
    browser: {
      enabled: true,
      headless: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
  },
});
