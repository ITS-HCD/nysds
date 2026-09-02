import { test, expect } from "@playwright/test";
// @ts-expect-error Plain-JS workspace package without type declarations.
import { watchConsole } from "@nysds/example-shared-tests/console";

test("NgModule app renders NYSDS components and binds ngModel", async ({
  page,
}) => {
  const consoleWatcher = watchConsole(page);
  await page.goto("/");
  await page.waitForSelector("[data-testid='model']");

  // Components registered through NysAngularModule upgraded.
  const upgraded = await page.evaluate(() =>
    ["nys-alert", "nys-textinput", "nys-checkbox", "nys-button"].every(
      (tag) => {
        const el = document.querySelector(tag);
        return !!customElements.get(tag) && !!el && !!el.shadowRoot;
      },
    ),
  );
  expect(upgraded).toBe(true);

  // ngModel round-trips through the ControlValueAccessor.
  await page.locator("nys-textinput[name='name'] input").fill("Jesse");
  await expect
    .poll(async () =>
      JSON.parse(
        await page.locator("[data-testid='model']").innerText(),
      ),
    )
    .toMatchObject({ name: "Jesse" });

  await page.locator("nys-checkbox[name='subscribe'] input").click();
  await expect
    .poll(async () =>
      JSON.parse(
        await page.locator("[data-testid='model']").innerText(),
      ),
    )
    .toMatchObject({ subscribe: true });

  consoleWatcher.assertClean(expect);
});
