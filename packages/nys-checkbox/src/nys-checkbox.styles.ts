import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Checkbox Styles */
    --_nys-checkbox-size: var(--nys-size-400, 32px);
    --_nys-checkbox-radius: var(--nys-border-radius-md, 4px);
    --_nys-checkbox-width-border: var(--nys-border-width-md, 2px);
    --_nys-checkbox-color-focus: var(--nys-color-focus, #286ad8);
    --_nys-checkbox-width-focus: var(--nys-border-width-md, 2px);
    --_nys-checkbox-transition-duration: var(--nys-transition-duration-sm, 0.1s);
    --_nys-checkbox-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none"><path d="M6.93751 11.9375L17.5313 1.34375C17.7813 1.09375 18.0729 0.96875 18.4063 0.96875C18.7396 0.96875 19.0313 1.09375 19.2813 1.34375C19.5313 1.59375 19.6563 1.89063 19.6563 2.23438C19.6563 2.57813 19.5313 2.875 19.2813 3.125L7.81252 14.625C7.56252 14.875 7.27085 15 6.93751 15C6.60418 15 6.31252 14.875 6.06252 14.625L0.687515 9.25C0.437515 9 0.317723 8.70312 0.32814 8.35938C0.338556 8.01562 0.468765 7.71875 0.718765 7.46875C0.968765 7.21875 1.26564 7.09375 1.60939 7.09375C1.95314 7.09375 2.25001 7.21875 2.50001 7.46875L6.93751 11.9375Z" fill="white"/></svg>');
    /* Default (Empty) */
    --_nys-checkbox-color-bg: var(--nys-color-ink-reverse, #ffffff);
    --_nys-checkbox-color-border: var(--nys-color-neutral-600, #62666a);
    /* Empty + Hovered */
    --_nys-checkbox-hover-color-bg: var(--nys-color-neutral-100, #d0d0de);
    --_nys-checkbox-hover-color-border: var(--nys-color-neutral-600, #62666a);
    /* Empty + Pressed */
    --_nys-checkbox-pressed-color-bg: var(--nys-color-neutral-200, #bec0c1);
    --_nys-checkbox-pressed-color-border: var(--nys-color-neutral-600, #62666a);
    /* Checked */
    --_nys-checkbox-checked-color-bg: var(--nys-color-theme, #154973);
    --_nys-checkbox-checked-color-border: var(--nys-color-theme, #154973);
    /* Checked + Hovered */
    --_nys-checkbox-checked-hover-color-bg: var(--nys-color-theme-strong, #0e324f);
    --_nys-checkbox-checked-hover-color-border: var(--nys-color-theme-strong, #0e324f);
    /* Checked + Pressed */
    --_nys-checkbox-checked-pressed-color-bg: var(--nys-color-theme-stronger, #081B2B);
    --_nys-checkbox-checked-pressed-color-border: var(--nys-color-theme-stronger, #081B2B);
    /* Disabled */
    --_nys-checkbox-disabled-color-bg: var(--nys-color-ink-reverse, #f0f0f0);
    --_nys-checkbox-disabled-color-border: var(--nys-color-neutral-400, #757575);
    /* Disabled Checked */
    --_nys-checkbox-disabled-checked-color-bg: var(--nys-color-neutral-200, #f0f0f0);
    --_nys-checkbox-disabled-checked-color-border: var(--nys-color-neutral-200, #757575);
  }

  /* Small Variant */
  :host([size="sm"]) {
    --_nys-checkbox-size: var(--nys-size-300, 24px);
    --_nys-checkbox-radius: var(--nys-border-radius-sm, 2px);
  }

  .nys-checkbox {
    display: flex;
    flex: 1;
    flex-direction: row;
    gap: var(--nys-space-100);
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .nys-checkbox__input {
    appearance: none;
    background-repeat: no-repeat;
    background-position: center;
    outline-offset: var(--_nys-checkbox-width-border);
    width: var(--_nys-checkbox-size);
    height: var(--_nys-checkbox-size);
    min-width: var(--_nys-checkbox-size);
    min-height: var(--_nys-checkbox-size);
    border: solid var(--_nys-checkbox-width-border) var(--_nys-checkbox-color-border);
    background-color: var(--_nys-checkbox-color-bg);
    border-radius: var(--_nys-checkbox-radius);
    cursor: pointer;
    transition:
      background-color var(--_nys-checkbox-transition-duration),
      border-color var(--_nys-checkbox-transition-duration);
  }

  /* Focused */
  .nys-checkbox__input:focus {
    outline: solid var(--_nys-checkbox-width-focus) var(--_nys-checkbox-color-focus, #004dd1);
  }

  /* Hovered */
  .nys-checkbox__input:hover {
    background-color: var(--_nys-checkbox-hover-color-bg);
    border-color: var(--_nys-checkbox-hover-color-border);
  }

  /* Pressed */
  .nys-checkbox__input:active {
    background-color: var(--_nys-checkbox-pressed-color-bg);
    border-color: var(--_nys-checkbox-pressed-color-border);
  }

  /* Checked */
  .nys-checkbox__input:checked {
    background-image: var(--_nys-checkbox-image);
    background-color: var(--_nys-checkbox-checked-color-bg);
    border-color: var(--_nys-checkbox-checked-color-border);
  }

  /* Checked + Hovered */
  .nys-checkbox__input:checked:hover {
    background-color: var(--_nys-checkbox-checked-hover-color-bg);
    border-color: var(--_nys-checkbox-checked-hover-color-border);
  }

  /* Checked + Pressed */
  .nys-checkbox__input:checked:active {
    background-color: var(--_nys-checkbox-checked-pressed-color-bg);
    border-color: var(--_nys-checkbox-checked-pressed-color-border);
  }

  /* Disabled */
  .nys-checkbox__input:disabled {
    background-color: var(--_nys-checkbox-disabled-color-bg);
    border-color: var(--_nys-checkbox-disabled-color-border);
    cursor: not-allowed;
  }

  /* Checked + Disabled */
  .nys-checkbox__input:disabled:checked {
    background-image: var(--_nys-checkbox-image);
    background-color: var(--_nys-checkbox-disabled-checked-color-bg);
    border-color: var(--_nys-checkbox-disabled-checked-color-border);
  }

  /* Checkbox Label Holder */
  .nys-checkbox__text {
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-2px);
  }

  /* Label styling */
  .nys-checkbox__label {
    font-size: var(--nys-font-size-ui-md, 16px);
    font-weight: var(--nys-font-weight-regular, 400);
    color: var(--nys-color-ink, #1b1b1b);
  }

  /* Description styling */
  .nys-checkbox__description {
    font-size: var(--nys-font-size-sm, 14px);
    font-weight: var(--nys-font-weight-light, 300);
    color: var(--nys-color-neutral-700, #4a4d4f);
  }

  /* Disabled label */
  .nys-checkbox__input:disabled + .nys-checkbox__text .nys-checkbox__label,
  .nys-checkbox__input:disabled + .nys-checkbox__text .nys-checkbox__description {
    color: var(--nys-color-neutral-400, #757575);
  }
`;
