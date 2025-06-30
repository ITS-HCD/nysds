import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Stepper Styles */
    --_nys-stepper-width: fit-content;
    --_nys-stepper-height: var(--nys-size-600, 48px);
    --_nys-stepper-radius: var(--nys-radius-xl, 12px);
    --_nys-stepper-padding: var(--nys-space-100, 8px);
    --_nys-stepper-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-stepper-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-stepper-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-stepper-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-stepper-font-family: var(
      --nys-font-family-ui,
      var(
        --nys-font-family-sans,
        "Proxima Nova",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        sans-serif
      )
    );
  }

  .nys-stepper {
    width: var(--_nys-stepper-width);
    height: var(--_nys-stepper-height);
    border-radius: var(--_nys-stepper-radius);
    padding: var(--_nys-stepper-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-stepper-gap);
    font-family: var(--_nys-stepper-font-family);
    font-size: var(--_nys-stepper-font-size);
    font-weight: var(--_nys-stepper-font-weight);
    line-height: var(--_nys-stepper-line-height);
  }
`;
