// Forms assertions shared by every example app and form variant.
//
// The page contract (same in every app):
// - Fields, addressed by `data-field` on the custom element (not `name`:
//   Angular's Signal Forms overwrite `name` with a generated path):
//   firstName
//   (nys-textinput, required), bio (nys-textarea), state (nys-select),
//   county (nys-combobox), dob (nys-datepicker), agree (nys-checkbox),
//   languages (nys-checkboxgroup, values en/es), contact (nys-radiogroup,
//   values email/phone), newsletter (nys-toggle), resume (nys-fileinput).
// - `[data-testid="model"]`: <pre> with the live model as JSON.
// - `[data-testid="submitted"]`: <pre> with the last valid submission as
//   JSON; empty before the first valid submit.
// - `[data-testid="submit"]`, `[data-testid="reset"]`: form actions.
// - `[data-testid="toggle-disabled"]`: flips firstName's disabled state
//   through the framework.

import { watchConsole } from "./console.js";

async function model(page) {
  const text = await page.locator("[data-testid='model']").innerText();
  return text.trim() ? JSON.parse(text) : null;
}

function pollModel(expect, page, pick) {
  return expect.poll(async () => pick(await model(page)));
}

/**
 * Registers the forms test suite for one form variant.
 *
 * @param {import('@playwright/test')['test']} test
 * @param {import('@playwright/test')['expect']} expect
 * @param {string} path Route of the forms page variant.
 * @param {{ reduced?: boolean, allow?: RegExp[], skipSelector?: string }} [options]
 *   `reduced` runs the core subset (textinput, checkbox, radiogroup,
 *   submit, reset) for variants that only render those fields.
 *   `skipSelector` skips the whole suite when the selector is present on
 *   the page (a variant that this build cannot provide).
 */
export function defineFormsTests(test, expect, path, options = {}) {
  const reduced = options.reduced ?? false;

  test.describe(`forms (${path})`, () => {
    /** @type {ReturnType<typeof watchConsole>} */
    let consoleWatcher;

    test.beforeEach(async ({ page }) => {
      consoleWatcher = watchConsole(page, { allow: options.allow });
      await page.goto(path);
      if (options.skipSelector) {
        await page.waitForLoadState("networkidle");
        const skip = await page.locator(options.skipSelector).count();
        test.skip(
          skip > 0,
          `this build does not provide the ${path} variant`,
        );
      }
      await page.waitForSelector("[data-testid='model']");
    });

    test.afterEach(() => {
      consoleWatcher.assertClean(expect);
    });

    test("typing updates the model", async ({ page }) => {
      await page.locator("nys-textinput[data-field='firstName'] input").fill("Jane");
      await pollModel(expect, page, (m) => m.firstName).toBe("Jane");

      if (!reduced) {
        await page
          .locator("nys-textarea[data-field='bio'] textarea")
          .fill("Hello from Albany.");
        await pollModel(expect, page, (m) => m.bio).toBe("Hello from Albany.");
      }
    });

    test("checkbox, radio group, and toggle update the model", async ({
      page,
    }) => {
      await page.locator("nys-checkbox[data-field='agree'] input").click();
      await pollModel(expect, page, (m) => m.agree).toBe(true);

      // The wrappers set `value` as a property (no attribute reflection),
      // so child radios and checkboxes are selected by accessible name.
      await page.getByRole("radio", { name: "Email" }).click();
      await pollModel(expect, page, (m) => m.contact).toBe("email");

      if (!reduced) {
        await page.getByRole("checkbox", { name: "Spanish" }).click();
        await pollModel(expect, page, (m) => m.languages).toContain("es");

        // The toggle's native input is visually hidden; click the slider.
        await page.locator("nys-toggle[data-field='newsletter'] .slider").click();
        await pollModel(expect, page, (m) => m.newsletter).toBe(true);
      }
    });

    if (!reduced) {
      test("select, combobox, and datepicker update the model", async ({
        page,
      }) => {
        await page
          .locator("nys-select[data-field='state'] select")
          .selectOption("NY");
        await pollModel(expect, page, (m) => m.state).toBe("NY");

        const comboInput = page.locator("nys-combobox[data-field='county'] input");
        await comboInput.click();
        await comboInput.fill("Alb");
        await page
          .locator("nys-combobox [role='option']", { hasText: "Albany" })
          .first()
          .click();
        await pollModel(expect, page, (m) => m.county).toBe("albany");

        // First input is the date field; the calendar popup holds more.
        const dobInput = page
          .locator("nys-datepicker[data-field='dob'] input")
          .first();
        await dobInput.fill("1990-01-15");
        // The committed YYYY-MM-DD string dispatches on blur (nys-change).
        await dobInput.blur();
        await pollModel(expect, page, (m) => m.dob).toBe("1990-01-15");
      });

      test("file input records the file", async ({ page }) => {
        await page
          .locator("nys-fileinput[data-field='resume'] input[type='file']")
          .setInputFiles({
            name: "resume.pdf",
            mimeType: "application/pdf",
            buffer: Buffer.from("example resume"),
          });
        await pollModel(expect, page, (m) => m.resume).toBe("resume.pdf");
      });

      test("framework disabled state reaches the element", async ({
        page,
      }) => {
        const firstName = page.locator("nys-textinput[data-field='firstName']");
        await page.locator("[data-testid='toggle-disabled']").click();
        await expect(firstName).toHaveJSProperty("disabled", true);
        await page.locator("[data-testid='toggle-disabled']").click();
        await expect(firstName).toHaveJSProperty("disabled", false);
      });
    }

    test("invalid submit shows an error and writes no readout", async ({
      page,
    }) => {
      await page.locator("[data-testid='submit']").click();
      const firstName = page.locator("nys-textinput[data-field='firstName']");
      await expect(firstName).toHaveJSProperty("showError", true);
      await expect(page.locator("[data-testid='submitted']")).toHaveText("");
    });

    test("valid submit writes the readout; reset clears it all", async ({
      page,
    }) => {
      await page.locator("nys-textinput[data-field='firstName'] input").fill("Jane");
      await page.locator("[data-testid='submit']").click();

      await expect
        .poll(async () => {
          const text = await page
            .locator("[data-testid='submitted']")
            .innerText();
          return text.trim() ? JSON.parse(text).firstName : null;
        })
        .toBe("Jane");

      await page.locator("[data-testid='reset']").click();
      await pollModel(expect, page, (m) => m.firstName).toBe("");
      await expect(
        page.locator("nys-textinput[data-field='firstName'] input"),
      ).toHaveValue("");
    });
  });
}
