import { css } from "lit";

export default css`
  .nys-textarea {
    font-family: Arial, sans-serif;
  }

  .nys-textarea__textarea {
    border-radius: 0.25rem;
    border: solid 1px gray;
    font-size: 16px;
    padding: 0.5rem;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
    resize: vertical;
  }

  /* Sizes */
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

  /* Resize */
  .none {
    resize: none;
  }

  /* Focused */
  .nys-textarea__textarea:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-textarea__textarea:disabled {
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
    flex-direction: column;
    margin-bottom: 0.25rem;
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

  /* Error Message Styling */
  .nys-select__error {
    color: var(--nys-warning, #b52c2c);
    padding-top: 0.25rem;
  }
`;
