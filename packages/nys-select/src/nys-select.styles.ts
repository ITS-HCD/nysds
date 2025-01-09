import { css } from "lit";

export default css`
  :host {
    /* Global Select Styles */
    --_nys-select-form-width: var(--nys-form-width-md, 200px);
    --_nys-select-font-family: var(--nys-font-family-ui, "Proxima Nova");
    --_nys-select-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-select-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-select-letter-spacing: var(--nys-font-letterspacing-ui-md, 0.044px);

    /* Global Select Colors */
    --_nys-select-color: var(--nys-color-ink, var(--nys-color-neutral-900, #1b1b1b));
    --_nys-select-error-color: var(--nys-color-danger, var(--nys-color-red-600, #b52c2c));
    --_nys-select-bg-color: var(--nys-color-ink-reverse, #fff);
    --_nys-select-bg-disabled-color: var(--nys-color-neutral-50, #ededed);
    --_nys-select-icon-disabled-color: var(--nys-color-neutral-300, #a7a9ab);

    /* Select Border States */
    --_nys-select-border-focus: var(--nys-border-width-md, 2px) solid var(--nys-color-focus, var(--nys-color-blue-600, #004DD1));
    --_nys-select-border-disabled: var(--nys-border-width-sm, 1px) solid var(--nys-color-neutral-200, #bec0c1);
    --_nys-select-border-hover: var(--nys-border-width-md, 2px) solid var(--nys-color-neutral-900, #1b1b1b);
  }

  .nys-select {
    font-family: var(--_nys-select-font-family);
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  .nys-select__select {
    color: var(--_nys-select-color);
    font-weight: var(--_nys-select-font-weight);
    border-radius: 0.25rem;
    border: solid 1px gray;
    font-size: var(--_nys-select-font-size);
    padding: 0.5rem 2rem 0.5rem 0.5rem;
    width: var(--_nys-select-form-width);
    min-width: var(--_nys-select-form-width);
    max-width: var(--_nys-select-form-width);
    text-indent: 1px;
    text-overflow: "";
    background: var(--_nys-select-bg-color);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-overflow: ellipsis;
  }

  .nys-select__selectwrapper {
    position: relative;
    display: inline-block;
    width: var(--_nys-select-form-width);
  }

  .nys-select__icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  :host([width="sm"]) {
    --_nys-select-form-width: var(--nys-select-form-width-sm, 88px);
  }

  :host([width="md"]) {
    --_nys-select-form-width: var(--nys-select-form-width-md, 200px);
  }

  :host([width="lg"]) {
    --_nys-select-form-width: var(--nys-select-form-width-lg, 384px);
  }

  :host([width="full"]) {
    --_nys-select-form-width: 100%;
    width: -webkit-fill-available;
    width: -moz-available;
    width: fill-available;
  }

  /* Hover */
  .nys-select__select:hover {
    border: var(--_nys-select-border-hover);
    cursor: pointer;
  }
  
  /* Focused */
  .nys-select__select:focus {
    border: var(--_nys-select-border-focus);
  }

  /* Disabled */
  .nys-select__select:disabled {
    background-color: var(--_nys-select-bg-disabled-color);
    border: var(--_nys-select-border-disabled);
    cursor: not-allowed;
  }
  .nys-select__select:disabled ~ .nys-select__icon {
    color: var(--_nys-select-icon-disabled-color);
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
    font-weight: 400;
    color: var(--_nys-select-color);
  }

  /* Help text styling */
  .nys-select__description {
    font-size: 12px;
    color: var(--form-help-text-color, gray);
    font-style: italic;
  }

  /* Error Message Styling */
  .nys-select__error {
    display: flex;
    align-items: center;
    gap: 7px;
    padding-top: var(--nys-spacing, 0.7rem);
    color: var(--_nys-select-error-color);
  }

  .nys-select__selecterror {
    border-color: var(--_nys-select-error-color); /* border of <select> */
  }
`;
