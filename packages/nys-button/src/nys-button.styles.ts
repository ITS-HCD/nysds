import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Button Styles */
    --_nys-button-height: var(--nys-size-600, 48px);
    --_nys-button-radius: var(--nys-border-radius-xl, 12px);
    --_nys-button-padding-y: var(--nys-space-150, 12px);
    --_nys-button-padding-x: var(--nys-space-250, 20px);
    --_nys-button-gap: var(--nys-space-100, 8px);
    --_nys-button-width-border: var(--nys-border-width-md, 2px);
    --_nys-button-width-focus: var(--nys-border-width-md, 2px);
    --_nys-button-offset-focus: var(--nys-space-2px, 2px);
    --_nys-button-color-focus: var(--nys-color-focus, #004dd1);

    /* Global Button Colors */
    --_nys-button-color-bg: var(--nys-color-theme, #154973);
    --_nys-button-color-text: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-border: var(--nys-color-theme, #154973);

    --_nys-button-color-bg-hover: var(--nys-color-theme-strong, #0e324f);
    --_nys-button-color-text-hover: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-border-hover: var(--nys-color-theme-strong, #0e324f);

    --_nys-button-color-bg-active: var(--nys-color-theme-stronger, #081b2b);
    --_nys-button-color-text-active: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-border-active: var(--nys-color-theme-stronger, #081b2b);

    --_nys-button-color-bg-disabled: var(--nys-color-neutral-10, ##f6f6f6);
    --_nys-button-color-text-disabled: var(--nys-color-neutral-300, ##a7a9ab);
    --_nys-button-color-border-disabled: var(--nys-color-neutral-10, ##f6f6f6);

    /* Typography */
    --_nys-button-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-button-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-button-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-button-font-family: var(
      --nys-font-family-ui,
      var(
        --nys-font-family-sans,
        "Proxima Nova",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        sans-serif
      )
    );
  }

  /* Sizes */
  :host([size="sm"]) {
    --_nys-button-height: var(--nys-size-500, 40px);
    --_nys-button-padding-y: var(--nys-space-100, 8px);
    --_nys-button-padding-x: var(--nys-space-200, 16px);
  }
  :host([size="md"]) {
    --_nys-button-height: var(--nys-size-600, 48px);
    --_nys-button-padding-y: var(--nys-space-150, 12px);
    --_nys-button-padding-x: var(--nys-space-250, 20px);
  }
  :host([size="lg"]) {
    --_nys-button-height: var(--nys-size-700, 56px);
    --_nys-button-padding-y: var(--nys-space-200, 16px);
    --_nys-button-padding-x: var(--nys-space-300, 24px);
  }

  /* Variants */
  :host([variant="filled"]) {
    --_nys-button-color-bg: var(--nys-color-theme, #154973);
    --_nys-button-color-text: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-border: var(--nys-color-theme, #154973);

    --_nys-button-color-bg-hover: var(--nys-color-theme-strong, #0e324f);
    --_nys-button-color-text-hover: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-border-hover: var(--nys-color-theme-strong, #0e324f);

    --_nys-button-color-bg-active: var(--nys-color-theme-stronger, #081b2b);
    --_nys-button-color-text-active: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-border-active: var(--nys-color-theme-stronger, #081b2b);

    --_nys-button-color-bg-disabled: var(--nys-color-neutral-10, ##f6f6f6);
    --_nys-button-color-text-disabled: var(--nys-color-neutral-300, ##a7a9ab);
    --_nys-button-color-border-disabled: var(--nys-color-neutral-10, ##f6f6f6);
  }
  :host([variant="outline"]) {
    --_nys-button-color-bg: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-text: var(--nys-color-theme, #154973);
    --_nys-button-color-border: var(--nys-color-theme, #154973);

    --_nys-button-color-bg-hover: var(--nys-color-theme-weaker, #eff6fb);
    --_nys-button-color-text-hover: var(--nys-color-theme, #154973);
    --_nys-button-color-border-hover: var(--nys-color-theme, #154973);

    --_nys-button-color-bg-active: var(--nys-color-theme-weak, #cddde9);
    --_nys-button-color-text-active: var(--nys-color-theme, #154973);
    --_nys-button-color-border-active: var(--nys-color-theme, #154973);

    --_nys-button-color-bg-disabled: var(--nys-color-ink-reverse, #ffffff);
    --_nys-button-color-text-disabled: var(--nys-color-neutral-300, ##a7a9ab);
    --_nys-button-color-border-disabled: var(--nys-color-neutral-100, ##d0d0ce);
  }
  :host([variant="ghost"]) {
    --_nys-button-color-bg: var(--nys-color-transparent, #ffffff00);
    --_nys-button-color-text: var(--nys-color-theme, #154973);
    --_nys-button-color-border: var(--nys-color-transparent, #ffffff00);

    --_nys-button-color-bg-hover: var(--nys-color-theme-weaker, #eff6fb);
    --_nys-button-color-text-hover: var(--nys-color-theme, #154973);
    --_nys-button-color-border-hover: var(--nys-color-transparent, #ffffff00);

    --_nys-button-color-bg-active: var(--nys-color-theme-weak, #cddde9);
    --_nys-button-color-text-active: var(--nys-color-theme, #154973);
    --_nys-button-color-border-active: var(--nys-color-transparent, #ffffff00);

    --_nys-button-color-bg-disabled: var(--nys-color-transparent, #ffffff00);
    --_nys-button-color-text-disabled: var(--nys-color-neutral-300, ##a7a9ab);
    --_nys-button-color-border-disabled: var(
      --nys-color-transparent,
      #ffffff00
    );
  }
  :host([variant="text"]) {
    --_nys-button-height: fit-content;
    --_nys-button-radius: var(--nys-border-radius-xl, 12px);
    --_nys-button-padding-y: var(--nys-space-2px, 2px);
    --_nys-button-padding-x: var(--nys-space-50, 4px);
    --_nys-button-width-border: 0px;
    --_nys-button-text-decoration: underline;

    --_nys-button-color-bg: var(--nys-color-transparent, #ffffff00);
    --_nys-button-color-text: var(--nys-color-link, #004dd1);
    --_nys-button-color-border: var(--nys-color-transparent, #ffffff00);

    --_nys-button-color-bg-hover: var(--nys-color-transparent, #ffffff00);
    --_nys-button-color-text-hover: var(--nys-color-link-strong, #003ba1);
    --_nys-button-color-border-hover: var(--nys-color-transparent, #ffffff00);

    --_nys-button-color-bg-active: var(--nys-color-transparent, #ffffff00);
    --_nys-button-color-text-active: var(--nys-color-link-strongest, #002971);
    --_nys-button-color-border-active: var(--nys-color-transparent, #ffffff00);

    --_nys-button-color-bg-disabled: var(--nys-color-transparent, #ffffff00);
    --_nys-button-color-text-disabled: var(--nys-color-neutral-300, ##a7a9ab);
    --_nys-button-color-border-disabled: var(
      --nys-color-transparent,
      #ffffff00
    );
  }

  .nys-button {
    height: var(--_nys-button-height);
    border-radius: var(--_nys-button-radius);
    padding: var(--_nys-button-padding-y) var(--_nys-button-padding-x);
    display: flex;
    align-items: center;
    gap: var(--_nys-button-gap);
    font-family: var(--_nys-button-font-family);
    font-size: var(--_nys-button-font-size);
    font-weight: var(--_nys-button-font-weight);
    line-height: var(--_nys-button-line-height);
    text-decoration: var(--_nys-button-text-decoration);
    box-sizing: border-box;
    background-color: var(--_nys-button-color-bg);
    color: var(--_nys-button-color-text);
    border: solid var(--_nys-button-width-border)
      var(--_nys-button-color-border);
    cursor: pointer;
  }

  .nys-button:hover {
    background-color: var(--_nys-button-color-bg-hover);
    color: var(--_nys-button-color-text-hover);
    border-color: var(--_nys-button-color-border-hover);
  }

  .nys-button:active {
    background-color: var(--_nys-button-color-bg-active);
    color: var(--_nys-button-color-text-active);
    border-color: var(--_nys-button-color-border-active);
  }

  .nys-button:disabled {
    background-color: var(--_nys-button-color-bg-disabled);
    color: var(--_nys-button-color-text-disabled);
    border-color: var(--_nys-button-color-border-disabled);
    cursor: not-allowed;
  }

  .nys-button:focus-visible {
    outline-offset: var(--_nys-button-offset-focus);
    outline: solid var(--_nys-button-width-focus) var(--_nys-button-color-focus);
  }

  .nys-button__text {
    padding: auto;
    margin: auto;
    display: flex;
  }
`;
