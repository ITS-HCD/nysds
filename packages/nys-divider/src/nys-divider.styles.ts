import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Divider Styles */
    --_nys-divider-size: var(--nys-size-2px, 2px);
    --_nys-divider-color: var(--nys-color-neutral-200, #bec0c1);
  }

  /* Sizes */
  :host([size="sm"]) {
    --_nys-divider-size: var(--nys-size-1px, 1px);
  }
  :host([size="lg"]) {
    --_nys-divider-size: var(--nys-size-50, 4px);
  }

  /* Inverted */
  :host([inverted]) {
    --_nys-divider-color: var(--nys-color-ink-reverse, #fff);
  }

  .nys-divider {
    width: 100%;
    height: var(--_nys-divider-size);
    padding: var(--_nys-divider-padding);
    background-color: var(--_nys-divider-color);
    flex: 1 0 0;
  }

  /* Vertical */
  :host([vertical]) {
    height: 100%;
  }

  :host([vertical]) .nys-divider {
    width: var(--_nys-divider-size);
    height: 100%;
  }
`;
