import { css } from "lit";

export default css`
  :host {
    --nys-icon-color: currentcolor;
    --nys-icon-size: 1cap;
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
  .nys-icon--12 {
    width: 0.75rem;
    height: 0.75rem;
  }
  .nys-icon--16 {
    width: 1rem;
    height: 1rem;
  }
  .nys-icon--24 {
    width: 1.5rem;
    height: 1.5rem;
  }
  .nys-icon--32 {
    width: 2rem;
    height: 2rem;
  }
  .nys-icon--48 {
    width: 3rem;
    height: 3rem;
  }
  .nys-icon--64 {
    width: 4rem;
    height: 4rem;
  }

  /* Flipping Icons */
  .nys-icon--flip-horizontal {
    transform: scaleX(-1);
  }
  .nys-icon--flip-vertical {
    transform: scaleY(-1);
  }
  .nys-icon--flip-both {
    transform: scale(-1, -1);
  }
`;
