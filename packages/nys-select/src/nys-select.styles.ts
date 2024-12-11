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
    background: white;
    -webkit-appearance: none;
  }

  .nys-select__selectwrapper {
    position: relative;
    display: inline-block;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  .nys-select__icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .nys-select__select.xs {
    padding: 0.125rem;
  }

  .nys-select__select.sm {
    padding: 0.25rem;
  }

  .nys-select__select.md {
    padding: 0.5rem;
  }

  .nys-select__select.lg {
    font-size: 20px;
  }

  .nys-select__select.xl {
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
    padding-top: var(--nys-spacing, 0.75rem);
    color: var(--nys-error, #b52c2c);
  }

  .nys-select__selecterror {
    border-color: var(--nys-error, #b52c2c); /* border of <select> */
  }
`;
