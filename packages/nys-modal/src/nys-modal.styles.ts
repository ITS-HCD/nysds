import { css } from "lit";

export default css`
  :host {
    /* Global Modal Styles */
    --_nys-modal-width: 439px;
    --_nys-modal-border-radius: var(--nys-radius-lg, 8px);
    --_nys-modal-border-color: var(--nys-color-neutral-200, #bec0c1);
    --_nys-modal-border-width: 1px;
    --_nys-modal-background-color: var(--nys-color-surface, #fff);
    --_nys-modal-margin: var(--nys-space-250, 20px);
    --_nys-modal-padding: var(--nys-space-300, 24px);
    --_nys-modal-gap: var(--nys-space-200, 16px);

    /* Modal Overlay */
    --_nys-modal-background-color--overlay: var(
      --nys-color-black-transparent-700,
      rgba(27, 27, 27, 0.7)
    );

    /* Modal Header */
    --_nys-modal-gap--header: var(--nys-space-100, 8px);

    /* Modal Footer */
    --_nys-modal-gap--footer: var(--nys-space-250, 20px);

    /* Typography */
    --_nys-modal-font-size: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-modal-font-size--subheader: var(
      --nys-font-size-body-lg,
      var(--nys-font-size-lg, 18px)
    );
    --_nys-modal-font-weight--header: var(--nys-font-weight-bold, 700);
    --_nys-modal-font-weight--subheader: var(--nys-font-weight-semibold, 600);
    --_nys-modal-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-modal-line-height--subheader: var(
      --nys-font-lineheight-body-lg,
      28px
    );
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
    margin: 0 !important;
  }

  h2,
  p {
    flex: 1;
    margin: 0;
    margin-bottom: 0;
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
    background: var(--_nys-modal-background-color--overlay);
  }

  /*** Base ***/
  .nys-modal {
    display: flex;
    flex-direction: column;
    margin: var(--_nys-modal-margin);
    padding: var(--_nys-modal-padding);
    gap: var(--_nys-modal-gap);
    width: var(--_nys-modal-width);
    border-radius: var(--_nys-modal-border-radius);
    border: var(--_nys-modal-border-width) solid var(--_nys-modal-border-color);
    font-family: var(--_nys-modal-font-family);
    font-size: var(--_nys-modal-font-size);
    line-height: var(--_nys-modal-line-height);
    background: var(--_nys-modal-background-color);
    position: relative;
    z-index: 10000;
  }

  /*** Modal Header ***/
  .nys-modal_header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--_nys-modal-gap--header);
  }

  .nys-modal_header p {
    font-size: var(--_nys-modal-font-size--subheader);
    font-weight: var(--_nys-modal-font-weight--subheader);
    line-height: var(--_nys-modal-line-height--subheader);
  }

  .nys-modal_header-inner {
    display: flex;
    align-items: center;
    width: 100%;
    font-weight: var(--_nys-modal-font-weight--header);
  }

  /*** Modal Body ***/
  .nys-modal_body {
    display: flex;
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

  /*** Modal Footer (i.e. where the button slot is) ***/
  .nys-modal_footer ::slotted(*) {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    gap: var(--_nys-modal-gap--footer);
    align-self: stretch;
  }

  .nys-modal_footer.hidden ::slotted(*) {
    display: none;
  }

  /* Mobile Large */
  @media (min-width: 480px) {
    .nys-modal_body-inner {
      max-height: 25vh;
    }
    .nys-modal_footer ::slotted(*) {
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .nys-modal {
      --_nys-modal-width: 439px;
    }
  }

  /* Tablet */
  @media (min-width: 768px) {
    .nys-modal {
      --_nys-modal-width: 600px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .nys-modal {
      --_nys-modal-width: 752px;
    }
  }

  /* Desktop Large */
  @media (min-width: 1280px) {
    .nys-modal {
      --_nys-modal-width: 840px;
    }
  }
`;
