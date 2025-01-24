import { css } from "lit";

export default css`
  :host {
    /* Global Avatar Styles */
    --_nys-avatar-shape: var(--nys-radius-md, var(--nys-space-50, 4px));
    --_nys-avatar-border: var(--nys-font-size-6xl, 36px);
    --_nys-avatar-size: var(--nys-font-size-6xl, 36px);
  }

  .nys-component__component {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--_nys-avatar-shape);
    width: var(--_nys-avatar-size);
    height: var(--_nys-avatar-size);
    font-size: var(--_nys-avatar-size);
    overflow: hidden;
    box-sizing: border-box;
    color: white;
  }

  /* Shape */
  :host([shape="square"]) {
    --_nys-avatar-shape: var(--nys-radius-xs, var(--nys-space-1px, 1px));
  }

  :host([shape="rounded"]) {
    --_nys-avatar-shape: var(--nys-radius-md, var(--nys-space-50, 4px));
  }

  :host([shape="circle"]) {
    --_nys-avatar-shape: var(--nys-radius-round, 1776px);
  }

  div[part="nys-avatar__icon"] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Content styles */
  .nys-avatar__initials {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: calc(var(--_nys-avatar-size) * 0.5);
    font-weight: bold;
    text-transform: uppercase;
  }

  .nys-avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nys-avatar__icon {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;
