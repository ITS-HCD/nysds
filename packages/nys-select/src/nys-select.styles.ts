import { css } from "lit";

export default css`
  .nys-select {
    font-family: Arial, sans-serif;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  .nys-select__select {
    border-radius: 0.25rem;
    border: solid 1px gray;
    font-size: 16px;
    padding: 0.5rem;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
    text-indent: 1px;
    text-overflow: "";
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
  .nys-select__select:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-select__select:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  /* Required */
  .nys-select__required {
    color: red;
    margin-left: 0.25rem;
  }

  .nys-select__requiredwrapper {
    display: flex;
  }

  /* Label styling */
  .nys-select__text {
    padding-bottom: 0.25rem;
  }

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

  /* Error Message Styling */
  .nys-select__error {
    color: var(--nys-warning, #b52c2c);
    padding-top: 0.25rem;
  }
`;
