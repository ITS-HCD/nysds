import { css } from "lit";

export default css`
  .nys-select {
    font-family: Arial, sans-serif;
  }

  .nys-select__input {
    border-radius: 0.25rem;
    border: solid 1px gray;
    font-size: 16px;
    padding: 0.5rem;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  .xs {
    padding: 0.125rem;
  }

  .sm {
    padding: 0.25rem;
  }

  .lg {
    font-size: 20px;
  }

  .xl {
    font-size: 24px;
  }

  /* Focused */
  .nys-select__input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-select__input:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  /* Required */
  .nys-select__input:required {
    border-color: red;
  }

  .nys-select__required {
    color: red;
    margin-left: 0.25rem;
  }

  .nys-select__requiredwrapper {
    display: flex;
  }

  .nys-select__text {
    display: flex;
    margin-bottom: 0.25rem;
  }

  .nys-select__label_labelwrapper {
    display: flex;
    flex-direction: column;
  }

  /* Label styling */
  .nys-select__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
  }

  /* Help text styling */
  .nys-select__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
    font-style: italic;
  }

  /* Pattern validation styling */
  .nys-select__validation {
    padding-top: 0.5rem;
  }

  .nys-select__input:invalid + .nys-select__validation:after {
    color: red;
    content: " invalid";
    font-weight: bold;
  }

  .nys-select__input:valid + .nys-select__validation:after {
    color: green;
    content: " valid";
    font-weight: bold;
  }

  .nys-select__input:placeholder-shown + .nys-select__validation:after {
    color: black;
    content: " empty";
    font-weight: bold;
  }
`;
