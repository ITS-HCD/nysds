import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Accordion Styles */
    --_nys-accordion-width: fit-content;
    --_nys-accordion-background: var(--nys-color-neutral-50, #ededed);
    --_nys-accordion-radius: var(--nys-radius-md, 4px);
    --_nys-accordion-padding: var(--nys-space-200, 16px)
      var(--nys-space-250, 20px);
    --_nys-accordion-gap: var(--nys-space-200, 16px);

    /* Typography */
    --_nys-accordion-font-size: var(--nys-type-size-ui-xl, 20px);
    --_nys-accordion-font-weight: var(--nys-font-weight-bold, 700);
    --_nys-accordion-line-height: var(--nys-font-lineheight-ui-xl, 28px);
    --_nys-accordion-line-letterspacing: var(
      --nys-font-letterspacing-ui-xl,
      0.017px
    );
    --_nys-accordion-font-family: var(
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

  /* CSS Resets */
  ::slotted(p),
  p {
    margin: 0 !important;
  }

  .nys-accordion {
    font-family: var(--_nys-accordion-font-family);
    font-size: var(--_nys-accordion-font-size);
    font-weight: var(--_nys-accordion-font-weight);
    line-height: var(--_nys-accordion-line-height);
    letter-spacing: var(--_nys-accordion-line-letterspacing);
  }

  .nys-accordion__heading {
    display: flex;
    padding: var(--_nys-accordion-padding);
    align-items: center;
    gap: var(--_nys-accordion-gap);
    align-self: stretch;
    border-radius: var(--_nys-accordion-radius);
    background: var(--_nys-accordion-background);
    cursor: pointer;
  }
  .nys-accordion__heading .nys-accordion__heading-title {
    flex: 1;
  }

  /*** Content layer ***/
  .nys-accordion__content {
    height: 0;
    overflow: hidden;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  .nys-accordion__content-slot-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--nys-space-100, 8px);
    align-self: stretch;
    padding: var(--nys-space-200, 16px) var(--local-xx-spacing-205, 20px);
    background: var(--nys-color-ink-reverse, #fff);
  }

  .nys-accordion__content-slot-container-text{
    max-width: 528px;
  }

  /*** Expanded Styling ***/
  .expand-icon {
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  :host([expanded]) .expand-icon {
    transform: rotate(180deg);
  }

  /*** Bordered Styling ***/
  :host([bordered][expanded]) .nys-accordion__heading {
    border-radius: var(--_nys-accordion-radius) var(--_nys-accordion-radius) 0 0;
  }

  :host([bordered]) .nys-accordion__content-slot-container {
    border: var(--nys-border-width-md, 2px) solid
      var(--nys-color-neutral-50, #ededed);
    border-radius: 0 0 var(--_nys-accordion-radius) var(--_nys-accordion-radius);
  }

  /*** Accordion Group ***/
  .nys-accordiongroup {
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-100, 8px);
  }
`;
