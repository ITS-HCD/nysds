import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Accordion Styles */
    --_nys-accordion-width: fit-content;
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
    --_nys-accordion-color-bg: var(--nys-color-theme, #154973);
    --_nys-accordion-color-text: var(--nys-color-ink-reverse, #ffffff);
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

    --_nys-accordion-color-bg-disabled: var(--nys-color-neutral-10, #f6f6f6);
    --_nys-accordion-color-text-disabled: var(--nys-color-neutral-300, #a7a9ab);
    --_nys-accordion-color-border-disabled: var(
      --nys-color-neutral-10,
      #f6f6f6
    );

    /* Typography */
    --_nys-accordion-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-accordion-font-weight: var(--nys-font-weight-semibold, 600);
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

  /* Style the buttons that are used to open and close the accordion panel */
  .nys-accordion__header {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 0.4s;
  }

  /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
  .active,
  .nys-accordion__header:hover {
    background-color: #ccc;
  }

  /* Style the accordion panel. Note: hidden by default */
  .nys-accordion__content {
    padding: 0 18px;
    background-color: white;
    display: none;
    overflow: hidden;
  }

  .nys-accordion__content[open] {
    display: block;
  }
`;
