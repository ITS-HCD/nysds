import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Dropdown Styles */
    --_nys-dropdown-width: 100%;
    --_nys-dropdown-height: var(--nys-size-600, 48px);
    --_nys-dropdown-radius: var(--nys-border-radius-xl, 12px);
    --_nys-dropdown-padding-y: var(--nys-space-150, 12px);
    --_nys-dropdown-padding-x: var(--nys-space-250, 20px);
    --_nys-dropdown-gap: var(--nys-space-100, 8px);
    --_nys-dropdown-width-border: var(--nys-border-width-md, 2px);
    --_nys-dropdown-width-focus: var(--nys-border-width-md, 2px);
    --_nys-dropdown-offset-focus: var(--nys-space-2px, 2px);
    --_nys-dropdown-color-focus: var(--nys-color-focus, #004dd1);

    /* Global Dropdown Colors */
    --_nys-dropdown-color-bg-heading: var(--nys-color-theme, #154973);
    --_nys-dropdown-color-bg-content: var(--nys-color-weak, #cddde9);
    --_nys-dropdown-color-text-heading: var(--nys-color-ink-reverse, #ffffff);
    --_nys-dropdown-color-text-content: var(--nys-color-ink, #1b1b1b);
    --_nys-dropdown-color-border: var(--nys-color-theme, #154973);

    --_nys-dropdown-color-bg-hover: var(--nys-color-theme-strong, #0e324f);
    --_nys-dropdown-color-text-hover: var(--nys-color-ink-reverse, #ffffff);
    --_nys-dropdown-color-border-hover: var(--nys-color-theme-strong, #0e324f);

    --_nys-dropdown-color-bg-active: var(--nys-color-theme-stronger, #081b2b);
    --_nys-dropdown-color-text-active: var(--nys-color-ink-reverse, #ffffff);
    --_nys-dropdown-color-border-active: var(
      --nys-color-theme-stronger,
      #081b2b
    );

    /* Typography */
    --_nys-dropdown-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-dropdown-font-weight-heading: var(--nys-font-weight-semibold, 600);
    --_nys-dropdown-font-weight-content: var(--nys-font-weight-regular, 400);
    --_nys-dropdown-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-dropdown-font-family: var(
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

  /* The dropdown container */
  .nys-dropdown {
    font-family: var(--_nys-dropdown-font-family);
    font-size: var(--_nys-dropdown-font-size);
    line-height: var(--_nys-dropdown-line-height);
    border-radius: var(--_nys-dropdown-radius);
    overflow: hidden;
  }

  /* Style the buttons that are used to open and close the dropdown panel */
  .nys-dropdown__header {
    background-color: var(--_nys-dropdown-color-bg-heading);
    color: var(--_nys-dropdown-color-text-heading);
    cursor: pointer;
    width: var(--_nys-dropdown-width);
    height: var(--_nys-dropdown-height);
    padding: var(--_nys-dropdown-padding-y) var(--_nys-dropdown-padding-x);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: var(--_nys-dropdown-font-weight-heading);
    border: none;
    outline: none;
  }

  .nys-dropdown__header:hover {
    background-color: var(--_nys-dropdown-color-bg-hover);
    color: var(--_nys-dropdown-color-text-hover);
  }

  .nys-dropdown__header:active {
    background-color: var(--_nys-dropdown-color-bg-active);
    color: var(--_nys-dropdown-color-text-active);
  }

  /* Style the dropdown panel. Note: hidden by default */
  .nys-dropdown__content {
    font-weight: var(--_nys-dropdown-font-weight-contents);
    padding: var(--_nys-dropdown-padding-y) var(--_nys-dropdown-padding-x);
    background-color: var(--_nys-dropdown-color-bg-content);
    display: none;
    overflow: hidden;
  }

  .nys-dropdown__content[open] {
    display: block;
  }
`;
