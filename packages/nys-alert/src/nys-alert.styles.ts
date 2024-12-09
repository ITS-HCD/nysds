import { css } from "lit";

export default css`
  .nys-alert__icon {
    margin-right: 0.8rem;
  }

  .nys-alert__container {
    display: flex;
    background-color: #f0f0f0;
    border-left: 0.5rem solid #adadad;
    color: #1b1b1b;
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

  /* Slim variant: Disables the heading via JS logic. In styling, centers the icon for a compact layout. */
  .nys-alert--slim {
    display: flex;
    align-items: center;
  }

  /* Alert Types */
  .nys-alert--info {
    background-color: #e7f6f8;
    border-left-color: #00bde3;
  }
  .nys-alert--warning {
    background-color: #faf3d1;
    border-left-color: #ffbe2e;
  }
  .nys-alert--success {
    background-color: #ecf3ec;
    border-left-color: #00a91c;
  }
  .nys-alert--error {
    background-color: #f4e3db;
    border-left-color: #d54309;
  }
  .nys-alert--emergency {
    background-color: #9c3d10;
    border-left-color: #9c3d10;
    color: #fff;
  }
`;
