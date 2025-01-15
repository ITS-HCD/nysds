import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Checkbox Styles */
    --_nys-checkbox-size: var(--nys-size-400, 32px);
    --_nys-checkbox-radius: var(--nys-border-radius-md, 4px);
    --_nys-checkbox-width-border: var(--nys-border-width-md, 2px);
    --_nys-checkbox-color-focus: var(--nys-color-focus, #004dd1);
    --_nys-checkbox-width-focus: var(--nys-border-width-md, 2px);
    --_nys-checkbox-transition-duration: var(
      --nys-transition-duration-sm,
      0.1s
    );
    --_nys-checkbox-gap: var(
      --nys-space-150,
      12px
    ); /* space between checkbox and it's label */
    --_nys-checkboxgroup-gap: var(
      --nys-space-50,
      4px
    ); /* space between checkboxes */

    /* Typography */
    --_nys-checkbox-font-family: var(
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
    --_nys-checkbox-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-checkbox-font-weight-400: var(--nys-font-weight-regular, 400);
    --_nys-checkbox-font-weight-600: var(--nys-font-weight-semibold, 600);
    --_nys-checkbox-line-height: var(--nys-font-lineheight-ui-md, 24px);

    /* Global Checkbox Colors */
    --_nys-checkbox-color: var(
      --nys-color-ink,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-checkbox-error-color: var(
      --nys-color-danger,
      var(--nys-color-red-600, #b52c2c)
    );

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
    --_nys-checkbox-checked-hover-color-bg: var(
      --nys-color-theme-strong,
      #0e324f
    );
    --_nys-checkbox-checked-hover-color-border: var(
      --nys-color-theme-strong,
      #0e324f
    );
    /* Checked + Pressed */
    --_nys-checkbox-checked-pressed-color-bg: var(
      --nys-color-theme-stronger,
      #081b2b
    );
    --_nys-checkbox-checked-pressed-color-border: var(
      --nys-color-theme-stronger,
      #081b2b
    );
    /* Disabled */
    --_nys-checkbox-disabled-color-bg: var(--nys-color-ink-reverse, #f0f0f0);
    --_nys-checkbox-disabled-color-border: var(
      --nys-color-neutral-400,
      #757575
    );
    /* Disabled Checked */
    --_nys-checkbox-disabled-checked-color-bg: var(
      --nys-color-neutral-200,
      #757575
    );
    --_nys-checkbox-disabled-checked-color-border: var(
      --nys-color-neutral-200,
      #757575
    );
  }

  /* Small Variant */
  :host([size="sm"]) {
    --_nys-checkbox-size: var(--nys-size-300, 24px);
    --_nys-checkbox-radius: var(--nys-border-radius-sm, 2px);
  }
  /* Medium Variant */
  :host([size="md"]) {
    --_nys-checkbox-size: var(--nys-size-400, 32px);
    --_nys-checkbox-radius: var(--nys-border-radius-md, 4px);
  }

  /* Checkbox Group Styling */
  .nys-checkboxgroup {
    display: flex;
    flex-direction: column;
  }

  .nys-checkboxgroup__content {
    padding-top: var(--nys-space-50, 4px);
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-200, 16px);
  }

  .nys-checkbox {
    align-items: center;
    font-family: Arial, sans-serif;
  }

  /* wraps the single checkbox */
  .nys-checkbox__content {
    display: flex;
  }

  /* wraps the native checkbox and it's icon */
  .nys-checkbox__checkboxwrapper {
    position: relative;
    display: inline-block;
    max-height: var(--_nys-checkbox-size);
  }

  .nys-checkbox__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -35%, 0); /* Centering the icon visually */
    pointer-events: none;
    color: white;
  }

  .nys-checkbox__checkbox {
    appearance: none;
    background-repeat: no-repeat;
    background-position: center;
    outline-offset: var(--_nys-checkbox-width-border);
    width: var(--_nys-checkbox-size);
    height: var(--_nys-checkbox-size);
    border: solid var(--_nys-checkbox-width-border)
      var(--_nys-checkbox-color-border);
    background-color: var(--_nys-checkbox-color-bg);
    cursor: pointer;
    border-radius: var(--_nys-checkbox-radius);

    transition:
      background-color var(--_nys-checkbox-transition-duration),
      border-color var(--_nys-checkbox-transition-duration);
  }

  /* Pointer cursor for unchecked radio button */
  .nys-checkbox:hover * {
    cursor: pointer;
  }

  /* Checked */
  .nys-checkbox__checkbox:not(:disabled):checked {
    background-color: var(--_nys-checkbox-checked-color-bg);
    border-color: var(--_nys-checkbox-checked-color-border);
  }

  /* Checked + Disabled */
  .nys-checkbox__checkbox:disabled:checked {
    background-color: var(--_nys-checkbox-disabled-checked-color-bg);
    border-color: var(--_nys-checkbox-disabled-checked-color-border);
  }

  /* Disabled */
  .nys-checkbox__checkbox:disabled {
    background-color: var(--_nys-checkbox-disabled-color-bg);
    border-color: var(--_nys-checkbox-disabled-color-border);
    cursor: not-allowed;
  }

  /* Hovered */
  .nys-checkbox__checkbox:hover {
    background-color: var(--_nys-checkbox-hover-color-bg);
    border-color: var(--_nys-checkbox-hover-color-border);
  }

  /* Pressed */
  .nys-checkbox__checkbox:active {
    background-color: var(--_nys-checkbox-pressed-color-bg);
    border-color: var(--_nys-checkbox-pressed-color-border);
  }

  /* Focused */
  .nys-checkbox__checkbox:focus {
    outline: solid var(--_nys-checkbox-width-focus)
      var(--_nys-checkbox-color-focus, #004dd1);
  }

  /* Checkbox Label Holder */
  .nys-checkbox__text {
    margin: auto 0 auto var(--nys-space-150, 12px);
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
  .nys-checkbox__checkbox:disabled + .nys-checkbox__text .nys-checkbox__label,
  .nys-checkbox__checkbox:disabled
    + .nys-checkbox__text
    .nys-checkbox__description {
    color: var(--form-label-color-disabled, #757575);
  }

  /* Required */
  .nys-checkbox__required {
    color: var(--nys-color-danger, #b52c2c);
    margin-left: var(--nys-space-2px, 2px);
  }

  .nys-checkbox__requiredwrapper {
    display: inline;
  }

  /* Error Message Styling */
  .nys-checkbox__error {
    border-top: 1px solid var(--nys-color-danger, #b52c2c);
    margin-top: var(--nys-space-150, 12px);
    padding-top: var(--nys-space-100, 8px);
    color: var(--nys-color-danger, #b52c2c);
    margin-left: 0.25rem;
  }
`;
