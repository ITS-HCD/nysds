import { css } from "lit";

export default css`
  :host {
    --nys-icon-color: currentcolor;
    --nys-icon-size: 1em;
  }

  /* SVG size and color is initially determined by the parent's font-size and text-color */
  svg {
    width: var(--nys-icon-size, 1cap);
    height: var(--nys-icon-size, 1cap);
    display: inline-block;
    white-space: nowrap;
  }

  /* Relative Sizes */
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

  /* Literal Sizing */
  .s1 {
    width: 1rem;
    height: 1rem;
  }
  .s2 {
    width: 2rem;
    height: 2rem;
  }
  .s3 {
    width: 3rem;
    height: 3rem;
  }
  .s4 {
    width: 4rem;
    height: 4rem;
  }
  .s5 {
    width: 5rem;
    height: 5rem;
  }
  .s6 {
    width: 6rem;
    height: 6rem;
  }
  .s7 {
    width: 7rem;
    height: 7rem;
  }
  .s8 {
    width: 8rem;
    height: 8rem;
  }
  .s9 {
    width: 9rem;
    height: 9rem;
  }
  .s10 {
    width: 10rem;
    height: 10rem;
  }
`;
