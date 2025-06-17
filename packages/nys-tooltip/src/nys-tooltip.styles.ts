import { css } from "lit";

export default css`
  :host {
    /* Global Tooltip Styles */
  }

  .nys-tooltip__wrapper {
    position: relative;
    width: fit-content;
  }

  .nys-tooltip__content {
    position: absolute;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 8px;
    max-width: 400px;
    width: fit-content;
    text-wrap: nowrap;
    text-align: center;
    max-height: 120px;
    padding: var(--nys-space-50, 4px) var(--nys-space-100, 8px);
    flex-wrap: wrap;
    color: var(--nys-color-text-reverse, #ffffff);
    border-radius: var(--nys-radius-md, 4px);
    border: var(--nys-border-width-sm, 1px) solid var(--nys-color-ink, #1b1b1b);
    background: var(--nys-color-ink, #1b1b1b);
    font-family: var(--nys-type-family-ui, "Proxima Nova");
    font-size: var(--nys-type-size-ui-sm, 14px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--nys-font-lineheight-ui-sm, 24px);
    letter-spacing: var(--nys-font-letterspacing-ui-sm, 0.044px);
    left: 50%;
    transform: translateX(-50%);
  }

  /* Tooltip Arrow (default) */
  .nys-tooltip__content::after {
    content: "";
    position: absolute;
    bottom: -8.3px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 6px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="6" viewBox="0 0 15 6" fill="none"><path d="M8.15079 5.44218C7.7763 5.76317 7.2237 5.76317 6.84921 5.44218L0.5 0H14.5L8.15079 5.44218Z" fill="%231B1B1B"/></svg>')
      no-repeat center;
  }

  .nys-tooltip__wrapper:hover .nys-tooltip__content {
    opacity: 1;
  }

  /* ===================== POSITIONING ===================== */
  /* Top */
  :host([position="top"]) .nys-tooltip__content {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 10px;
  }

  :host([position="top"]) .nys-tooltip__content::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  /* Bottom */
  :host([position="bottom"]) .nys-tooltip__content {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 10px;
  }

  :host([position="bottom"]) .nys-tooltip__content::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
  }

  /* Left */
  :host([position="left"]) .nys-tooltip__content {
    left: -100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 10px;
  }

  :host([position="left"]) .nys-tooltip__content::after {
    left: 96%;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
  }

  /* Right */
  :host([position="right"]) .nys-tooltip__content {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 10px;
  }

  :host([position="right"]) .nys-tooltip__content::after {
    padding-bottom: var(--nys-space-2-px, 2px);
    left: -11px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }

  :host([inverted]) .nys-tooltip__content {
    color: var(--nys-color-text, #1B1B1B);
    background: var(--nys-color-ink-reverse, #FFF);
  }
`;
