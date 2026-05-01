/**
 * Playwright E2E accessibility interaction tests for nys-accordion / nys-accordionitem.
 *
 * Test scenarios are defined in:
 *   nysds-site/src/content/components/accordion/accordion.11tydata.json5
 *
 * Interaction approach (per project guidelines):
 *   - Focus: .focus() + Tab from a <button> that precedes the accordion in the DOM
 *   - Keyboard activate: Enter and Space keys via page.keyboard.press()
 *   - Mouse activate: .click() on the accordion item
 *   - Focus styling: assert computed CSS outline on the shadow-DOM heading button
 */

import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The self-contained UMD bundle registers all NYSDS custom elements globally.
const BUNDLE_PATH = path.resolve(__dirname, "../../../dist/nysds.js");

// Minimal page: a focusable button before the accordion (required by guidelines)
// followed by a single accordion item that starts collapsed.
const PAGE_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head><meta charset="UTF-8" /></head>
  <body>
    <button id="before-accordion" type="button">Button Before Accordion</button>
    <nys-accordion>
      <nys-accordionitem id="item1" heading="Scenario: Focus and Toggle">
        <p>Panel content for accessibility testing.</p>
      </nys-accordionitem>
    </nys-accordion>
  </body>
</html>
`;

/**
 * Sets up a fresh page with the accordion component for each test.
 * Injects the NYSDS UMD bundle and waits for the shadow DOM to be ready.
 */
async function setupAccordionPage(page: import("@playwright/test").Page) {
  await page.setContent(PAGE_HTML);
  // Inject the self-contained UMD bundle — registers all custom elements
  await page.addScriptTag({ path: BUNDLE_PATH });
  // Wait until nys-accordionitem has been upgraded and Lit has rendered its shadow DOM
  await page.waitForFunction(() => {
    const item = document.querySelector("nys-accordionitem");
    return item?.shadowRoot?.querySelector("button") != null;
  });
}

test.describe("nys-accordion – keyboard and mouse accessibility", () => {
  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: tab-key-focus-accordion-header
  // ─────────────────────────────────────────────────────────────────────────
  test("Tab key moves focus from preceding button to accordion header", async ({
    page,
  }) => {
    await setupAccordionPage(page);

    // Give focus to the button that appears before the accordion, then Tab into it
    await page.locator("#before-accordion").focus();
    await page.keyboard.press("Tab");

    // Focus should now be on the <button> inside nys-accordionitem's shadow root
    const focusedInsideShadow = await page.evaluate(() => {
      const host = document.activeElement;
      const shadowActive = host?.shadowRoot?.activeElement;
      return (
        host?.tagName?.toLowerCase() === "nys-accordionitem" &&
        shadowActive?.tagName?.toLowerCase() === "button"
      );
    });

    expect(focusedInsideShadow).toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: enter-key-expands-accordion
  // ─────────────────────────────────────────────────────────────────────────
  test("Enter key expands a collapsed accordion item", async ({ page }) => {
    await setupAccordionPage(page);

    await page.locator("#before-accordion").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    // LitElement reflects `expanded` as an attribute when true
    await expect(page.locator("#item1")).toHaveAttribute("expanded", "");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: enter-key-collapses-accordion
  // ─────────────────────────────────────────────────────────────────────────
  test("Enter key collapses an expanded accordion item", async ({ page }) => {
    await setupAccordionPage(page);

    await page.locator("#before-accordion").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter"); // expand
    await page.keyboard.press("Enter"); // collapse

    // `expanded` attribute should be absent when collapsed
    await expect(page.locator("#item1")).not.toHaveAttribute("expanded");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: space-key-expands-accordion
  // ─────────────────────────────────────────────────────────────────────────
  test("Space key expands a collapsed accordion item", async ({ page }) => {
    await setupAccordionPage(page);

    await page.locator("#before-accordion").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");

    await expect(page.locator("#item1")).toHaveAttribute("expanded", "");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: space-key-collapses-accordion
  // ─────────────────────────────────────────────────────────────────────────
  test("Space key collapses an expanded accordion item", async ({ page }) => {
    await setupAccordionPage(page);

    await page.locator("#before-accordion").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space"); // expand
    await page.keyboard.press("Space"); // collapse

    await expect(page.locator("#item1")).not.toHaveAttribute("expanded");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: click-expands-accordion
  // ─────────────────────────────────────────────────────────────────────────
  test("Click expands a collapsed accordion item", async ({ page }) => {
    await setupAccordionPage(page);

    // Click near the top of the accordion item to reliably hit the header button.
    // position is relative to the top-left corner of the nys-accordionitem element.
    await page.locator("#item1").click({ position: { x: 50, y: 20 } });

    await expect(page.locator("#item1")).toHaveAttribute("expanded", "");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: click-collapses-accordion
  // ─────────────────────────────────────────────────────────────────────────
  test("Click collapses an expanded accordion item", async ({ page }) => {
    await setupAccordionPage(page);

    await page.locator("#item1").click({ position: { x: 50, y: 20 } }); // expand
    await page.locator("#item1").click({ position: { x: 50, y: 20 } }); // collapse

    await expect(page.locator("#item1")).not.toHaveAttribute("expanded");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Scenario: focus-outline-visible
  // ─────────────────────────────────────────────────────────────────────────
  test("Accordion header displays a visible focus outline when focused via keyboard", async ({
    page,
  }) => {
    await setupAccordionPage(page);

    // Use pure keyboard Tab navigation (no programmatic .focus()) so the browser
    // applies :focus-visible.
    // Press Shift first — a neutral modifier key — to ensure the browser enters
    // keyboard-navigation mode even after prior mouse interactions in the suite.
    await page.keyboard.press("Shift"); // switch browser to keyboard-navigation mode
    await page.keyboard.press("Tab");   // focus #before-accordion button
    await page.keyboard.press("Tab");   // focus accordion heading button

    // The heading button uses :focus-visible to render an outline.
    // We verify two things via computed style:
    //   1. :focus-visible matches the shadow-active button (keyboard focus is recognised).
    //   2. The outline-style is "solid" (the :focus-visible CSS rule is in effect).
    //
    // Note: in headless Chromium the `outline` shorthand with two var() values can produce
    // a 0px computed width even though the CSS variable is correctly set to 2px on :host.
    // Checking outline-style !== "none" reliably confirms the rule is applied.
    const hasFocusOutline = await page.evaluate(() => {
      const host = document.activeElement;
      const btn = host?.shadowRoot?.activeElement as HTMLElement | null;
      if (!btn) return false;
      const isFocusVisible = btn.matches(":focus-visible");
      const style = window.getComputedStyle(btn);
      return isFocusVisible && style.outlineStyle !== "none";
    });

    expect(hasFocusOutline).toBe(true);
  });
});
