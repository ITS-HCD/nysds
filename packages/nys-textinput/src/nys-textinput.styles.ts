import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Text Input Styles */
    --_nys-textinput-width: 100%;
    --_nys-textinput-height: var(--nys-size-500, 40px);
    --_nys-textinput-border-radius: var(--nys-radius-md, 4px);
    --_nys-textinput-border-width: var(--nys-border-width-sm, 1px);
    --_nys-textinput-border-color: var(--nys-color-neutral-400, #909395);
    --_nys-textinput-color: var(
      --nys-color-text,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-textinput-color--placeholder: var(
      --nys-color-text-weaker,
      var(--nys-color-neutral-500, #797c7f)
    );
    --_nys-textinput-padding: var(--nys-space-100, 8px);
    --_nys-textinput-gap: var(--nys-space-50, 4px);
    --_nys-textinput-background-color: var(
      --nys-color-ink-reverse,
      var(--nys-color-white, #ffffff)
    );
    --_nys-textinput-color: var(
      --nys-color-ink,
      var(--nys-color-neutral-900, #1b1b1b)
    );

    /* Hovered */
    --_nys-textinput-outline-color--hover: var(
      --nys-color-neutral-900,
      #1b1b1b
    );
    --_nys-textinput-outline-width: var(--nys-border-width-sm, 1px);

    /* Focused */
    --_nys-textinput-outline-color--focus: var(--nys-color-focus, #004dd1);

    /* Disabled */
    --_nys-textinput-background-color--disabled: var(
      --nys-color-neutral-10,
      #f6f6f6
    );
    --_nys-textinput-border-color--disabled: var(
      --nys-color-neutral-200,
      #bec0c1
    );
    --_nys-textinput-color--disabled: var(
      --nys-color-text-disabled,
      var(--nys-color-neutral-200, #bec0c1)
    );

    /* Global Font Styles */
    --_nys-textinput-font-family: var(
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
    --_nys-textinput-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-textinput-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-textinput-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-textinput-letter-spacing: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
  }

  :host([width="sm"]) {
    --_nys-textinput-width: var(--nys-form-width-sm, 88px);
  }

  :host([width="md"]) {
    --_nys-textinput-width: var(--nys-form-width-md, 200px);
  }

  :host([width="lg"]) {
    --_nys-textinput-width: var(--nys-form-width-lg, 384px);
  }

  :host([width="full"]) {
    --_nys-textinput-width: 100%;
    flex: 1; /* stretches width for flex container */
  }

  :host([showError]) {
    --_nys-textinput-border-color: var(--nys-color-danger, #b52c2c);
  }

  .nys-textinput {
    font-weight: var(--_nys-textinput-font-weight);
    font-family: var(--_nys-textinput-font-family);
    font-size: var(--_nys-textinput-font-size);
    line-height: var(--_nys-textinput-line-height);
    letter-spacing: var(--_nys-textinput-letter-spacing);
    color: var(--_nys-textinput-color);
    gap: var(--_nys-textinput-gap);
    display: flex;
    flex-direction: column;
  }

  .nys-textinput__mask-overlay {
    position: absolute;
    margin: calc(
      var(--_nys-textinput-padding) + var(--_nys-textinput-border-width)
    );
    color: var(--nys-color-text-weaker, #797c7f);
    display: inline;
    overflow: hidden;
    white-space: nowrap;
    font: inherit;
    letter-spacing: normal;
  }

  .nys-textinput__input {
    color: var(--_nys-textinput-color);
    border-radius: var(--_nys-textinput-border-radius);
    border: solid var(--_nys-textinput-border-color)
      var(--_nys-textinput-border-width);
    outline-color: transparent;
    outline-width: var(--_nys-textinput-outline-width);
    outline-style: solid;
    padding: var(--_nys-textinput-padding);
    width: 100%;
    height: var(--_nys-textinput-height);
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    background-color: transparent;
    position: relative;
    font: inherit;
  }
  .nys-textinput__input::placeholder {
    color: var(--_nys-textinput-color--placeholder);
  }

  .nys-textinput__buttoncontainer {
    width: var(--_nys-textinput-width);
    max-width: 100%;
    display: flex;
  }

  .nys-textinput__buttoncontainer.has-end-button .nys-textinput__input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }

  .nys-textinput__buttoncontainer.has-start-button .nys-textinput__input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }

  .nys-textinput__container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background-color: var(--_nys-textinput-background-color);
    border-radius: var(--_nys-textinput-border-radius);
  }

  ::slotted(nys-button) {
    /* These props ARE NOT publicly overridable */
    --_nys-button-height: var(--_nys-textinput-height);
    --_nys-button-border-radius--left: var(--_nys-textinput-border-radius);
    --_nys-button-border-radius--right: var(--_nys-textinput-border-radius);
    --_nys-button-background-color--disabled: var(
      --_nys-textinput-background-color--disabled
    );
    --_nys-button-border-color--disabled: var(--_nys-textinput-color--disabled);
    --_nys-button-color--disabled: var(--_nys-textinput-color--disabled);
    --_nys-button-border-width: var(--_nys-textinput-border-width);
    z-index: 1; /* to make sure the button outline renders on top of the input */
  }

  .nys-textinput__buttoncontainer.has-start-button ::slotted(nys-button) {
    --_nys-button-border-radius--right: 0;
  }

  .nys-textinput__buttoncontainer.has-end-button ::slotted(nys-button) {
    --_nys-button-border-radius--left: 0;
  }

  .eye-icon {
    position: absolute;
    right: var(--nys-space-50, 4px);
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: var(--_nys-textinput-color--icon);
    /* These props ARE publicly overridable */
    --nys-button-background-color: var(--_nys-textinput-background-color);
    --nys-button-background-color--hover: var(
      --_nys-textinput-background-color
    );
    --nys-button-background-color--active: var(
      --_nys-textinput-background-color
    );
    /* These props ARE NOT publicly overridable */
    --_nys-button-outline-focus: calc(
      var(--_nys-button-outline-width) * -1
    ); /* Needs to be negative of the offset width */
    --_nys-button-padding--y: var(--nys-space-50, 4px);
    --_nys-button-padding--x: var(--nys-space-50, 4px);
    --_nys-button-height: var(--nys-size-300, 32px);
    --_nys-button-width: var(--nys-size-400, 32px);
  }

  /* Hovered */
  .nys-textinput__input:hover:not(:disabled):not(:focus) {
    outline-color: var(--_nys-textinput-outline-color--hover);
    border-color: var(--_nys-textinput-outline-color--hover);
  }

  /* Focused */
  .nys-textinput__input:focus {
    outline-color: var(--_nys-textinput-outline-color--focus);
    border-color: var(--_nys-textinput-outline-color--focus);
    caret-color: var(--_nys-textinput-outline-color--focus);
  }

  /* Disabled */
  .nys-textinput__input:disabled,
  .nys-textinput__input:disabled::placeholder,
  .nys-textinput__input:disabled + .eye-icon {
    background-color: var(--_nys-textinput-background-color--disabled);
    border-color: var(--_nys-textinput-border-color--disabled);
    color: var(--_nys-textinput-color--disabled);
    cursor: not-allowed;
  }
`;
