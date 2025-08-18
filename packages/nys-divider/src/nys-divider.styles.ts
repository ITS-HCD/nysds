import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Divider Styles */
    --_nys-divider-width: fit-content;
    --_nys-divider-height: var(--nys-size-600, 48px);
    --_nys-divider-radius: var(--nys-radius-xl, 12px);
    --_nys-divider-padding: var(--nys-space-100, 8px);
    --_nys-divider-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-divider-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-divider-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-divider-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-divider-font-family: var(
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

  .nys-divider {
    width: var(--_nys-divider-width);
    height: var(--_nys-divider-height);
    border-radius: var(--_nys-divider-radius);
    padding: var(--_nys-divider-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-divider-gap);
    font-family: var(--_nys-divider-font-family);
    font-size: var(--_nys-divider-font-size);
    font-weight: var(--_nys-divider-font-weight);
    line-height: var(--_nys-divider-line-height);
  }
`;
