import { css } from "lit";

export default css`
  .nys-textinput {
    font-family: Arial, sans-serif;
  }

  .nys-textinput__input {
    border-radius: 0.25rem;
    border: solid 1px gray;
    font-size: 16px;
    padding: 0.5rem;
  }

  .nys-textinput__input.sm {
    width: var(--nys-form-width-sm, 88px);
    min-width: var(--nys-form-width-sm, 88px);
    max-width: var(--nys-form-width-sm, 88px);
  }

  .nys-textinput__input.md {
    width: var(--nys-form-width-md, 200px);
    min-width: var(--nys-form-width-md, 200px);
    max-width: var(--nys-form-width-md, 200px);
  }

  .nys-textinput__input.lg {
    width: var(--nys-form-width-lg, 384px);
    min-width: var(--nys-form-width-lg, 384px);
    max-width: var(--nys-form-width-lg, 384px);
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
