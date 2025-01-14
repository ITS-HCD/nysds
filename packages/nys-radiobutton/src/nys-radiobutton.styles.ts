import { css } from "lit";

export default css`
  :host {
    /* Global Radiobutton Styles */
    --_nys-radiobutton-size: var(--nys-size-400, 32px);
    --_nys-radiobutton-radius: var(--nys-border-radius-md, 4px);
    --_nys-radiobutton-width-border: var(--nys-border-width-md, 2px);
    --_nys-radiobutton-color-focus: var(--nys-color-focus, #286ad8);
    --_nys-radiobutton-width-focus: var(--nys-border-width-md, 2px);
    --_nys-radiobutton-offset-focus: var(--nys-space-2px, 2px);
    --_nys-radiobutton-transition-duration: var(
      --nys-transition-duration-sm,
      0.1s
    );
    --_nys-radiobutton-gap: var(
      --nys-space-100,
      8px
    ); /* space between radio and it's label */
    --_nys-radiogroup-gap: var(
      --nys-space-200,
      16px
    ); /* space between radio buttons */

    /* Typography */
    --_nys-radiobutton-font-family: var(
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
    --_nys-radiobutton-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-radiobutton-font-weight-400: var(--nys-font-weight-regular, 400);
    --_nys-radiobutton-font-weight-600: var(--nys-font-weight-semibold, 600);
    --_nys-radiobutton-line-height: var(--nys-font-lineheight-ui-md, 24px);

    /* Global Radio Button Colors */
    --_nys-radiobutton-color: var(
      --nys-color-ink,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-radiobutton-error-color: var(
      --nys-color-danger,
      var(--nys-color-red-600, #b52c2c)
    );

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
    --_nys-radiogroup-gap: var(--nys-space-100, 8px);
  }
  /* Medium Variant */
  :host([size="md"]) {
    --_nys-radiobutton-size: var(--nys-size-400, 32px);
    --_nys-radiobutton-radius: var(--nys-border-radius-md, 4px);
  }

  .nys-radiogroup {
    display: flex;
    flex-direction: column;
    gap: var(--_nys-radiobutton-gap);
    font-family: var(--_nys-radiobutton-font-family);
    font-size: var(--_nys-radiobutton-font-size);
    line-height: var(--_nys-radiobutton-line-height);
  }

  .nys-radiogroup__content {
    gap: var(--_nys-radiogroup-gap);
    display: flex;
    flex-direction: column;
  }

  .nys-radiobutton {
    display: flex;
    align-items: center;
    font-family: var(--_nys-radiobutton-font-family);
    font-size: var(--_nys-radiobutton-font-size);
    line-height: var(--_nys-radiobutton-line-height);
    gap: var(--_nys-radiobutton-gap);
  }

  .nys-radiobutton__radio {
    appearance: none;
    width: var(--_nys-radiobutton-size);
    height: var(--_nys-radiobutton-size);
    min-width: var(--_nys-radiobutton-size);
    min-height: var(--_nys-radiobutton-size);
    max-width: var(--_nys-radiobutton-size);
    max-height: var(--_nys-radiobutton-size);
    border: solid var(--_nys-radiobutton-width-border)
      var(--_nys-radiobutton-color-border);
    background-color: var(--_nys-radiobutton-color-bg);
    cursor: pointer;
    border-radius: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-bottom: auto; /* Causes centered radio button if single line of label but top aligned if multiline */
  }

  /* Checked */
  .nys-radiobutton__radio:not(:disabled):checked {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');
    background-color: var(--_nys-radiobutton-checked-color-bg);
  }

  /* Checked + Disabled */
  .nys-radiobutton__radio:disabled:checked {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');
    border-color: var(--_nys-radiobutton-disabled-checked-color-border);
    background-color: var(--_nys-radiobutton-disabled-checked-color-bg);
  }

  /* Disabled */
  .nys-radiobutton__radio:disabled {
    background-color: var(--_nys-radiobutton-disabled-color-bg);
    border-color: var(--_nys-radiobutton-disabled-color-border);
    cursor: not-allowed;
  }

  /* Hover - only allow hover on unchecked */
  .nys-radiobutton__radio:hover:not(:disabled):not(:checked) {
    border-color: var(--_nys-radiobutton-hover-color-border);
    background-color: var(--_nys-radiobutton-hover-color-bg);
  }

  /* Pressed - only allow pressed on unchecked */
  .nys-radiobutton__radio:active:not(:disabled):not(:checked) {
    border-color: var(--_nys-radiobutton-pressed-color-border);
    background-color: var(--_nys-radiobutton-pressed-color-bg);
  }

  /* Focused */
  .nys-radiobutton__radio:focus {
    outline: solid var(--_nys-radiobutton-width-focus)
      var(--_nys-radiobutton-color-focus);
    outline-offset: var(--_nys-radiobutton-offset-focus);
  }

  /* Radiobutton Label Holder */
  .nys-radiobutton__text {
    line-height: var(--_nys-radiobutton-line-height);
    display: flex;
    flex-direction: column;
  }

  /* Label styling */
  .nys-radiogroup__label {
    font-weight: var(--_nys-radiobutton-font-weight-600);
    color: var(--_nys-radiobutton-color);
  }
  .nys-radiobutton__label {
    font-weight: var(--_nys-radiobutton-font-weight-400);
    color: var(--_nys-radiobutton-color);
  }

  /* Description styling */
  .nys-radiobutton__description,
  .nys-radiogroup__description {
    font-weight: var(--_nys-radiobutton-font-weight-400);
    font-style: italic;
  }

  /* Disabled label */
  .nys-radiobutton__radio:disabled
    + .nys-radiobutton__text
    .nys-radiobutton__label {
    color: var(--form-label-color-disabled, #757575);
  }

  /* Required */
  .nys-radiobutton__required {
    color: var(--_nys-radiobutton-error-color);
    margin-left: var(--_nys-select-margin);
  }

  .nys-radiobutton__requiredwrapper {
    display: inline;
  }

  /* Error Message Styling */
  .nys-radiobutton__error {
    display: flex;
    align-items: center;
    gap: var(--_nys-radiobutton-gap);
    color: var(--_nys-radiobutton-error-color);

    /* add divider line */
    border-top: 1px solid var(--_nys-radiobutton-error-color);
    padding-top: var(--_nys-radiobutton-gap);
  }

  /* Error Icon Styling */
  nys-icon[name="error"] {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: auto;
    box-sizing: border-box;
    height: var(--_nys-radiobutton-line-height);
    text-align: center;
  }
`;
