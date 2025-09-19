import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Pagination Styles */
    --_nys-pagination-width: fit-content;
    --_nys-pagination-height: var(--nys-size-600, 48px);
    --_nys-pagination-radius: var(--nys-radius-xl, 12px);
    --_nys-pagination-padding: var(--nys-space-100, 8px);
    --_nys-pagination-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-pagination-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-pagination-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-pagination-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-pagination-font-family: var(
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

  .nys-pagination {
    width: var(--_nys-pagination-width);
    height: var(--_nys-pagination-height);
    border-radius: var(--_nys-pagination-radius);
    padding: var(--_nys-pagination-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-pagination-gap);
    font-family: var(--_nys-pagination-font-family);
    font-size: var(--_nys-pagination-font-size);
    font-weight: var(--_nys-pagination-font-weight);
    line-height: var(--_nys-pagination-line-height);
  }
`;
