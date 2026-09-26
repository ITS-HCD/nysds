// Console watcher shared by every example app's smoke tests.
//
// The contract: a production build of an example app logs zero console
// errors, zero Lit change-in-update warnings, and zero hydration
// warnings. Anything else fails the test that called `assertClean`.

/** Messages that are noise, not contract violations. */
const DEFAULT_ALLOW = [
  /Download the React DevTools/i,
  /\[vite\]/,
  /Angular is running in development mode/i,
];

/**
 * Starts collecting console messages and page errors on `page`.
 * Call before `page.goto`. Returns a watcher with `assertClean(expect)`.
 *
 * @param {import('playwright-core').Page} page
 * @param {{ allow?: RegExp[] }} [options]
 */
export function watchConsole(page, options = {}) {
  const allow = [...DEFAULT_ALLOW, ...(options.allow ?? [])];
  /** @type {string[]} */
  const violations = [];

  const allowed = (text) => allow.some((re) => re.test(text));

  page.on("console", (msg) => {
    const text = msg.text();
    if (allowed(text)) return;
    if (msg.type() === "error") {
      violations.push(`console.error: ${text}`);
      return;
    }
    if (msg.type() === "warning") {
      if (/change-in-update/i.test(text)) {
        violations.push(`Lit change-in-update warning: ${text}`);
      } else if (/hydrat/i.test(text)) {
        violations.push(`hydration warning: ${text}`);
      }
    }
    // Hydration mismatches log as console.error in React 18/19; the
    // error branch already catches those.
  });

  page.on("pageerror", (error) => {
    violations.push(`pageerror: ${error.message}`);
  });

  return {
    violations,
    /** @param {import('@playwright/test')['expect']} expect */
    assertClean(expect) {
      expect(violations, violations.join("\n")).toEqual([]);
    },
  };
}
