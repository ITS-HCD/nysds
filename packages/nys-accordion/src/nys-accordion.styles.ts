import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Accordion Styles */
    --_nys-accordion-width: fit-content;
    --_nys-accordion-height: var(--nys-size-600, 48px);
    --_nys-accordion-radius: var(--nys-radius-xl, 12px);
    --_nys-accordion-padding: var(--nys-space-100, 8px);
    --_nys-accordion-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-accordion-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-accordion-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-accordion-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-accordion-font-family: var(
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

  .nys-accordion {
    width: var(--_nys-accordion-width);
    height: var(--_nys-accordion-height);
    border-radius: var(--_nys-accordion-radius);
    padding: var(--_nys-accordion-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-accordion-gap);
    font-family: var(--_nys-accordion-font-family);
    font-size: var(--_nys-accordion-font-size);
    font-weight: var(--_nys-accordion-font-weight);
    line-height: var(--_nys-accordion-line-height);
  }
`;
