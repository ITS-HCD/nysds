import { css } from "lit";

export default css`
  :host {
    --radius-rounded: 1776px;
    --radius-md: 4px;
    --radius-1: 1px;
    --size-200: 16px;
    --size-300: 24px;
    --size-400: 32px;

    /* Default values */
    --avatar-shape: var(--radius-md);
    --avatar-border: var(--size-300);
  }

  .nys-component__component {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--avatar-shape);
    width: var(--avatar-size, var(--size-300));
    height: var(--avatar-size, var(--size-300));
    font-size: var(--avatar-size, var(--size-300));
    overflow: hidden;
    box-sizing: border-box;
    color: white;
  }

  /* Sizes */
  :host([size="sm"]) {
    --avatar-size: var(--size-200);
  }

  :host([size="md"]) {
    --avatar-size: var(--size-300);
  }

  :host([size="lg"]) {
    --avatar-size: var(--size-400);
  }

  /* Shape */
  :host([shape="square"]) {
    --avatar-shape: var(--radius-1);
  }

  :host([shape="rounded"]) {
    --avatar-shape: var(--radius-md);
  }

  :host([shape="circle"]) {
    --avatar-shape: var(--radius-rounded);
  }

  div[part="icon"] {
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
    font-size: calc(var(--avatar-size, var(--size-300)) * 0.5);
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
