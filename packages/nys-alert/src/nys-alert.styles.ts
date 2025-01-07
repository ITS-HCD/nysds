import { css } from "lit";

export default css`
  :host {
    /* Global Alert Styles */
    --_nys-alert-border-width: var(--nys-border-width-lg, 4px);
    --_nys-alert-border-radius: var(--nys-radius-md, 4px);
    --_nys-alert-hover-border-radius: var(--nys-radius-sm, 2px);
    --_nys-alert-color: var(--nys-color-ink, #1b1b1b);
    --_nys-alert-hover-button-color: #0000001a;
    --_nys-alert-spacing: var(--nys-space-250, 20px);
    --_nys-alert-font-family: var(--nys-font-family-ui, "Proxima Nova");
    --_nys-alert-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-alert-lineheight: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-alert-letterspacing: var(--nys-font-letterspacing-ui-md, 0.044px);

    /* Border specifics */
    --_nys-alert-color-border-left: var(
      --nys-color-neutral,
      var(--nys-color-neutral-600, #62666a)
    );

    /* Background theme specifics */
    --_nys-alert-color-bg: var(
      --nys-color-neutral-weak,
      var(--nys-color-neutral-10, #f6f6f6)
    );
  }

  .nys-alert__icon {
    margin-top: 1.5px;
    margin-right: 0.8rem;
  }

  .nys-alert__container {
    display: flex;
    background-color: var(--_nys-alert-color-bg);
    border-left: var(--_nys-alert-border-width) solid
      var(--_nys-alert-color-border-left);
    border-radius: var(--_nys-alert-border-radius);
    color: var(--_nys-alert-color);
    padding: var(--_nys-alert-spacing);
    font-style: normal;
    font-family: var(--_nys-alert-font-family);
    font-size: var(--_nys-alert-font-size);
    line-height: var(--_nys-alert-lineheight);
    letter-spacing: var(--_nys-alert-letterspacing);
  }

  .nys-alert__text {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .nys-alert__label {
    margin: 0;
    font-weight: 600;
  }

  slot[name="text"] {
    font-weight: 400;
    margin: 0;
  }
  ::slotted(p) {
    font-weight: 400;
    margin: 0;
  }

  .close-container {
    margin-left: auto;
  }
  .close-button {
    width: 22px;
    height: 22px;
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: currentColor;
  }
  .close-button:hover {
    border-radius: var(--_nys-alert-hover-border-radius);
    background: var(--_nys-alert-hover-button-color);
  }

  /* Centered variant: For no descriptions, we remove the <slot name="text"> via JS logic. In styling, centers the icon for a compact layout. */
  .nys-alert--centered {
    display: flex;
    align-items: center;
  }
  .nys-alert--centered .nys-alert__label {
    margin: 0;
  }
  .nys-alert--centered div[part="nys-alert__icon"] {
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Alert Types */
  :host([theme="info"]) {
    --_nys-alert-color-border-left: var(--nys-color-info, #154973);
    --_nys-alert-color-bg: var(--nys-color-info-weak, #154973);
  }
  :host([theme="success"]) {
    --_nys-alert-color-border-left: var(--nys-color-success, #00a91c);
    --_nys-alert-color-bg: var(--nys-color-success-weak, #00a91c);
  }
  :host([theme="warning"]) {
    --_nys-alert-color-border-left: var(--nys-color-warning, #ffbe2e);
    --_nys-alert-color-bg: var(--nys-color-warning-weak, #ffbe2e);
  }
  :host([theme="danger"]) {
    --_nys-alert-color-border-left: var(--nys-color-danger, #b52c2c);
    --_nys-alert-color-bg: var(--nys-color-danger-weak, #b52c2c);
  }
  :host([theme="emergency"]) {
    --_nys-alert-color-border-left: var(--nys-color-emergency, #d54309);
    --_nys-alert-color-bg: var(--nys-color-emergency, #d54309);
    --_nys-alert-color: #fff;
    --_nys-alert-hover-button-color: #ffffff1a;
  }
`;
