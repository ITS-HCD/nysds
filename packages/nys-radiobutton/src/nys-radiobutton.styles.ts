import { css } from "lit";

export default css`
  :host {
    /* Global Radiobutton Styles */
    --_nys-radiobutton-size: var(--nys-size-400, 32px);
    --_nys-radiobutton-radius: var(--nys-border-radius-md, 4px);
    --_nys-radiobutton-width-border: var(--nys-border-width-md, 2px);
    --_nys-radiobutton-color-focus: var(--nys-color-focus, #286ad8);
    --_nys-radiobutton-width-focus: var(--nys-border-width-md, 2px);
    --_nys-radiobutton-transition-duration: var(
      --nys-transition-duration-sm,
      0.1s
    );
    --_nys-radiobutton-gap: var(--nys-space-100, 8px);
    /* Default (Empty) */
    --_nys-radiobutton-color-bg: var(--nys-color-ink-reverse, #ffffff);
    --_nys-radiobutton-color-border: var(--nys-color-neutral-600, #62666a);
    /* Empty + Hovered */
    --_nys-radiobutton-hover-color-bg: var(--nys-color-neutral-50, #ededed);
    --_nys-radiobutton-hover-color-border: var(--nys-color-ink, #1b1b1b);
    /* Empty + Pressed */
    --_nys-radiobutton-pressed-color-bg: var(--nys-color-neutral-100, #d0d0ce);
    --_nys-radiobutton-pressed-color-border: var(--nys-color-ink, #1b1b1b);
    /* Checked */
    --_nys-radiobutton-checked-color-bg: var(--nys-color-theme, #154973);
    /* Checked + Hovered */
    --_nys-radiobutton-checked-hover-color-bg: var(
      --nys-color-theme-strong,
      var(--nys-color-state-blue-800, #0e324f)
    );
    --_nys-radiobutton-checked-hover-color-border: var(
      --nys-color-ink,
      #1b1b1b
    );
    /* Checked + Pressed */
    --_nys-radiobutton-checked-pressed-color-bg: var(
      --nys-color-theme-strong,
      var(--nys-color-state-blue-800, #0e324f)
    );
    --_nys-radiobutton-checked-pressed-color-border: var(
      --nys-color-ink,
      #1b1b1b
    );
    /* Disabled */
    --_nys-radiobutton-disabled-color-bg: var(--nys-color-ink-reverse, #f0f0f0);
    --_nys-radiobutton-disabled-color-border: var(
      --nys-color-neutral-200,
      #bec0c1
    );
    /* Disabled Checked */
    --_nys-radiobutton-disabled-checked-color-bg: var(
      --nys-color-neutral-200,
      #bec0c1
    );
    --_nys-radiobutton-disabled-checked-color-border: var(
      --nys-color-neutral-200,
      #bec0c1
    );
  }

  /* Small Variant */
  :host([size="sm"]) {
    --_nys-radiobutton-size: var(--nys-size-300, 24px);
    --_nys-radiobutton-radius: var(--nys-border-radius-sm, 2px);
  }
  /* Medium Variant */
  :host([size="md"]) {
    --_nys-radiobutton-size: var(--nys-size-400, 32px);
    --_nys-radiobutton-radius: var(--nys-border-radius-md, 4px);
  }

  .nys-radiobutton {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .nys-radiobutton__radio {
    appearance: none;
    width: var(--_nys-radiobutton-size);
    height: var(--_nys-radiobutton-size);
    min-width: var(--_nys-radiobutton-size);
    min-height: var(--_nys-radiobutton-size);
    border: solid var(--_nys-radiobutton-width-border)
      var(--_nys-radiobutton-color-border);
    background-color: var(--_nys-radiobutton-color-bg);
    outline-offset: 2px;
    cursor: pointer;
    border-radius: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  /* Checked */
  .nys-radiobutton__radio:not(:disabled):checked {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10.5" stroke="white" stroke-width="6"/></svg>');
    background-color: var(--_nys-radiobutton-checked-color-bg);
  }

  /* Checked + Disabled */
  .nys-radiobutton__radio:disabled:checked {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10.5" stroke="white" stroke-width="6"/></svg>');
    border-color: var(--_nys-radiobutton-disabled-checked-color-border);
    background-color: var(--_nys-radiobutton-disabled-checked-color-bg);
  }

  /* Disabled */
  .nys-radiobutton__radio:disabled {
    background-color: var(--_nys-radiobutton-disabled-color-bg);
    border-color: var(--_nys-radiobutton-disabled-color-border);
    cursor: not-allowed;
  }

  /* Hover */
  .nys-radiobutton__radio:not(:disabled):not(:focus):hover {
    border-color: var(--_nys-radiobutton-hover-color-border);
    background-color: var(--_nys-radiobutton-hover-color-bg);
  }
  .nys-radiobutton__radio:not(:disabled):checked:not(:focus):hover {
    opacity: 0.3;
    border-color: var(--_nys-radiobutton-checked-hover-color-border);
    background-color: var(--_nys-radiobutton-checked-hover-color-bg);
  }

  /* Active */
  .nys-radiobutton__radio:not(:disabled):active {
    border-color: var(--_nys-radiobutton-pressed-color-border);
    background-color: var(--_nys-radiobutton-pressed-color-bg);
  }
  .nys-radiobutton__radio:not(:disabled):checked:active {
    opacity: 0.3;
    border-color: var(--_nys-radiobutton-checked-pressed-color-border);
    background-color: var(--_nys-radiobutton-checked-pressed-color-bg);
  }

  /* Focused */
  .nys-radiobutton__radio:focus {
    opacity: 1;
    outline: solid var(--_nys-radiobutton-width-focus)
      var(--_nys-radiobutton-color-focus);
  }

  /* Radiobutton Label Holder */
  .nys-radiobutton__text {
    margin: auto 0 auto var(--nys-spacing, 0.5rem);
  }

  /* Label styling */
  .nys-radiobutton__label {
    font-size: var(--nys-font-size-ui-md, 16px);
    font-weight: var(--nys-font-weight-regular, 400);
    color: var(--nys-color-ink, #1b1b1b);
  }

  /* Help text styling */
  .nys-radiobutton__description {
    font-size: var(--nys-font-size-sm, 14px);
    font-weight: var(--nys-font-weight-light, 300);
    color: var(--nys-color-neutral-700, #4a4d4f);
  }

  /* Disabled label */
  .nys-radiobutton__radio:disabled
    + .nys-radiobutton__text
    .nys-radiobutton__label {
    color: var(--form-label-color-disabled, #757575);
  }

  /* Required */
  .nys-radiobutton__required {
    color: var(--nys-color-danger, #b52c2c);
    margin-left: var(--nys-spacing, 0.25rem);
  }

  .nys-radiobutton__requiredwrapper {
    display: flex;
  }

  /* Error Message Styling */
  .nys-radiobutton__error {
    display: flex;
    align-items: center;
    gap: var(--_nys-radiobutton-gap);
    border-top: 1px solid var(--nys-color-danger, #b52c2c);
    margin-top: var(--nys-spacing, 0.75rem);
    padding-top: var(--nys-spacing, 0.75rem);
    color: var(--nys-color-danger, #b52c2c);
    margin-left: var(--nys-spacing, 0.25rem);
  }

  .nys-radiogroup__content {
    gap: var(--nys-spacing-200, 16px);
    padding-top: var(--nys-spacing-200, 16px);
    display: flex;
    flex-direction: column;
  }
`;
