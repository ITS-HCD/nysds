import { css } from "lit";

export default css`
  :host {
    /* Global Alert Styles */
    --_nys-alert-border-width: var(--nys-border-width-lg, 4px);
    --_nys-alert-border-radius: var(--nys-radius-md, 4px);
    --_nys-alert-color: var(--nys-color-ink, #1b1b1b);

    /* Border specifics */
    --_nys-alert-color-border-left: var(--nys-color-neutral-600, #62666a);

    /* Background theme specifics */
    --_nys-alert-color-bg: var(--nys-color-neutral-10, #f6f6f6);
  }
  .nys-alert__icon {
    margin-right: 0.8rem;
  }

  .nys-alert__container {
    display: flex;
    background-color: var(--_nys-alert-color-bg);
    border-left: var(--_nys-alert-border-width) solid
      var(--_nys-alert-color-border-left);
    border-radius: var(--_nys-alert-border-radius);
    color: var(--_nys-alert-color);
    padding: 1rem 1.5rem;
    font-family:
      Source Sans Pro Web,
      Helvetica Neue,
      Helvetica,
      Roboto,
      Arial,
      sans-serif;
    font-size: 1.06rem;
    line-height: 1.5;
  }

  .nys-alert__text {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .nys-alert__label {
    margin: 0 0 0.5rem 0;
    font-family:
      Source Sans Pro Web,
      Helvetica Neue,
      Helvetica,
      Roboto,
      Arial,
      sans-serif;
    font-size: 1.33rem;
    line-height: 0.9;
  }

  slot[name="text"] {
    margin: 0;
  }
  ::slotted(p) {
    margin: 0;
  }

  .close-container {
    margin-left: auto;
  }
  .close-button {
    background: none;
    border: none;
    display: flex;
    cursor: pointer;
    color: currentColor;
  }

  /* Centered variant: For no descriptions, we remove the <slot name="text"> via JS logic. In styling, centers the icon for a compact layout. */
  .nys-alert--centered {
    display: flex;
    align-items: center;
  }
  .nys-alert--centered .nys-alert__label {
    margin: 0;
  }
  div[part="nys-avatar__icon"] {
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
  }
`;
