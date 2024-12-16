import { css } from "lit";

export default css`
  .nys-checkbox {
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .nys-checkbox__content {
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
    border-color: var(--color-border-primary, #154973);
    background-color: var(--color-bg-primary, #154973);
  }

  .nys-checkbox__checkboxwrapper {
    position: relative;
    display: inline-block;
  }

  .nys-checkbox__icon {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate3d(-50%, 50%, 0);
    pointer-events: none;
    color: var(--color-background, #f0f0f0);
  }

  /* Checked + Disabled */
  .nys-checkbox__checkbox:disabled:checked {
    border-color: var(--color-border-disabled, #757575);
    background-color: var(--color-bg-disabled, #757575);
  }

  /* Disabled */
  .nys-checkbox__checkbox:disabled {
    background-color: var(--form-unchecked-color-bg-disabled, #f0f0f0);
    border-color: var(--form-unchecked-color-border-disabled, #757575);
    cursor: not-allowed;
  }

  /* Required */
  .nys-checkbox__required {
    color: var(--nys-error, #b52c2c);
    margin-left: 0.25rem;
  }

  .nys-checkbox__requiredwrapper {
    display: flex;
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
  .nys-checkbox__error {
    border-top: 1px solid var(--nys-error, #b52c2c);
    margin-top: var(--nys-spacing, 0.75rem);
    padding-top: var(--nys-spacing, 0.75rem);
    color: var(--nys-error, #b52c2c);
    margin-left: 0.25rem;
  }

  /* Checkbox Group Styling */
  .nys-checkboxgroup {
    display: flex;
    flex-direction: column;
  }

  .nys-checkboxgroup__content {
    padding-top: var(--nys-spacing, 0.5rem);
  }
`;
