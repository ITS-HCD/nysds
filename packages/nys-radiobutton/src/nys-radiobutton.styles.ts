import { css } from "lit";

export default css`
  .nys-radiobutton {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    font-family: Arial, sans-serif;
  }

  .nys-radiobutton__input {
    appearance: none;
    width: var(--radiobutton-size, 32px);
    height: var(--radiobutton-size, 32px);
    border: 3px solid var(--form-color-border, #1b1b1b);
    background-color: var(--form-color-bg, white);
    cursor: pointer;
    margin-bottom: 4px;
    border-radius: var(--form-radius, 100%);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  /* Checked */
  .nys-radiobutton__input:not(:disabled):checked {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10.5" stroke="white" stroke-width="4"/></svg>');
    border-color: var(--color-border-primary, #154973);
    background-color: var(--color-bg-primary, #154973);
  }

  /* Checked + Disabled */
  .nys-radiobutton__input:disabled:checked {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10.5" stroke="white" stroke-width="4"/></svg>');
    border-color: var(--color-border-disabled, #757575);
    background-color: var(--color-bg-disabled, #757575);
  }

  /* Disabled */
  .nys-radiobutton__input:disabled {
    background-color: var(--form-unchecked-color-bg-disabled, #f0f0f0);
    border-color: var(--form-unchecked-color-border-disabled, #757575);
    cursor: not-allowed;
  }

  /* Focused */
  .nys-radiobutton__input:focus {
    outline-offset: 3px;
    outline: 3px solid var(--form-focus-color, #007bff);
  }

  /* Radiobutton Label Holder */
  .nys-radiobutton__text {
    margin-left: 8px;
  }

  /* Label styling */
  .nys-radiobutton__label {
    font-size: 16px;
    font-weight: 500;
    color: var(--form-label-color, #1b1b1b);
  }

  /* Help text styling */
  .nys-radiobutton__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
  }

  /* Disabled label */
  .nys-radiobutton__input:disabled
    + .nys-radiobutton__text
    .nys-radiobutton__label {
    color: var(--form-label-color-disabled, #757575);
  }
`;
