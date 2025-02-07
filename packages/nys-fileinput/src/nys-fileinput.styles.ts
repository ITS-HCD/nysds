import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Text Input Styles */
    --_nys-fileinput-width: 100%;
    --_nys-fileinput-radius: var(--nys-radius-md, 4px);
    --_nys-fileinput-width-border: var(--nys-border-width-sm, 1px);
    --_nys-fileinput-color-border: var(--nys-color-neutral-400, #909395);
    --_nys-fileinput-padding: var(--nys-space-100, 8px);
    --_nys-fileinput-gap: var(--nys-space-50, 4px);

    /* Hovered */
    --_nys-fileinput-hover-color-outline: var(--nys-color-neutral-900, #1b1b1b);
    --_nys-fileinput-hover-width-outline: var(--nys-border-width-sm, 1px);

    /* Focused */
    --_nys-fileinput-focus-color-outline: var(--nys-color-focus, #004dd1);
    --_nys-fileinput-focus-width-outline: var(--nys-border-width-sm, 1px);

    /* Disabled */
    --_nys-fileinput-disabled-color: var(--nys-color-neutral-10, #f6f6f6);
    --_nys-fileinput-disabled-color-border: var(
      --nys-color-neutral-200,
      #bec0c1
    );
    --_nys-fileinput-disabled-color-text: var(--nys-color-neutral-300, #a7a9ab);

    /* Error and Required */
    --_nys-fileinput-error-color: var(--nys-color-danger, #b52c2c);

    /* Global Font Styles */
    --_nys-fileinput-family-ui: var(
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
    --_nys-fileinput-size-ui-md: var(--nys-font-size-ui-md, 16px);
    --_nys-fileinput-weight-ui: var(--nys-font-weight-regular, 400);
    --_nys-fileinput-weight-ui-bold: var(--nys-font-weight-semibold, 600);
    --_nys-fileinput-lineheight-ui: var(--nys-font-lineheight-ui-md, 24px);
    --nys-fileinput-letterspacing-ui: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
    --_nys-fileinput-color-ui: var(--nys-color-ink, #1b1b1b);
  }

  :host([width="sm"]) {
    --_nys-fileinput-width: var(--nys-form-width-sm, 88px);
  }

  :host([width="md"]) {
    --_nys-fileinput-width: var(--nys-form-width-md, 200px);
  }

  :host([width="lg"]) {
    --_nys-fileinput-width: var(--nys-form-width-lg, 384px);
  }

  :host([width="full"]) {
    --_nys-fileinput-width: 100%;
    flex: 1; /* stretches width for flex container */
  }

  :host([showError]) {
    --_nys-fileinput-color-border: var(--nys-color-danger, #b52c2c);
  }

  .nys-fileinput {
    font-size: var(--_nys-fileinput-size-ui-md);
    font-weight: var(--_nys-fileinput-weight-ui);
    font-family: var(--_nys-fileinput-family-ui);
    line-height: var(--_nys-fileinput-lineheight-ui);
    letter-spacing: var(--nys-fileinput-letterspacing-ui);
    color: var(--_nys-fileinput-color-ui);
    gap: var(--_nys-fileinput-gap);
    display: flex;
    flex-direction: column;
  }

  .nys-fileinput__input {
    display: flex;
    border-radius: var(--_nys-fileinput-radius);
    border: solid var(--_nys-fileinput-color-border)
      var(--_nys-fileinput-width-border);
    width: var(--_nys-fileinput-width);
    min-width: var(--_nys-fileinput-width);
    max-width: var(--_nys-fileinput-width);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  input[type="file"] {
    display: none;
  }

  .nys-fileinput__iconbutton {
    --_nys-button-padding-x: var(--nys-space-100, 8px);
    --_nys-button-radius: 0;
  }

  .nys-fileinput__filetext {
    padding: var(--_nys-fileinput-padding);
  }

  /* Hovered */
  .nys-fileinput__input:hover:not(:disabled):not(:focus) {
    outline: solid var(--_nys-fileinput-hover-width-outline)
      var(--_nys-fileinput-hover-color-outline);
    border-color: var(--_nys-fileinput-hover-color-outline);
  }

  /* Focused */
  .nys-fileinput__input:focus {
    outline: solid var(--_nys-fileinput-focus-width-outline)
      var(--_nys-fileinput-focus-color-outline);
    border-color: var(--_nys-fileinput-focus-color-outline);
    caret-color: var(--_nys-fileinput-focus-color-outline);
  }

  /* Disabled */
  .nys-fileinput__input:disabled {
    background-color: var(--_nys-fileinput-disabled-color);
    border-color: var(--_nys-fileinput-disabled-color-border);
    color: var(--_nys-fileinput-disabled-color-text);
    cursor: not-allowed;
  }

  .nys-fileinput__required {
    color: var(--_nys-fileinput-error-color);
  }

  .nys-fileinput__requiredwrapper {
    display: inline;
  }

  /* Label Styling */
  .nys-fileinput__label {
    font-weight: var(--_nys-fileinput-weight-ui-bold);
  }

  /* Description styling */
  .nys-fileinput__description {
    font-style: italic;
  }

  /* Error Message Styling */
  .nys-fileinput__error {
    color: var(--_nys-fileinput-error-color);
    gap: var(--nys-space-100, 8px);
    display: flex;
    line-height: var(--_nys-fileinput-lineheight-ui);
    align-items: center;
  }
`;
