import { css } from "lit";

export default css`
  .nys-textarea {
    font-family: Arial, sans-serif;
  }

  .nys-textarea__input {
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
  .nys-textarea__input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-textarea__input:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  .nys-textarea__required {
    color: red;
    margin-left: 0.25rem;
  }

  .nys-textarea__requiredwrapper {
    display: flex;
  }

  .nys-textarea__text {
    display: flex;
    margin-bottom: 0.25rem;
  }

  .nys-textarea__label_labelwrapper {
    display: flex;
    flex-direction: column;
  }

  /* Label styling */
  .nys-textarea__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
  }

  /* Help text styling */
  .nys-textarea__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
    font-style: italic;
  }

  /* Pattern validation styling */
  .nys-textarea__validation {
    padding-top: 0.5rem;
  }

  .nys-textarea__input:invalid + .nys-textarea__validation:after {
    color: red;
    content: " invalid";
    font-weight: bold;
  }

  .nys-textarea__input:valid + .nys-textarea__validation:after {
    color: green;
    content: " valid";
    font-weight: bold;
  }

  .nys-textarea__input:placeholder-shown + .nys-textarea__validation:after {
    color: black;
    content: " empty";
    font-weight: bold;
  }
`;
