import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Badge Styles */
    --_nys-badge-width: fit-content;
    --_nys-badge-height: var(--nys-size-600, 48px);
    --_nys-badge-radius: var(--nys-radius-xl, 12px);
    --_nys-badge-padding: var(--nys-space-100, 8px);
    --_nys-badge-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-badge-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-badge-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-badge-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-badge-font-family: var(
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

  .nys-badge {
    width: var(--_nys-badge-width);
    height: var(--_nys-badge-height);
    border-radius: var(--_nys-badge-radius);
    padding: var(--_nys-badge-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-badge-gap);
    font-family: var(--_nys-badge-font-family);
    font-size: var(--_nys-badge-font-size);
    font-weight: var(--_nys-badge-font-weight);
    line-height: var(--_nys-badge-line-height);
  }
`;
