import { css } from "lit";

export default css`
  :host {
    --icon-color: currentcolor;
    --icon-size: 1cap;
  }
  .icon-container {
    padding: 0;
    margin: 0;
    width: 1rem;
    height: 1rem;
    display: inline-block;
  }
  svg {
    width: 100%;
    height: 100%;
  }
  .nys-icon--size-3 {
    height: 1.5rem !important;
    width: 1.5rem !important;
  }
  .nys-icon--size-4 {
    height: 2rem !important;
    width: 2rem !important;
  }
  .nys-icon--size-5 {
    height: 2.5rem !important;
    width: 2.5rem !important;
  }
  .nys-icon--size-6 {
    height: 3rem !important;
    width: 3rem !important;
  }
  .nys-icon--size-7 {
    height: 3.5rem !important;
    width: 3.5rem !important;
  }
  .nys-icon--size-8 {
    height: 4rem !important;
    width: 4rem !important;
  }
  .nys-icon--size-9 {
    height: 4.5rem !important;
    width: 4.5rem !important;
  }
`;
