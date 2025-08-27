import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Text Input Styles */
    --_nys-textarea-width: 100%;
    --_nys-textarea-border-radius: var(--nys-radius-md, 4px);
    --_nys-textarea-border-width: var(--nys-border-width-sm, 1px);
    --_nys-textarea-border-color: var(--nys-color-neutral-400, #909395);
    --_nys-textarea-padding: var(--nys-space-100, 8px);
    --_nys-textarea-gap: var(--nys-space-50, 4px);
    --_nys-textarea-color: var(--nys-color-ink, #1b1b1b);
    --_nys-textarea-color--placeholder: var(
      --nys-color-text-weaker,
      var(--nys-color-neutral-500, #797c7f)
    );

    /* Hovered */
    --_nys-textarea-outline-color--hover: var(--nys-color-neutral-900, #1b1b1b);
    --_nys-textarea-outline-width: var(--nys-border-width-sm, 1px);

    /* Focused */
    --_nys-textarea-outline-color--focus: var(--nys-color-focus, #004dd1);

    /* Disabled */
    --_nys-textarea-background-color--disabled: var(
      --nys-color-neutral-10,
      #f6f6f6
    );
    --_nys-textarea-border-color--disabled: var(
      --nys-color-neutral-200,
      #bec0c1
    );
    --_nys-textarea-color--disabled: var(
      --nys-color-text-disabled,
      var(--nys-color-neutral-200, #bec0c1)
    );

    /* Global Font Styles */
    --_nys-textarea-font-family: var(
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
    --_nys-textarea-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-textarea-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-textarea-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --nys-textarea-letterspacing-ui: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
  }

  :host([width="sm"]) {
    --_nys-textarea-width: var(--nys-form-width-sm, 88px);
  }

  :host([width="md"]) {
    --_nys-textarea-width: var(--nys-form-width-md, 200px);
  }

  :host([width="lg"]) {
    --_nys-textarea-width: var(--nys-form-width-lg, 384px);
  }

  :host([width="full"]) {
    --_nys-textarea-width: 100%;
    flex: 1; /* stretches width for flex container */
  }

  :host([showError]) {
    --_nys-textarea-border-color: var(--nys-color-danger, #b52c2c);
  }

  .nys-textarea {
    font-weight: var(--_nys-textarea-font-weight);
    font-family: var(--_nys-textarea-font-family);
    line-height: var(--_nys-textarea-line-height);
    letter-spacing: var(--nys-textarea-letterspacing-ui);
    color: var(--_nys-textarea-color);
    gap: var(--_nys-textarea-gap);
    display: flex;
    flex-direction: column;
  }

  .nys-textarea__textarea {
    color: var(--_nys-textarea-color);
    font-size: var(--_nys-textarea-font-size);
    font-family: var(--_nys-textarea-font-family);
    border-radius: var(--_nys-textarea-border-radius);
    border: solid var(--_nys-textarea-border-color)
      var(--_nys-textarea-border-width);
    padding: var(--_nys-textarea-padding);
    width: var(--_nys-textarea-width);
    line-height: var(--_nys-textarea-line-height);
    max-width: var(--_nys-textarea-width);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  .nys-textarea__textarea::placeholder {
    color: var(--_nys-textarea-color--placeholder);
  }

  /* Resize */
  .nys-textarea__textarea.none {
    resize: none;
  }

  /* Hovered */
  .nys-textarea__textarea:hover:not(:disabled):not(:focus) {
    outline: solid var(--_nys-textarea-outline-width)
      var(--_nys-textarea-outline-color--hover);
    border-color: var(--_nys-textarea-outline-color--hover);
  }

  /* Focused */
  .nys-textarea__textarea:focus {
    outline: solid var(--_nys-textarea-outline-width)
      var(--_nys-textarea-outline-color--focus);
    border-color: var(--_nys-textarea-outline-color--focus);
    caret-color: var(--_nys-textarea-outline-color--focus);
  }

  /* Disabled */
  .nys-textarea__textarea:disabled,
  .nys-textarea__textarea:disabled::placeholder {
    background-color: var(--_nys-textarea-background-color--disabled);
    border-color: var(--_nys-textarea-border-color--disabled);
    color: var(--_nys-textarea-color--disabled);
    cursor: not-allowed;
  }
`;
