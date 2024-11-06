import { css } from "lit";

export default css`
  .nys-input {
    border-radius: 0.125rem;
    border: solid 1px;
    font-family: arial;
    font-size: 16px;
    padding: 0.25rem;
  }

  /* Focused */
  .nys-input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-input:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  /* Required */
  .nys-input:required {
    border-color: red;
  }

  .nys-input__required {
    color: red;
  }
`;
