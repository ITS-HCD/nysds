import { css } from "lit";

export default css`
  :host {
    /* Global Select Styles */
    --_nys-select-width: 100%;
    --_nys-select-font-family: var(
      --nys-font-family-ui,
      var(
        --nys-font-family-sans,
        "Proxima Nova",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        sans-serif
      )
    );
    --_nys-select-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-select-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-select-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-select-gap: var(--nys-space-50, 4px);
    --_nys-select-border-radius: var(--nys-radius-md, 4px);
    --_nys-select-padding: var(--nys-space-100, 8px) var(--nys-space-400, 32px)
      var(--nys-space-100, 8px) var(--nys-space-100, 8px);

    /* Global Select Colors */
    --_nys-select-color: var(--nys-color-text, #1b1b1b);
    --_nys-select-color--error: var(
      --nys-color-danger,
      var(--nys-color-red-600, #b52c2c)
    );
    --_nys-select-background-color: var(--nys-color-ink-reverse, #fff);
    --_nys-select-background-color--disabled: var(
      --nys-color-neutral-50,
      #ededed
    );
    --_nys-select-color--disabled: var(--nys-color-text-disabled, #bec0c1);

    /* Select Outline & Border States */
    --_nys-select-border-width: var(--nys-border-width-sm, 1px);

    --_nys-select-border-color: var(--nys-color-neutral-400, #909395);
    --_nys-select-border-color--hover: var(--nys-color-neutral-900, #1b1b1b);
    --_nys-select-border-color--focus: var(--nys-color-focus, #004dd1);
    --_nys-select-border-color--disabled: var(--nys-color-neutral-200, #bec0c1);

    --_nys-select-border-default: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-neutral-400, #909395);
    --_nys-select-border-focus: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-focus, var(--nys-color-blue-600, #004dd1));
    --_nys-select-border-disabled: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-neutral-200, #bec0c1);
    --_nys-select-border-hover: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-neutral-900, #1b1b1b);
  }

  .nys-select {
    display: flex;
    flex-direction: column;
    gap: var(--_nys-select-gap);
    font-family: var(--_nys-select-font-family);
  }

  .nys-select__select {
    color: var(--_nys-select-color);
    font-weight: var(--_nys-select-font-weight);
    font-family: var(--_nys-select-font-family);
    border-radius: var(--_nys-select-border-radius);
    border: solid var(--_nys-select-border-width)
      var(--_nys-select-border-color);
    font-size: var(--_nys-select-font-size);
    padding: var(--_nys-select-padding);
    width: var(--_nys-select-width);
    max-width: 100%;
    text-indent: 1px;
    text-overflow: "";
    background: var(--_nys-select-background-color);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-overflow: ellipsis;
  }

  .nys-select__selectwrapper {
    position: relative;
    display: inline-block;
    width: var(--_nys-select-width);
    max-width: 100%;
  }

  .nys-select__icon {
    color: var(--_nys-select-color);
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  :host([width="sm"]) {
    --_nys-select-width: var(--nys-select-form-width-sm, 88px);
  }

  :host([width="md"]) {
    --_nys-select-width: var(--nys-select-form-width-md, 200px);
  }

  :host([width="lg"]) {
    --_nys-select-width: var(--nys-select-form-width-lg, 384px);
  }

  :host([width="full"]) {
    --_nys-select-width: 100%;
    flex: 1; /* stretches width for flex container */
  }

  /* Hover */
  .nys-select__select:hover:not(:disabled) {
    cursor: pointer;
    border-color: var(--_nys-select-border-color--hover);
    outline: solid var(--_nys-select-border-width)
      var(--_nys-select-border-color--hover);
  }

  /* Focused */
  .nys-select__select:focus {
    border-color: var(--_nys-select-border-color--focus);
    outline: solid var(--_nys-select-border-width)
      var(--_nys-select-border-color--focus);
  }

  /* Disabled */
  .nys-select__select:disabled {
    background-color: var(--_nys-select-background-color--disabled);
    border-color: var(--_nys-select-border-color--disabled);
    cursor: not-allowed;
    color: var(--_nys-select-color--disabled);
  }
  .nys-select__select:disabled ~ .nys-select__icon {
    color: var(--_nys-select-color--disabled);
  }

  :host([showError]) {
    --_nys-select-border-default: var(--nys-border-width-sm, 1px) solid
      var(--_nys-select-color--error);
  }
`;
