import { css } from "lit";

export default css`
  .nys-checkbox {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .nys-checkbox__input {
    appearance: none;
    width: var(--checkbox-size, 32px);
    height: var(--checkbox-size, 32px);
    border: 3px solid var(--form-color-border, #1b1b1b);
    background-color: var(--form-color-bg, white);
    cursor: pointer;
    margin-bottom: 4px;
    border-radius: var(--form-radius, 4px);
    background-repeat: no-repeat;
    background-position: center;
  }

  /* Checked */
  .nys-checkbox__input:not(:disabled):checked {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path style="fill: %23ffffff" d="M11.941,28.877l-11.941-11.942l5.695-5.696l6.246,6.246l14.364-14.364L32,8.818"/></svg>');
    border-color: var(--color-border-primary, #154973);
    background-color: var(--color-bg-primary, #154973);
  }

  /* Checked + Disabled */
  .nys-checkbox__input:disabled:checked {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path style="fill: %23ededed" d="M11.941,28.877l-11.941-11.942l5.695-5.696l6.246,6.246l14.364-14.364L32,8.818"/></svg>');
    border-color: var(--color-border-disabled, #757575);
    background-color: var(--color-bg-disabled, #757575);
  }

  /* Disabled */
  .nys-checkbox__input:disabled {
    background-color: var(--form-unchecked-color-bg-disabled, #f0f0f0);
    border-color: var(--form-unchecked-color-border-disabled, #757575);
    cursor: not-allowed;
  }

  /* Focused */
  .nys-checkbox__input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Checkbox Label Holder */
  .nys-checkbox__text {
    margin-left: 8px;
  }

  /* Label styling */
  .nys-checkbox__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
  }

  /* Help text styling */
  .nys-checkbox__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
  }

  /* Disabled label */
  .nys-checkbox__input:disabled + .nys-checkbox__text .nys-checkbox__label {
    color: var(--form-label-color-disabled, #757575);
  }
`;
