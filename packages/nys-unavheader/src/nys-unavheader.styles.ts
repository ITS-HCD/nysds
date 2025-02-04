import { css } from "lit";

export default css`
  :host {
    /* Typography */
    font-size: var(--nys-font-size-ui-md, 16px);
    font-weight: var(--nys-font-weight-semibold, 600);
    line-height: var(--nys-font-lineheight-ui-md, 24px);
    font-family: var(
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

  .nys-unavheader {
    background-color: var(--nys-color-ink-reverse, #ffffff);
    display: flex;
    justify-content: space-between;
    height: var(--nys-size-800, 64px);
    align-items: center;
  }

  .nys-unavheader__left,
  .nys-unavheader__right {
    display: flex;
    align-items: center;
    gap: var(--nys-space-300, 24px);
  }

  #nys-unav__translate {
    --_nys-button-color-text: var(--nys-color-theme, #154973);
    --_nys-button-color-text-hover: var(--nys-color-theme, #154973);
    --_nys-button-color-text-active: var(--nys-color-theme, #154973);
  }

  #nys-unav__search {
    width: var(--nys-form-width-md, 200px);
    transition: width 0.5s ease;
  }

  /* Grow size on focus */
  #nys-unav__search:focus {
    width: var(--nys-form-width-lg, 384px);
  }

  .nys-unavheader__know {
    color: var(--nys-color-link, #004dd1);
  }

  .nys-unavheader__translatewrapper {
    position: relative;
  }

  .nys-unavheader__trustbar.hide,
  .nys-unavheader__languagelist.hide {
    display: none;
  }

  .nys-unavheader__trustbar.show {
    background-color: var(--nys-color-neutral-50, #ededed);
    color: var(--nys-color-ink, #1b1b1b);
    display: flex;
    gap: var(--nys-space-400, 32px);
    padding: var(--nys-space-400, 32px);
  }

  .nys-unavheader__trustcontent {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--nys-space-100, 8px);
    line-height: var(--nys-font-lineheight-ui-md, 24px);
  }

  .nys-unavheader__languagelist.show {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    z-index: 99999;
    background-color: var(--nys-color-neutral-50, #ededed);
    color: var(--nys-color-theme, #154973);
    margin-top: var(--nys-space-100, 8px);
  }

  a {
    padding: var(--nys-space-200, 16px) var(--nys-space-300, 24px);
    color: var(--nys-color-theme, #154973);
    text-decoration: none;
  }

  a:hover {
    background-color: var(--nys-color-neutral-100, #d0d0ce);
  }

  a:active {
    background-color: var(--nys-color-neutral-200, #bec0c1);
  }

  /* Breakpoints using Excelsior Grid Guidelines */
  @media (min-width: 768px) {
    /* md */
    .nys-unavheader__content {
      grid-template-columns: repeat(2, 1fr); /* Two columns */
    }
    :host() {
      --_nys-unavheader-gap-spacing: var(--nys-space-400, 32px);
      --_nys-unavheader-gutter: var(--nys-gutter-lg, 32px);
    }
  }

  @media (min-width: 1280px) {
    /* Large Desktop (XL - Above 1280px) */
    :host {
      --_nys-unavheader-gutter: var(--nys-gutter-xl, 64px);
    }
  }
`;
