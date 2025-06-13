import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Tooltip Styles */
    --_nys-tooltip-width: fit-content;
    --_nys-tooltip-height: var(--nys-size-600, 48px);
    --_nys-tooltip-radius: var(--nys-radius-xl, 12px);
    --_nys-tooltip-padding: var(--nys-space-100, 8px);
    --_nys-tooltip-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-tooltip-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-tooltip-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-tooltip-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-tooltip-font-family: var(
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

  .nys-tooltip {
    width: var(--_nys-tooltip-width);
    height: var(--_nys-tooltip-height);
    border-radius: var(--_nys-tooltip-radius);
    padding: var(--_nys-tooltip-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-tooltip-gap);
    font-family: var(--_nys-tooltip-font-family);
    font-size: var(--_nys-tooltip-font-size);
    font-weight: var(--_nys-tooltip-font-weight);
    line-height: var(--_nys-tooltip-line-height);
  }
`;
