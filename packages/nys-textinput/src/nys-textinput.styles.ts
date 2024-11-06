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

  /* Required */
  .nys-textinput__input:required {
    border-color: red;
  }

  .nys-textinput__required {
    color: red;
  }

  .nys-textinput__text {
    padding: 0.25rem 0;
  }

  /* Label styling */
  .nys-textinput__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
    padding-bottom: 0.25rem;
  }

  /* Help text styling */
  .nys-textinput__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
    font-style: italic;
    padding-bottom: 0.25rem;
  }
`;
