import { expect, test } from '@playwright/test';

/**
 * Smoke tests for @nysds/angular.
 *
 * Verifies the three claims the library makes:
 *   1. ControlValueAccessor round-trip — typing into `<nys-textinput>`
 *      updates Angular's bound signal, which renders into the page.
 *   2. Typed CustomEvent output — dismissing the `<nys-alert>` calls
 *      `(nysClose)` with a real CustomEvent on the Angular side.
 *   3. Two-way binding — `[(open)]` on `<nys-modal>` keeps the boolean
 *      in sync as the dialog opens and closes.
 */

test.describe('@nysds/angular integration', () => {
  test('ngModel round-trips through NysTextinputDirective', async ({ page }) => {
    await page.goto('/');

    // The custom element renders a real <input> in its shadow DOM. Locate by
    // role so we work against the actual focusable surface.
    const input = page.getByTestId('name-input').getByRole('textbox');
    await input.fill('Eric');

    const output = page.getByTestId('name-output');
    await expect(output).toHaveText('Eric');
  });

  test('NysAlertDirective surfaces (nysClose) to Angular', async ({ page }) => {
    await page.goto('/');

    // Click the dismiss button inside the alert's shadow DOM.
    const alert = page.getByTestId('alert');
    await expect(alert).toBeVisible();
    await alert.getByRole('button', { name: /dismiss/i }).click();

    // Alert should disappear and the close timestamp should render.
    await expect(page.getByTestId('alert-closed')).toBeVisible();
  });

  test('NysModalDirective two-way [(open)] stays in sync', async ({ page }) => {
    await page.goto('/');

    const state = page.getByTestId('modal-state');
    await expect(state).toHaveText('false');

    await page.getByTestId('modal-trigger').getByRole('button').click();
    await expect(state).toHaveText('true');

    // Press escape to close, which fires nys-close → openChange(false).
    await page.keyboard.press('Escape');
    await expect(state).toHaveText('false');
  });
});
