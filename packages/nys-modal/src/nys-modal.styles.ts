import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Modal Styles */
    --_nys-modal-width: fit-content;
    --_nys-modal-height: var(--nys-size-600, 48px);
    --_nys-modal-radius: var(--nys-radius-xl, 12px);
    --_nys-modal-padding: var(--nys-space-100, 8px);
    --_nys-modal-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-modal-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-modal-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-modal-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-modal-font-family: var(
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

  .nys-modal {
    width: var(--_nys-modal-width);
    height: var(--_nys-modal-height);
    border-radius: var(--_nys-modal-radius);
    padding: var(--_nys-modal-padding);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-modal-gap);
    font-family: var(--_nys-modal-font-family);
    font-size: var(--_nys-modal-font-size);
    font-weight: var(--_nys-modal-font-weight);
    line-height: var(--_nys-modal-line-height);
  }
`;
