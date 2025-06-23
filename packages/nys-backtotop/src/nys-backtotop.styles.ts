import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Backtotop Styles */
    --_nys-backtotop-width: fit-content;
    --_nys-backtotop-height: var(--nys-size-600, 48px);
    --_nys-backtotop-radius: var(--nys-radius-xl, 12px);
    --_nys-backtotop-padding: var(--nys-space-100, 8px);
    --_nys-backtotop-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-backtotop-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-backtotop-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-backtotop-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-backtotop-font-family: var(
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

  .nys-backtotop {
    width: var(--_nys-backtotop-width);
    height: var(--_nys-backtotop-height);
    border-radius: var(--_nys-backtotop-radius);
    padding: var(--_nys-backtotop-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-backtotop-gap);
    font-family: var(--_nys-backtotop-font-family);
    font-size: var(--_nys-backtotop-font-size);
    font-weight: var(--_nys-backtotop-font-weight);
    line-height: var(--_nys-backtotop-line-height);
  }
`;
