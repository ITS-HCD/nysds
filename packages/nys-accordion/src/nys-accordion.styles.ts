import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Accordion Styles */
    --_nys-accordion-width: 100%;
    --_nys-accordion-height: var(--nys-size-600, 48px);
    --_nys-accordion-radius: var(--nys-border-radius-xl, 12px);
    --_nys-accordion-padding-y: var(--nys-space-150, 12px);
    --_nys-accordion-padding-x: var(--nys-space-250, 20px);
    --_nys-accordion-gap: var(--nys-space-100, 8px);
    --_nys-accordion-width-border: var(--nys-border-width-md, 2px);
    --_nys-accordion-width-focus: var(--nys-border-width-md, 2px);
    --_nys-accordion-offset-focus: var(--nys-space-2px, 2px);
    --_nys-accordion-color-focus: var(--nys-color-focus, #004dd1);

    /* Global Accordion Colors */
    --_nys-accordion-color-bg-heading: var(--nys-color-theme, #154973);
    --_nys-accordion-color-bg-content: var(--nys-color-weak, #cddde9);
    --_nys-accordion-color-text-heading: var(--nys-color-ink-reverse, #ffffff);
    --_nys-accordion-color-text-content: var(--nys-color-ink, #1b1b1b);
    --_nys-accordion-color-border: var(--nys-color-theme, #154973);

    --_nys-accordion-color-bg-hover: var(--nys-color-theme-strong, #0e324f);
    --_nys-accordion-color-text-hover: var(--nys-color-ink-reverse, #ffffff);
    --_nys-accordion-color-border-hover: var(--nys-color-theme-strong, #0e324f);

    --_nys-accordion-color-bg-active: var(--nys-color-theme-stronger, #081b2b);
    --_nys-accordion-color-text-active: var(--nys-color-ink-reverse, #ffffff);
    --_nys-accordion-color-border-active: var(
      --nys-color-theme-stronger,
      #081b2b
    );

    /* Typography */
    --_nys-accordion-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-accordion-font-weight-heading: var(--nys-font-weight-semibold, 600);
    --_nys-accordion-font-weight-content: var(--nys-font-weight-regular, 400);
    --_nys-accordion-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-accordion-font-family: var(
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

  /* The accordion container */
  .nys-accordion {
    font-family: var(--_nys-accordion-font-family);
    font-size: var(--_nys-accordion-font-size);
    line-height: var(--_nys-accordion-line-height);
    border-radius: var(--_nys-accordion-radius);
    overflow: hidden;
  }

  /* Style the buttons that are used to open and close the accordion panel */
  .nys-accordion__header {
    background-color: var(--_nys-accordion-color-bg-heading);
    color: var(--_nys-accordion-color-text-heading);
    cursor: pointer;
    width: var(--_nys-accordion-width);
    height: var(--_nys-accordion-height);
    padding: var(--_nys-accordion-padding-y) var(--_nys-accordion-padding-x);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: var(--_nys-accordion-font-weight-heading);
    border: none;
    outline: none;
  }

  .nys-accordion__header:hover {
    background-color: var(--_nys-accordion-color-bg-hover);
    color: var(--_nys-accordion-color-text-hover);
  }

  .nys-accordion__header:active {
    background-color: var(--_nys-accordion-color-bg-active);
    color: var(--_nys-accordion-color-text-active);
  }

  /* Style the accordion panel. Note: hidden by default */
  .nys-accordion__content {
    font-weight: var(--_nys-accordion-font-weight-contents);
    padding: var(--_nys-accordion-padding-y) var(--_nys-accordion-padding-x);
    background-color: var(--_nys-accordion-color-bg-content);
    display: none;
    overflow: hidden;
  }

  .nys-accordion__content[open] {
    display: block;
  }
`;
