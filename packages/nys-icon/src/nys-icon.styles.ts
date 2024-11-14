import { css } from "lit";

export default css`
  :host {
    --nys-icon-color: currentcolor;
    --nys-icon-size: 1em;
  }
  .icon-container {
    padding: 0;
    margin: 0 auto;
    width: var(--icon-size, 1cap);
    height: auto;
    display: inline-block;
    white-space: nowrap;
  }
  /* SVG size is determined by the icon-container size */
  svg {
    width: 100%;
    height: 100%;
  }

  /* Size variants */
  .xs {
    width: calc(var(--nys-icon-size) * 0.5);
    height: calc(var(--nys-icon-size) * 0.5);
  }
  .sm {
    width: calc(var(--nys-icon-size) * 0.75);
    height: calc(var(--nys-icon-size) * 0.75);
  }
  .md {
    width: var(--nys-icon-size);
    height: var(--nys-icon-size);
  }
  .lg {
    width: calc(var(--nys-icon-size) * 1.5);
    height: calc(var(--nys-icon-size) * 1.5);
  }
  .xl {
    width: calc(var(--nys-icon-size) * 2);
    height: calc(var(--nys-icon-size) * 2);
  }
`;
