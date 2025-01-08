import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Text Input Styles */
    --_nys-textinput-width-sm: var(--nys-form-width-sm, 88px);
    --_nys-textinput-width-md: var(--nys-form-width-md, 200px);
    --_nys-textinput-width-lg: var(--nys-form-width-lg, 384px);
    --_nys-textinput-radius: var(--nys-radius-md, 4px);
    --_nys-textinput-border-width: var(--nys-border-width-sm, 1px);
    --_nys-textinput-border-color: var(--nys-color-neutral-400, #909395);
    --_nys-textinput-padding: var(--nys-space-100, 8px);

    /* Global Font Styles */
    --_nys-textinput-family-ui: var(
      --nys-font-family-sans,
      "Proxima Nova",
      "Helvetica Neue",
      "Helvetica",
      "Arial",
      sans-serif
    );
    --_nys-textinput-size-ui-md: var(--nys-font-size-ui-md, 16px);
    --_nys-textinput-weight-ui: var(--nys-font-weight-semibold, 600);
    --_nys-textinput-lineheight-ui: var(--nys-font-lineheight-ui-md, 24px);
    --nys-textinput-letterspacing-ui: var(
      --nys-font-letterspacing-ui-sm,
      0.044px
    );
  }

  .nys-textinput {
    font-family: var(--nys-font-family-sans);
    /* UI/Medium/Semibold */
    font-family: var(--_nys-textinput-family-ui);
    font-size: var(--_nys-textinput-size-ui-md);
    font-style: normal;
    font-weight: var(--_nys-textinput-weight-ui);
    line-height: var(--_nys-textinput-lineheight-ui);
    letter-spacing: var(--nys-textinput-letterspacing-ui);
  }

  .nys-textinput__input {
    border-radius: var(--_nys-textinput-radius);
    border: solid var(--_nys-textinput-border-color)
      var(--_nys-textinput-border-width);
    padding: var(--_nys-textinput-padding);
  }

  .nys-textinput__input.sm {
    width: var(--_nys-textinput-width-sm);
    min-width: var(--_nys-textinput-width-sm);
    max-width: var(--_nys-textinput-width-sm);
  }

  .nys-textinput__input.md {
    width: var(--_nys-textinput-width-md);
    min-width: var(--_nys-textinput-width-md);
    max-width: var(--_nys-textinput-width-md);
  }

  .nys-textinput__input.lg {
    width: var(--_nys-textinput-width-lg);
    min-width: var(--_nys-textinput-width-lg);
    max-width: var(--_nys-textinput-width-lg);
  }

  .nys-textinput__input.full {
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  /* Focused */
  .nys-textinput__input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-textinput__input:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  .nys-textinput__required {
    color: var(--nys-error, #d54309);
    margin-left: 0.25rem;
  }

  .nys-textinput__requiredwrapper {
    display: inline;
  }

  .nys-textinput__text {
    margin-bottom: 0.25rem;
  }

  /* Label styling */
  .nys-textinput__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
  }

  /* Help text styling */
  .nys-textinput__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
    font-style: italic;
  }

  /* Pattern validation styling */
  .nys-textinput__validation {
    padding-top: 0.5rem;
  }

  .nys-textinput__input:invalid + .nys-textinput__validation:after {
    color: var(--nys-error, #d54309);
    content: " invalid";
    font-weight: bold;
  }

  .nys-textinput__input:valid + .nys-textinput__validation:after {
    color: green;
    content: " valid";
    font-weight: bold;
  }

  .nys-textinput__input:placeholder-shown + .nys-textinput__validation:after {
    color: black;
    content: " empty";
    font-weight: bold;
  }

  /* Error Message Styling */
  .nys-textinput__error {
    color: var(--nys-warning, #b52c2c);
    padding-top: 0.25rem;
  }
`;
