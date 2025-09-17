import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Modal Styles */
    --_nys-modal-width: 480px;
    --_nys-modal-min-width: 320px;
    --_nys-modal-radius: var(--nys-radius-lg, 8px);
    --_nys-modal-border: 1px solid var(--nys-color-neutral-200, #bec0c1);
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

  /* CSS & Slot resets */
  ::slotted(p) {
    margin: 0;
  }
  h2, p {
    flex: 1;
    margin: 0
  }

  /* Base */
  .nys-modal {
    display: flex;
    flex-direction: column;
    width: var(--_nys-modal-width);
    min-width: var(--_nys-modal-min-width);
    border-radius: var(--_nys-modal-radius);
    border: var(--_nys-modal-border);
    font-family: var(--_nys-modal-font-family);
    font-size: var(--_nys-modal-font-size);
    font-weight: var(--_nys-modal-font-weight);
    line-height: var(--_nys-modal-line-height);
    background: var(--nys-color-surface, #fff);
  }

  /* Modal Header */
  .nys-modal_header {
    display: flex;
    padding: var(--nys-space-300, 24px);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--nys-space-150, 12px);
  }

  .nys-modal_header-inner {
    display: flex;
    align-items: center;
    width: 100%;
  }

  /* Modal Body */
  .nys-modal_body {
    display: flex;
    height: 182px;
    padding: var(--nys-space-300, 24px);
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    overflow: auto;
  }

  /* Modal Footer (i.e. where the button slot is) */
  .nys-modal_footer ::slotted(*) {
    display: flex;
    padding: var(--nys-space-300, 24px);
    justify-content: center;
    align-items: center;
    gap: var(--nys-space-250, 20px);
  }

  @media (min-width: 400px) {
    .nys-modal_footer ::slotted(*) {
      justify-content: flex-end;
    }
  }
`;
