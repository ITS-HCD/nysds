// Events-page assertions shared by every example app.
//
// The page contract:
// - `[data-testid="event-log"]`: a <ul> where each handled event appends
//   `<li>eventName detailJson</li>`.
// - A dismissible nys-alert.
// - `[data-testid="open-modal"]` opens a nys-modal two-way bound to
//   state shown in `[data-testid="modal-state"]` (`open` / `closed`).
// - A nys-pagination with several pages.
// - A nys-tabgroup with at least two tabs.
// - A nys-button trigger plus nys-dropdownmenu with items.

import { watchConsole } from "./console.js";

function logEntries(page) {
  return page.locator("[data-testid='event-log'] li");
}

/**
 * Registers the events test suite.
 *
 * @param {import('@playwright/test')['test']} test
 * @param {import('@playwright/test')['expect']} expect
 * @param {string} path Route of the events page.
 * @param {{ allow?: RegExp[] }} [options]
 */
export function defineEventsTests(test, expect, path, options = {}) {
  test.describe(`events (${path})`, () => {
    /** @type {ReturnType<typeof watchConsole>} */
    let consoleWatcher;

    test.beforeEach(async ({ page }) => {
      consoleWatcher = watchConsole(page, { allow: options.allow });
      await page.goto(path);
      await page.waitForSelector("[data-testid='event-log']", {
        state: "attached",
      });
    });

    test.afterEach(() => {
      consoleWatcher.assertClean(expect);
    });

    test("alert close delivers a typed detail", async ({ page }) => {
      await page.locator("nys-alert #dismiss-btn").click();
      const entry = logEntries(page).filter({ hasText: "nys-close" }).first();
      await expect(entry).toBeVisible();
      // The handler serializes e.detail; a typed detail carries the id.
      await expect(entry).toContainText('"id"');
    });

    test("modal opens and closes through two-way state", async ({ page }) => {
      const state = page.locator("[data-testid='modal-state']");
      await expect(state).toHaveText("closed");

      await page.locator("[data-testid='open-modal']").click();
      await expect(state).toHaveText("open");
      await expect(page.locator("nys-modal [role='dialog']")).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(state).toHaveText("closed");
      await expect(
        logEntries(page).filter({ hasText: "nys-close" }).first(),
      ).toBeVisible();
    });

    test("pagination change reports the new page", async ({ page }) => {
      await page
        .locator("nys-pagination button", { hasText: "2" })
        .first()
        .click();
      const entry = logEntries(page).filter({ hasText: "nys-change" }).first();
      await expect(entry).toBeVisible();
      await expect(entry).toContainText('"page": 2');
    });

    test("tab select reports the tab", async ({ page }) => {
      await page.locator("nys-tab", { hasText: "Second" }).click();
      await expect(
        logEntries(page).filter({ hasText: "nys-tab-select" }).first(),
      ).toBeVisible();
    });

    test("dropdown menu item select delivers its label", async ({ page }) => {
      await page.locator("[data-testid='menu-trigger']").click();
      await page
        .locator("nys-dropdownmenuitem", { hasText: "Duplicate" })
        .click();
      const entry = logEntries(page).filter({ hasText: "nys-click" }).first();
      await expect(entry).toBeVisible();
      await expect(entry).toContainText("Duplicate");
    });
  });
}
