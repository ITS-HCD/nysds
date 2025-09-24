import { css } from "lit";

export default css`
  :host {
    /* Global Modal Styles */
    --_nys-modal-width: 480px;
    --_nys-modal-min-width: 320px;
    --_nys-modal-radius: var(--nys-radius-lg, 8px);
    --_nys-modal-border: 1px solid var(--nys-color-neutral-200, #bec0c1);
    --_nys-modal-background: var(--nys-color-surface, #fff);

    /* Modal Overlay */
    --_nys-modal-overlay-background: var(
      --nys-color-black-transparent-700,
      rgba(27, 27, 27, 0.7)
    );

    /* Modal Header */
    --_nys-modal-header-gap: var(--nys-space-150, 12px);
    --_nys-modal-header-padding: var(--nys-space-300, 24px);

    /* Modal Body */
    --_nys-modal-body-padding: var(--nys-space-100, 8px)
      var(--nys-space-300, 24px) var(--nys-space-300, 24px);

    /* Modal Footer */
    --_nys-modal-footer-padding: var(--nys-space-200, 16px)
      var(--nys-space-300, 24px) var(--nys-space-300, 24px)
      var(--nys-space-300, 24px);
    --_nys-modal-footer-gap: var(--nys-space-250, 20px);

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

  /*** CSS & Slot resets ***/
  * {
    box-sizing: border-box;
  }

  ::slotted(p) {
    margin: 0;
  }

  h2,
  p {
    flex: 1;
    margin: 0;
  }

  /*** Modal Overlay (black transparent background) ***/
  .nys-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    background: var(--_nys-modal-overlay-background);
  }

  /*** Base ***/
  .nys-modal {
    display: flex;
    flex-direction: column;
    margin: 20px;
    width: var(--_nys-modal-width);
    min-width: var(--_nys-modal-min-width);
    border-radius: var(--_nys-modal-radius);
    border: var(--_nys-modal-border);
    font-family: var(--_nys-modal-font-family);
    font-size: var(--_nys-modal-font-size);
    font-weight: var(--_nys-modal-font-weight);
    line-height: var(--_nys-modal-line-height);
    background: var(--_nys-modal-background);
    position: relative;
    z-index: 10000;
  }

  /*** Modal Header ***/
  .nys-modal_header {
    display: flex;
    padding: var(--_nys-modal-header-padding);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--_nys-modal-header-gap);
  }

  .nys-modal_header-inner {
    display: flex;
    align-items: center;
    width: 100%;
  }

  /*** Modal Body ***/
  .nys-modal_body {
    display: flex;
    padding: var(--_nys-modal-body-padding);
    flex-direction: column;
    align-items: flex-start;
  }

  .nys-modal_body-inner {
    overflow: auto;
    width: 100%;
    max-height: 45vh;
  }

  .nys-modal_body.hidden {
    display: none;
  }

  /* Scrollbar styling */
  .nys-modal_body-inner::-webkit-scrollbar {
    width: 8px;
  }

  .nys-modal_body-inner::-webkit-scrollbar-track {
    background: transparent;
  }

  .nys-modal_body-inner::-webkit-scrollbar-thumb {
    background: var(--scrollbar-default, rgba(0, 0, 0, 0.23));
    border-radius: 100px;
  }

  .nys-modal_body-inner::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-hover, rgba(0, 0, 0, 0.5));
  }

  /*** Modal Footer (i.e. where the button slot is) ***/
  .nys-modal_footer ::slotted(*) {
    display: flex;
    flex-direction: column;
    padding: var(--_nys-modal-footer-padding);
    justify-content: center;
    gap: var(--_nys-modal-footer-gap);
    align-self: stretch;
  }

  .nys-modal_footer.hidden ::slotted(*) {
    display: none;
  }

  @media (min-width: 400px) {
    .nys-modal_body-inner {
      max-height: 25vh;
    }
    .nys-modal_footer ::slotted(*) {
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }
`;
