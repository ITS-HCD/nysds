import { css } from "lit";

export default css`
  :host {
    /* Global Avatar Styles */
    --_nys-avatar-shape: var(--nys-radius-round, 1776px);
    --_nys-avatar-border-color: var(--nys-color-ink-reverse, #fff);
    --_nys-avatar-border-size: var(--nys-border-width-sm, 1px);
    --_nys-avatar-size: var(--nys-font-size-6xl, 36px);
    --_nys-avatar-color: var(--nys-color-theme, #154973);
    --_nys-avatar-background: var(--nys-color-theme-weaker, #46a4e7ff);
  }

  .nys-avatar {
    display: inline-block;
  }

  .nys-avatar__component {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--_nys-avatar-shape);
    width: var(--_nys-avatar-size);
    height: var(--_nys-avatar-size);
    font-size: var(--_nys-avatar-size);
    overflow: hidden;
    box-sizing: border-box;
    color: var(--_nys-avatar-color);
    background-color: var(--_nys-avatar-background);
    border: var(--_nys-avatar-border-size) solid var(--_nys-avatar-border-color);
    transition: all 0.15s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  /* Hover/Active states/Disabled */
  :host([interactive]) .nys-avatar__component:hover,
  :host([interactive]) .nys-avatar__component:active {
    --_nys-avatar-color: var(
      --nys-color-text-reverse,
      --nys-color-ink-reverse,
      #fff
    );
    cursor: pointer;
  }

  :host([interactive]) .nys-avatar__component:hover {
    --_nys-avatar-background: var(--nys-color-theme-mid, #457aa5);
  }

  :host([interactive]) .nys-avatar__component:active {
    --_nys-avatar-background: var(--nys-color-theme-strong, #0e324f);
  }

  :host([disabled]) .nys-avatar__component {
    --_nys-avatar-color: var(--nys-color-text-disabled, #bec0c1);
    --_nys-avatar-background: var(--nys-color-neutral-10, #f6f6f6);
    cursor: not-allowed;
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
