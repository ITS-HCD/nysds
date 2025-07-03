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
    background: var(--nys-color-surface-raised, #f6f6f6);
    padding: var(--nys-space-400, 32px);
  }

  .nys-stepper__header {
    margin-bottom: var(--nys-space-300, 24px);
    display: flex;
    flex-direction: column;
  }

  :host([isCompact]) .nys-stepper__header {
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  ::slotted(div[slot="actions"]) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--nys-space-100, 8px);
    margin-bottom: var(--nys-space-300, 24px);
  }

  .nys-stepper__counter {
    display: none;
    text-decoration: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: 7%; /* 1.12px */
    text-underline-offset: auto;
    text-underline-position: from-font;
    color: var(--nys-color-text, #1b1b1b);
    text-overflow: ellipsis;
    font-family: var(--nys-type-family-ui, "Proxima Nova");
    font-size: var(--nys-type-size-ui-md, 16px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--nys-type-size-ui-md, 16px);
  }

  :host([isCompact]) .nys-stepper__counter {
    display: block;
  }

  :host([isCompact]) .nys-stepper__steps {
    display: flex;
    gap: var(--nys-space-100, 8px);
  }

  .nys-step {
    position: relative;
    counter-increment: step;
    display: flex;
    flex-direction: column;
  }

  .nys-step__contentwrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--nys-space-150, 12px);
    cursor: default;
  }

  :host([isCompact]) .nys-step__contentwrapper {
    gap: 0;
  }

  .nys-step__contentwrapper:focus-visible {
    outline: solid var(--nys-color-focus, #004dd1)
      var(--nys-border-width-md, 2px);
    outline-offset: var(--nys-space-2px, 2px);
    border-radius: var(--nys-radius-md, 4px);
  }

  .nys-step__linewrapper {
    width: 24px;
    display: flex;
    justify-content: center;
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

  :host([isCompact]) .nys-step__number {
    border-radius: 0;
    border: none;
    background-color: var(--nys-color-neutral-200, #bec0c1);
    height: var(--nys-size-100, 8px);
    width: 100%;
  }

  :host([previous]) .nys-step__number,
  :host([previous]) .nys-step__line,
  :host([current]) .nys-step__number,
  :host([current]) .nys-step__line {
    background: var(--nys-color-theme-stronger, #081b2b);
    color: var(--nys-color-text-reverse, #fff);
    border-color: var(--nys-color-theme-stronger, #081b2b);
  }

  :host([isCompact][previous]) .nys-step__number,
  :host([isCompact][current]) .nys-step__number {
    background-color: var(--nys-color-neutral-900, #1b1b1b);
  }

  :host([selected]) .nys-step__number {
    background: var(--nys-color-theme, #154973);
    color: var(--nys-color-text-reverse, #fff);
    border-color: var(--nys-color-theme, #154973);
    outline: 4px solid var(--nys-color-theme-weak, #cddde9);
  }

  :host([isCompact][selected]) .nys-step__number {
    background-color: var(--nys-color-theme-mid, #457aa5);
    outline: none;
  }

  .nys-step__number::before {
    content: counter(step);
    line-height: 1;
    padding-top: 2px;
  }

  :host([isCompact]) .nys-step__number::before {
    content: "";
  }

  /* Hide the line wrapper in the last step */
  :host([first]) .nys-step__linewrapper {
    display: none;
  }

  :host([isCompact]) .nys-step__linewrapper {
    display: none;
  }

  .nys-step__content {
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-100, 8px);
  }

  .nys-step__label {
    overflow: hidden;
    color: var(--nys-color-text, #1b1b1b);
    text-overflow: ellipsis;
    font-family: var(--nys-type-family-ui, "Proxima Nova");
    font-size: var(--nys-type-size-ui-md, 16px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--nys-type-size-ui-md, 16px);
    letter-spacing: var(--nys-font-letterspacing-ui-md, 0.044px);
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: 7%; /* 1.12px */
    text-underline-offset: auto;
    text-underline-position: from-font;
  }

  :host([isCompact]) .nys-step__label {
    display: none;
  }

  :host([current]) .nys-step__label,
  :host([previous]) .nys-step__label {
    text-decoration-line: underline;
  }

  :host([current]) .nys-step__contentwrapper,
  :host([previous]) .nys-step__contentwrapper {
    cursor: pointer;
  }

  :host([selected]) .nys-step__label {
    /* UI/Medium/Bold */
    font-weight: 700;
    text-decoration-line: none;
  }

  :host([selected]) .nys-step__contentwrapper {
    cursor: default;
  }

  :host([selected][!isCompact]) .nys-step__contentwrapper:focus-visible {
    outline-offset: 6px;
  }

  .nys-step__currentflag {
    overflow: hidden;
    color: var(--nys-color-text-weak, #4a4d4f);
    text-overflow: ellipsis;
    font-size: var(--nys-typography-type-size-ui-xs, 12px);
    font-weight: 600;
    line-height: var(--nys-typography-type-size-ui-xs, 12px);
    letter-spacing: var(--nys-typography-font-letterspacing-ui-xs, 0.057px);
  }

  :host([isCompact]) .nys-step__currentflag {
    display: none;
  }
`;
