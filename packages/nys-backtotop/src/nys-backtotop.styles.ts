import { css } from "lit";

export default css`
  :host {
  }

  .nys-backtotop {
    --_nys-button-radius-left: var(--nys-radius-round, 1776px);
    --_nys-button-radius-right: var(--nys-radius-round, 1776px);
    --_nys-button-padding-y: var(--nys-space-100, 8px);
    --_nys-button-padding-x: var(--nys-space-200, 16px);

    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 9999;
    display: none;
  }

  .left {
    left: 1rem;
    right: auto;
  }

  .visible {
    display: inline-flex;
  }
  @media (min-width: 0) and (max-width: 479px) {
    .nys-backtotop--full {
      display: none;
    }
  }

  @media (min-width: 480px) {
    .nys-backtotop--mobile {
      display: none;
    }
  }
`;
