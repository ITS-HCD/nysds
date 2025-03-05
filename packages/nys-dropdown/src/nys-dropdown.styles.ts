import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Dropdown Styles */
    --_nys-dropdown-width: 160px;
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
    --_nys-dropdown-color-bg-content: var(--nys-color-neutral-50, #ededed);
    --_nys-dropdown-color-text-heading: var(--nys-color-ink-reverse, #ffffff);
    --_nys-dropdown-color-text-content: var(--nys-color-theme, #154973);
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
    --_nys-dropdown-font-weight: var(--nys-font-weight-semibold, 600);
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

  .nys-dropdown {
    font-size: var(--_nys-dropdown-font-size);
    font-weight: var(--_nys-dropdown-font-weight);
    line-height: var(--_nys-dropdown-line-height);
    font-family: var(--_nys-dropdown-font-family);
    min-width: var(--_nys-dropdown-width);
    max-width: var(--_nys-dropdown-width);
    width: var(--_nys-dropdown-width);
    position: relative;
  }

  .nys-dropdown__content {
    display: none;
  }

  .nys-dropdown__content[open] {
    padding: var(--_nys-dropdown-padding-y) var(--_nys-dropdown-padding-x);
    gap: var(--_nys-dropdown-padding-y);
    background-color: var(--_nys-dropdown-color-bg-content);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: -webkit-fill-available;
    max-width: -webkit-fill-available;
    width: -webkit-fill-available;
    width: max-content;
    z-index: 99999;
    position: absolute;
  }

  .nys-dropdown__content * {
    color: var(--_nys-dropdown-color-text-content);
    text-decoration: none;
  }
`;
