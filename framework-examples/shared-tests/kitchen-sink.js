// Kitchen-sink assertions: every NYSDS custom element on the page must
// be defined and upgraded (a shadow root exists), proving that
// importing a framework wrapper registers the underlying element.

import { watchConsole } from "./console.js";

/**
 * Elements that render entirely in light DOM by design (they override
 * `createRenderRoot` to return the host).
 */
const NO_SHADOW_ROOT = new Set([
  "nys-radiobutton",
  "nys-iconlist",
  "nys-processlist",
]);

/**
 * Registers the kitchen-sink test suite.
 *
 * @param {import('@playwright/test')['test']} test
 * @param {import('@playwright/test')['expect']} expect
 * @param {string} path Route of the kitchen-sink page.
 * @param {{ minTags?: number, allow?: RegExp[] }} [options]
 *   `minTags` guards against a page that silently renders almost
 *   nothing; set it near the app's expected distinct tag count.
 */
export function defineKitchenSinkTests(test, expect, path, options = {}) {
  const minTags = options.minTags ?? 40;

  test.describe(`kitchen sink (${path})`, () => {
    test("every nys-* element is defined and upgraded", async ({ page }) => {
      const consoleWatcher = watchConsole(page, { allow: options.allow });
      await page.goto(path);
      await page.waitForSelector("[data-testid='kitchen-sink-ready']", {
        state: "attached",
      });

      const report = await page.evaluate(
        ([noShadow]) => {
          const tags = [
            ...new Set(
              [...document.querySelectorAll("*")]
                .map((el) => el.tagName.toLowerCase())
                .filter((tag) => tag.startsWith("nys-")),
            ),
          ].sort();
          const undefinedTags = tags.filter((t) => !customElements.get(t));
          const notUpgraded = tags.filter((t) => {
            if (noShadow.includes(t)) return false;
            const el = document.querySelector(t);
            return !(el && el.shadowRoot);
          });
          return { tags, undefinedTags, notUpgraded };
        },
        [[...NO_SHADOW_ROOT]],
      );

      expect(report.undefinedTags, "tags never registered").toEqual([]);
      expect(report.notUpgraded, "tags without a shadow root").toEqual([]);
      expect(
        report.tags.length,
        `expected at least ${minTags} distinct nys-* tags, saw ${report.tags.join(", ")}`,
      ).toBeGreaterThanOrEqual(minTags);

      consoleWatcher.assertClean(expect);
    });
  });
}
