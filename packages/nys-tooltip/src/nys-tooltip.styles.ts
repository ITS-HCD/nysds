import { css } from "lit";

export default css`
  :host {
    /* Global Tooltip Styles */
    --_nys-tooltip-color: var(--nys-color-text-reverse, #ffffff);
    --_nys-tooltip-background: var(--nys-color-ink, #1b1b1b);
    --_nys-tooltip-border-radius: var(--nys-radius-md, 4px);
    --_nys-tooltip-font-family: var(--nys-type-family-ui, "Proxima Nova");
    --_nys-tooltip-font-size: var(--nys-type-size-ui-sm, 14px);
    --_nys-tooltip-letterspacing: var(--nys-font-letterspacing-ui-sm, 0.044px);
    --_nys-tooltip-lineheight: var(--nys-font-lineheight-ui-sm, 24px);
  }

  .nys-tooltip__wrapper {
    position: relative;
    width: fit-content;
    display: flex;
    cursor: pointer;
  }

  .nys-tooltip__content {
    position: absolute;
    opacity: 0;
    display: block;
    max-width: 400px;
    width: max-content;
    max-height: 120px;
    padding: var(--nys-space-50, 4px) var(--nys-space-100, 8px);
    background: var(--_nys-tooltip-background);
    border-radius: var(--_nys-tooltip-border-radius);
    left: 50%;
    transform: translateX(-50%);
    cursor: auto;
    z-index: 1;
  }

  .nys-tooltip__inner {
    display: block;
    color: var(--_nys-tooltip-color);
    font-family: var(--_nys-tooltip-font-family);
    font-size: var(--_nys-tooltip-font-size);
    font-weight: 400;
    line-height: var(--_nys-tooltip-lineheight);
    letter-spacing: var(--_nys-tooltip-letterspacing);
    white-space: normal;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
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

  .nys-tooltip__wrapper:hover .nys-tooltip__content,
  .nys-tooltip__wrapper:focus-within .nys-tooltip__content {
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
    padding-bottom: var(--nys-space-2px, 2px);
    left: -10px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }

  :host([inverted]) .nys-tooltip__content {
    --_nys-tooltip-color: var(--nys-color-text, #1b1b1b);
    --_nys-tooltip-background: var(--nys-color-ink-reverse, #fff);
  }

  :host([inverted]) .nys-tooltip__content::after {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="6" viewBox="0 0 15 6" fill="none"><path d="M8.15079 5.44218C7.7763 5.76317 7.2237 5.76317 6.84921 5.44218L0.5 0H14.5L8.15079 5.44218Z" fill=""white""/></svg>')
      no-repeat center;
  }

  @media (max-width: 400px) {
    .nys-tooltip__content {
      max-width: 100vw;
    }
  }
`;
