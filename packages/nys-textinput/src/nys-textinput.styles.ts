import { css } from "lit";

export default css`
  .nys-textinput {
    border-radius: 0.25rem;
    border: solid 1px;
    font-family: arial;
    font-size: 16px;
    padding: 0.5rem;
  }

  /* Focused */
  .nys-textinput:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Disabled */
  .nys-textinput:disabled {
    background-color: #f0f0f0;
    border-color: #757575;
    cursor: not-allowed;
  }

  /* Required */
  .nys-textinput:required {
    border-color: red;
  }

  .nys-textinput__required {
    color: red;
  }
`;
