import { css } from "lit";

export default css`
  :host {
    /* Global Radiobutton Styles */
    --_nys-radiobutton-size: var(--nys-size-400, 32px);
    --_nys-radiobutton-border-radius: var(--nys-radius-md, 4px);
    --_nys-radiobutton-width-border: var(--nys-border-width-md, 2px);
    --_nys-radiobutton-color-focus: var(--nys-color-focus, #004dd1);
    --_nys-radiobutton-width-focus: var(--nys-border-width-md, 2px);
    --_nys-radiobutton-outline-offset: var(--nys-space-2px, 2px);
    /* space between radio and it's label */
    --_nys-radiobutton-gap: var(--nys-space-150, 12px);
    /* space between radio buttons */
    --_nys-radiogroup-gap: var(--nys-space-200, 16px);

    /* Typography */
    --_nys-radiobutton-font-family: var(
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
    --_nys-radiobutton-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-radiobutton-font-weight-label: var(--nys-font-weight-regular, 400);
    --_nys-radiobutton-font-weight-description: var(
      --nys-font-weight-regular,
      400
    );
    --_nys-radiobutton-line-height: var(--nys-font-lineheight-ui-md, 24px);

    /* Global Radio Button Colors */
    --_nys-radiobutton-color: var(
      --nys-color-ink,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-radiobutton-color-text: var(
      --nys-color-text,
      var(--nys-color-neutral-900, #1b1b1b)
    );

    /* Default (Empty) */
    --_nys-radiobutton-color-bg: var(--nys-color-ink-reverse, #ffffff);
    --_nys-radiobutton-color-border: var(--nys-color-neutral-600, #62666a);
    /* Empty + Hovered */
    --_nys-radiobutton-hover-color-bg: var(--nys-color-neutral-50, #ededed);
    --_nys-radiobutton-hover-color-border: var(--nys-color-ink, #1b1b1b);
    /* Empty + Pressed */
    --_nys-radiobutton-pressed-color-bg: var(--nys-color-neutral-100, #d0d0ce);
    --_nys-radiobutton-pressed-color-border: var(--nys-color-ink, #1b1b1b);
    /* Checked */
    --_nys-radiobutton-checked-color-bg: var(--nys-color-theme, #154973);
    /* Disabled */
    --_nys-radiobutton-background-color--disabled: var(
      --nys-color-ink-reverse,
      #f0f0f0
    );
    --_nys-radiobutton-color--disabled: var(--nys-color-text-disabled, #bec0c1);
    --_nys-radiobutton-border-color--disabled: var(
      --nys-color-neutral-100,
      #d0d0ce
    );
    /* Disabled Checked */
    --_nys-radiobutton-background-color--checked--disabled: var(
      --nys-color-neutral-100,
      #d0d0ce
    );
    --_nys-radiobutton-border-color--checked--disabled: var(
      --nys-color-neutral-100,
      #d0d0ce
    );
  }

  /* Small Variant */
  :host([size="sm"]) {
    --_nys-radiobutton-size: var(--nys-size-300, 24px);
    --_nys-radiobutton-border-radius: var(--nys-radius-sm, 2px);
    --_nys-radiogroup-gap: var(--nys-space-100, 8px);
    --_nys-radiobutton-gap: var(--nys-space-100, 8px);
  }
  /* Medium Variant */
  :host([size="md"]) {
    --_nys-radiobutton-size: var(--nys-size-400, 32px);
    --_nys-radiobutton-border-radius: var(--nys-radius-md, 4px);
    --_nys-radiogroup-gap: var(--nys-space-200, 16px);
    --_nys-radiobutton-gap: var(--nys-space-150, 12px);
  }

  /* Tile Variant */
  :host([tile]) {
    --_nys-radiobutton-font-weight-label: var(--nys-font-weight-semibold, 600);
    --_nys-radiobutton-border-width--tile: var(--nys-border-width-sm, 1px);
    --_nys-radiobutton-border-radius--tile: var(--nys-radius-md, 4px);
    --_nys-radiobutton-border-color--tile: var(
      --nys-color-neutral-100,
      #d0d0ce
    );
    --_nys-radiobutton-background-color--tile: var(
      --nys-color-ink-reverse,
      #ffffff
    );
    --_nys-radiobutton-padding--x--tile: var(--nys-space-250, 20px);
    --_nys-radiobutton-padding--y--tile: var(--nys-space-200, 16px);
    /* Hover */
    --_nys-radiobutton-border-color--tile--hover: var(
      --nys-color-neutral-700,
      #4a4d4f
    );
    --_nys-radiobutton-background-color--tile--hover: var(
      --nys-color-ink-reverse,
      #ffffff
    );
    /* Pressed */
    --_nys-radiobutton-border-color--tile--active: var(
      --nys-color-neutral-900,
      #1b1b1b
    );
    --_nys-radiobutton-background-color--tile--active: var(
      --nys-color-ink-reverse,
      #ffffff
    );
    /* Checked */
    --_nys-radiobutton-border-color--tile--checked: var(
      --nys-color-theme-mid,
      #457aa5
    );
    --_nys-radiobutton-background-color--tile--checked: var(
      --nys-color-theme-faint,
      #f7fafd
    );
    /* Disabled */
    --_nys-radiobutton-border-color--tile--disabled: var(
      --nys-color-ink-reverse,
      #f0f0f0
    );
    --_nys-radiobutton-background-color--tile--disabled: var(
      --nys-color-neutral-100,
      #d0d0ce
    );
  }

  :host([tile][size="sm"]) {
    --_nys-radiobutton-padding--x--tile: var(--nys-space-200, 16px);
    --_nys-radiobutton-padding--y--tile: var(--nys-space-150, 12px);
  }

  :host([tile][showError]) {
    --_nys-radiobutton-border-color--tile: var(--nys-color-danger, #b52c2c);
    --_nys-radiobutton-border-color--tile--hover: var(
      --nys-color-danger,
      #b52c2c
    );
    --_nys-radiobutton-border-color--tile--active: var(
      --nys-color-danger,
      #b52c2c
    );
    --_nys-radiobutton-border-color--tile--checked: var(
      --nys-color-danger,
      #b52c2c
    );
  }

  .nys-radiogroup {
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-200, 16px);
    font-family: var(--_nys-radiobutton-font-family);
    font-size: var(--_nys-radiobutton-font-size);
    line-height: var(--_nys-radiobutton-line-height);
  }

  .nys-radiogroup__content {
    gap: var(--_nys-radiogroup-gap);
    display: flex;
    flex-direction: column;
  }

  .nys-radiobutton {
    display: flex;
    align-items: center;
    font-family: var(--_nys-radiobutton-font-family);
    font-size: var(--_nys-radiobutton-font-size);
    line-height: var(--_nys-radiobutton-line-height);

    /* Tile */
    border-radius: var(--_nys-radiobutton-border-radius--tile);
    border: var(--_nys-radiobutton-border-width--tile) solid
      var(--_nys-radiobutton-border-color--tile);
    background-color: var(--_nys-radiobutton-background-color--tile);
    padding: var(--_nys-radiobutton-padding--y--tile)
      var(--_nys-radiobutton-padding--x--tile);
  }

  .nys-radiobutton__radio {
    appearance: none;
    width: var(--_nys-radiobutton-size);
    height: var(--_nys-radiobutton-size);
    min-width: var(--_nys-radiobutton-size);
    min-height: var(--_nys-radiobutton-size);
    max-width: var(--_nys-radiobutton-size);
    max-height: var(--_nys-radiobutton-size);
    border: solid var(--_nys-radiobutton-width-border)
      var(--_nys-radiobutton-color-border);
    background-color: var(--_nys-radiobutton-color-bg);
    border-radius: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    outline-offset: var(--_nys-radiobutton-outline-offset);
    outline: none;
    margin: 0 0 auto 0; /* Causes centered radio button if single line of label but top aligned if multiline */
    box-sizing: border-box;
  }

  /* Pointer cursor for unchecked radio button */
  .nys-radiobutton:hover,
  .nys-radiobutton:hover * {
    cursor: pointer;
  }

  /* Checked */
  input:not(:disabled):checked + .nys-radiobutton .nys-radiobutton__radio {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');
    background-color: var(--_nys-radiobutton-checked-color-bg);
  }
  :host([tile])
    .nys-radiobutton:has(input:not(:disabled):checked)
    + .nys-radiobutton
    .nys-radiobutton__radio {
    border-color: var(--_nys-radiobutton-border-color--tile--checked);
    background-color: var(--_nys-radiobutton-background-color--tile--checked);
  }
  :host([tile])
    .nys-radiobutton:has(input:not(:disabled):checked:hover)
    + .nys-radiobutton
    .nys-radiobutton__radio {
    cursor: default;
  }

  /* Checked + Disabled */
  input:disabled:checked + .nys-radiobutton .nys-radiobutton__radio {
    background-image: url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');
    border-color: var(--_nys-radiobutton-border-color--checked--disabled);
    background-color: var(
      --_nys-radiobutton-background-color--checked--disabled
    );
  }
  :host([tile])
    .nys-radiobutton:has(input:disabled:checked)
    + .nys-radiobutton
    .nys-radiobutton__radio {
    border-color: var(--_nys-radiobutton-background-color--tile--disabled);
    background-color: var(--_nys-radiobutton-border-color--tile--disabled);
  }

  /* Disabled */
  input:disabled + .nys-radiobutton .nys-radiobutton__radio {
    background-color: var(--_nys-radiobutton-background-color--disabled);
    border-color: var(--_nys-radiobutton-border-color--disabled);
    cursor: not-allowed;
  }
  :host([tile])
    .nys-radiobutton:has(input:disabled)
    + .nys-radiobutton
    .nys-radiobutton__radio {
    background-color: var(--_nys-radiobutton-background-color--disabled);
    border-color: var(--_nys-radiobutton-border-color--disabled);
    cursor: not-allowed;
  }

  /* Hover - only allow hover on unchecked */
  input:hover:not(:disabled):not(:checked)
    + .nys-radiobutton
    .nys-radiobutton__radio {
    border-color: var(--_nys-radiobutton-hover-color-border);
    background-color: var(--_nys-radiobutton-hover-color-bg);
  }
  :host([tile])
    .nys-radiobutton:has(
      input:hover:not(:disabled):not(:checked)
        + .nys-radiobutton
        .nys-radiobutton__radio
    ) {
    border-color: var(--_nys-radiobutton-border-color--tile--hover);
    background-color: var(--_nys-radiobutton-background-color--tile--hover);
    outline: solid var(--_nys-radiobutton-border-width--tile)
      var(--_nys-radiobutton-border-color--tile--hover);
  }

  /* Pressed - only allow pressed on unchecked */
  input:active:not(:disabled):not(:checked)
    + .nys-radiobutton
    .nys-radiobutton__radio {
    border-color: var(--_nys-radiobutton-pressed-color-border);
    background-color: var(--_nys-radiobutton-pressed-color-bg);
  }
  :host([tile])
    .nys-radiobutton:has(
      input:active:not(:disabled):not(:checked)
        + .nys-radiobutton
        .nys-radiobutton__radio
    ) {
    border-color: var(--_nys-radiobutton-border-color--tile--active);
    background-color: var(--_nys-radiobutton-background-color--tile--active);
    outline: solid var(--_nys-radiobutton-border-width--tile)
      var(--_nys-radiobutton-border-color--tile--active);
  }

  /* Focused */
  :host:focus-visible,
  :host(.active-focus) {
    outline: solid var(--_nys-radiobutton-width-focus)
      var(--_nys-radiobutton-color-focus);
  }
  /* Radiobutton Label Holder */
  .nys-radiobutton__text {
    line-height: var(--_nys-radiobutton-line-height);
    display: flex;
    flex-direction: column;
  }

  /* Label styling */
  .nys-radiobutton__label {
    font-weight: var(--_nys-radiobutton-font-weight-label);
    color: var(--_nys-radiobutton-color-text);
  }

  /* Description styling */
  .nys-radiobutton__description {
    font-weight: var(--_nys-radiobutton-font-weight-description);
    font-style: italic;
    text-align: left;
  }
  :host([tile]) .nys-radiobutton__description {
    font-style: normal;
  }

  /* gap between radio and it's label */
  .nys-radiobutton__label,
  .nys-radiobutton__description {
    margin-inline-start: var(--_nys-radiobutton-gap);
  }

  /* Disabled label */
  input:disabled + span + .nys-radiobutton__text .nys-radiobutton__label,
  input:disabled + span + .nys-radiobutton__text .nys-radiobutton__description {
    color: var(--_nys-radiobutton-color--disabled);
    cursor: not-allowed;
  }

  /* Screen readers ONLY */
  fieldset {
    all: unset;
    display: contents;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    border: 0;
  }
`;
