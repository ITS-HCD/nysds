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
    background: var(--nys-color-black-transparent-700, rgba(27, 27, 27, 0.7));
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
    background: var(--nys-color-surface, #fff);
    position: relative;
    z-index: 10000;
  }

  /*** Modal Header ***/
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

  /*** Modal Body ***/
  .nys-modal_body {
    display: flex;
    padding: var(--nys-space-100, 8px) var(--nys-space-300, 24px)
      var(--nys-space-300, 24px);
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .nys-modal_body-inner {
    overflow: auto;
    width: 100%;
    max-height: 90vh;
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
    padding: var(--nys-space-200, 16px) var(--nys-space-300, 24px)
      var(--nys-space-300, 24px) var(--nys-space-300, 24px);
    justify-content: center;
    gap: var(--nys-space-250, 20px);
    align-self: stretch;
  }

  .nys-modal_footer.hidden ::slotted(*) {
    display: none;
  }

  @media (min-width: 400px) {
    .nys-modal_body-inner {
      max-height: 70vh;
    }
    .nys-modal_footer ::slotted(*) {
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
  }
`;
