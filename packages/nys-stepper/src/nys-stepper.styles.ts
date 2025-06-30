import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Stepper Styles */

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
    font-family: var(--_nys-stepper-font-family);
    font-size: var(--_nys-stepper-font-size);
    font-weight: var(--_nys-stepper-font-weight);
    line-height: var(--_nys-stepper-line-height);
    display: flex;
    flex-direction: column;
    counter-reset: step;
  }

  .nys-step {
    position: relative;
    counter-increment: step;
    display: flex;
    flex-direction: row;
  }

  .nys-step__linewrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: var(--nys-size-300, 24px);
    margin-right: var(--nys-space-150, 12px);
  }

  .nys-step__line {
    width: var(--nys-size-1px, 1px);
    height: var(--nys-size-300, 24px);
    border-radius: var(--nys-radius-round, 1776px);
    background: var(--nys-color-black-transparent-200, rgba(27, 27, 27, 0.2));
    margin: var(--nys-space-100, 8px) 0;
  }

  .nys-step__number {
    border-radius: var(--nys-radius-round, 1776px);
    border: 1px solid var(--nys-color-neutral-400, #909395);
    background: var(
      --nys-color-white-transparent-900,
      rgba(255, 255, 255, 0.9)
    );
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  :host([previous]) .nys-step__number,
  :host([current]) .nys-step__number {
    background: var(--nys-color-theme-stronger, #081b2b);
    color: var(--nys-color-text-reverse, #fff);
    border-color: var(--nys-color-theme-stronger, #081b2b);
  }

  :host([selected]) .nys-step__number {
    background: var(--nys-color-theme, #154973);
    color: var(--nys-color-text-reverse, #fff);
    border-color: var(--nys-color-theme, #154973);
    outline: 4px solid var(--nys-color-theme-weak, #cddde9);
  }

  .nys-step__number::before {
    content: counter(step);
    line-height: 1;
  }

  /* Hide the line wrapper in the last step */
  :host([last]) .nys-step__line {
    display: none;
  }
`;
