import { css } from "lit";

export default css`
  :host {
    --icon-color: currentcolor;
    --icon-size: 1em;
  }
  .icon-container {
    padding: 0;
    margin: 0 auto;
    width: var(--icon-size, 1cap);
    height: auto;
    display: inline-block;
    white-space: nowrap;
    vertical-align: middle;
  }
  /* SVG size is determined by the icon-container size */
  svg {
    width: 100%;
    height: 100%;
  }
  .xs {
    height: calc(var(--icon-size) * 0.5);
    width: auto;
  }
  .sm {
    height: calc(var(--icon-size) * 1);
    width: auto;
  }
  .md {
    height: calc(var(--icon-size) * 1.5);
    width: auto;
  }
  .lg {
    height: calc(var(--icon-size) * 2);
    width: auto;
  }
  .xl {
    height: calc(var(--icon-size) * 2.5);
    width: auto;
  }
`;
