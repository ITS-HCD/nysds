import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Accordion Styles */
    --_nys-accordion-border-radius: var(--nys-radius-md, 4px);
    --_nys-accordion-padding--x: var(--nys-space-250, 20px);
    --_nys-accordion-padding--y: var(--nys-space-200, 16px);
    --_nys-accordion-outline-width: var(--nys-border-width-md, 2px);
    --_nys-accordion-outline-offset: var(--nys-space-2px, 2px);
    --_nys-accordion-outline-color: var(--nys-color-focus, #004dd1);
    --_nys-accordion-gap: var(--nys-space-100, 8px);

    /* Header & Text container */
    --_nys-accordion-background-color: var(--nys-color-neutral-50, #ededed);
    --_nys-accordion-background-color--hover: var(
      --nys-color-neutral-100,
      #d0d0ce
    );
    --_nys-accordionitem-gap: var(--nys-space-200, 16px);
    --_nys-accordionitem-background-color: var(--nys-color-ink-reverse, #fff);
    --_nys-accordionitem-padding: var(--nys-space-200, 16px)
      var(--local-xx-spacing-205, 20px);

    /* Typography */
    --_nys-accordion-font-size: var(--nys-type-size-ui-xl, 20px);
    --_nys-accordion-font-weight: var(--nys-font-weight-bold, 700);
    --_nys-accordion-line-height: var(--nys-font-lineheight-ui-xl, 28px);
    --_nys-accordion-letter-spacing: var(
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

  .nys-accordionitem {
    font-family: var(--_nys-accordion-font-family);
    font-size: var(--_nys-accordion-font-size);
    font-weight: var(--_nys-accordion-font-weight);
    line-height: var(--_nys-accordion-line-height);
    letter-spacing: var(--_nys-accordion-letter-spacing);
    display: flex;
  }

  .nys-accordionitem__heading {
    all: unset;
    flex: 1;
    gap: var(--_nys-accordionitem-gap);
    display: flex;
    padding: var(--_nys-accordion-padding--y) var(--_nys-accordion-padding--x);
    align-items: center;
    align-self: stretch;
    border-radius: var(--_nys-accordion-border-radius);
    background-color: var(--_nys-accordion-background-color);
    cursor: pointer;
    transition: 0.05s all ease-in-out;
  }

  .nys-accordionitem__heading:hover {
    border-radius: var(--_nys-accordion-border-radius);
    background-color: var(--_nys-accordion-background-color--hover);
  }

  .nys-accordionitem__heading:focus-visible {
    outline-offset: var(--_nys-accordion-outline-offset);
    outline: solid var(--_nys-accordion-outline-width)
      var(--_nys-accordion-outline-color);
  }

  .nys-accordionitem__heading .nys-accordionitem__heading-title {
    flex: 1;
  }

  /*** Content layer ***/
  .nys-accordionitem__content {
    height: 0;
    overflow: hidden;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    visibility: hidden;
  }

  .nys-accordionitem__content.expanded {
    /* Accordion JS code takes care of setting the exact calculated height so we can open exact px height */
    visibility: visible;
  }

  .nys-accordionitem__content-slot-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--_nys-accordion-gap);
    align-self: stretch;
    padding: var(--_nys-accordionitem-padding);
    background-color: var(--_nys-accordionitem-background-color);
  }

  .nys-accordionitem__content-slot-container-text {
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
  :host([bordered][expanded]) .nys-accordionitem__heading {
    border-radius: var(--_nys-accordion-border-radius)
      var(--_nys-accordion-border-radius) 0 0;
  }

  :host([bordered]) .nys-accordionitem__content-slot-container {
    border: var(--nys-border-width-md, 2px) solid
      var(--nys-color-neutral-50, #ededed);
    border-radius: 0 0 var(--_nys-accordion-border-radius)
      var(--_nys-accordion-border-radius);
  }

  /*** Accordion Wrapper ***/
  .nys-accordion {
    display: flex;
    flex-direction: column;
    gap: var(--_nys-accordion-gap);
  }
`;
