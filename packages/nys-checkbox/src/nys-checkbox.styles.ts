import { css } from "lit";

export default css`
  .nys-checkbox {
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .nys-checkbox__checkboxwrapper {
    display: flex;
  }

  .nys-checkbox__checkbox {
    appearance: none;
    width: var(--checkbox-size, 32px);
    flex: 0 0 auto;
    height: var(--checkbox-size, 32px);
    border: 2px solid var(--form-color-border, #1b1b1b);
    background-color: var(--form-color-bg, white);
    cursor: pointer;
    border-radius: var(--form-radius, 4px);
    background-repeat: no-repeat;
    background-position: center;
  }

  /* Checked */
  .nys-checkbox__checkbox:not(:disabled):checked {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path style="fill: %23ffffff" d="M11.941,28.877l-11.941-11.942l5.695-5.696l6.246,6.246l14.364-14.364L32,8.818"/></svg>');
    border-color: var(--color-border-primary, #154973);
    background-color: var(--color-bg-primary, #154973);
  }

  /* Checked + Disabled */
  .nys-checkbox__checkbox:disabled:checked {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path style="fill: %23ededed" d="M11.941,28.877l-11.941-11.942l5.695-5.696l6.246,6.246l14.364-14.364L32,8.818"/></svg>');
    border-color: var(--color-border-disabled, #757575);
    background-color: var(--color-bg-disabled, #757575);
  }

  /* Disabled */
  .nys-checkbox__checkbox:disabled {
    background-color: var(--form-unchecked-color-bg-disabled, #f0f0f0);
    border-color: var(--form-unchecked-color-border-disabled, #757575);
    cursor: not-allowed;
  }

  /* Focused */
  .nys-checkbox__checkbox:focus {
    outline-offset: 2px;
    outline: 2px solid var(--form-focus-color, #007bff);
  }

  /* Checkbox Label Holder */
  .nys-checkbox__text {
    margin: auto 0 auto 0.5rem;
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
  .nys-checkbox__checkbox:disabled + .nys-checkbox__text .nys-checkbox__label {
    color: var(--form-label-color-disabled, #757575);
  }

  /* Error Message Styling */
  .nys-select__error {
    border-top: 1px solid var(--nys-error, #b52c2c);
    margin-top: var(--nys-spacing, 0.75rem);
    padding-top: var(--nys-spacing, 0.75rem);
    color: var(--nys-error, #b52c2c);
    margin-left: 0.25rem;
  }
`;
