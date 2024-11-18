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
  .nys-icon--2xs {
    width: calc(var(--nys-icon-size) * 0.75);
    height: calc(var(--nys-icon-size) * 0.75);
  }
  .nys-icon--xs {
    width: calc(var(--nys-icon-size) * 0.875);
    height: calc(var(--nys-icon-size) * 0.875);
  }
  .nys-icon--sm {
    width: var(--nys-icon-size);
    height: var(--nys-icon-size);
  }
  .nys-icon--md {
    width: calc(var(--nys-icon-size) * 1.125);
    height: calc(var(--nys-icon-size) * 1.125);
  }
  .nys-icon--lg {
    width: calc(var(--nys-icon-size) * 1.25);
    height: calc(var(--nys-icon-size) * 1.25);
  }
  .nys-icon--xl {
    width: calc(var(--nys-icon-size) * 1.5);
    height: calc(var(--nys-icon-size) * 1.5);
  }
  .nys-icon--2xl {
    width: calc(var(--nys-icon-size) * 1.875);
    height: calc(var(--nys-icon-size) * 1.875);
  }
  .nys-icon--3xl {
    width: calc(var(--nys-icon-size) * 2.25);
    height: calc(var(--nys-icon-size) * 2.25);
  }
  .nys-icon--4xl {
    width: calc(var(--nys-icon-size) * 3);
    height: calc(var(--nys-icon-size) * 3);
  }

  /* Literal Sizing */
  .nys-icon--s1 {
    width: 1rem;
    height: 1rem;
  }
  .nys-icon--s2 {
    width: 2rem;
    height: 2rem;
  }
  .nys-icon--s3 {
    width: 3rem;
    height: 3rem;
  }
  .nys-icon--s4 {
    width: 4rem;
    height: 4rem;
  }
  .nys-icon--s5 {
    width: 5rem;
    height: 5rem;
  }
  .nys-icon--s6 {
    width: 6rem;
    height: 6rem;
  }
  .nys-icon--s7 {
    width: 7rem;
    height: 7rem;
  }
  .nys-icon--s8 {
    width: 8rem;
    height: 8rem;
  }
  .nys-icon--s9 {
    width: 9rem;
    height: 9rem;
  }
  .nys-icon--s10 {
    width: 10rem;
    height: 10rem;
  }
`;
