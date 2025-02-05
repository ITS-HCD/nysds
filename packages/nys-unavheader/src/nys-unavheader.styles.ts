import { css } from "lit";

export default css`
  :host {
    --_nys-unavheader-gutter: var(--nys-gutter-xs, 20px);

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
    padding: var(--nys-space-100, 8px) var(--_nys-unavheader-gutter);
    max-width: 1280px;
    margin: auto;
  }

  .nys-unavheader__toptrustbar {
    display: flex;
    justify-content: space-between;
    background-color: var(--nys-color-neutral-100, #d0d0ce);
    padding: var(--nys-space-100, 8px) var(--_nys-unavheader-gutter);
  }

  .nys-unavheader__left,
  .nys-unavheader__right {
    display: flex;
    align-items: center;
    gap: var(--nys-space-300, 24px);
  }

  #nys-unavheader__translate,
  #nys-unavheader__searchbutton {
    --_nys-button-color-text: var(--nys-color-theme, #154973);
    --_nys-button-color-text-hover: var(--nys-color-theme, #154973);
    --_nys-button-color-text-active: var(--nys-color-theme, #154973);
  }

  .nys-unavheader__iconbutton {
    --_nys-button-width: var(--nys-size-400, 32px);
    --_nys-button-height: var(--nys-size-400, 32px);
    --_nys-button-padding-y: 0;
    --_nys-button-padding-x: 0;
  }

  #nys-unavheader__search {
    width: var(--nys-form-width-md, 200px);
    transition: width 0.5s ease;
  }

  /* Grow size on focus */
  #nys-unavheader__search:focus {
    width: var(--nys-form-width-lg, 384px);
  }

  #nys-unavheader__knowbutton {
    /* typography */
    --_nys-button-font-size: var(--nys-font-size-ui-xs, 12px);
    --_nys-button-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-button-line-height: var(--nys-font-lineheight-ui-xs, 20px);
    --_nys-button-font-family: var(
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

  #nys-unavheader__official {
    width: max-content;
  }

  .nys-unavheader__know {
    width: max-content;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: var(--nys-space-50, 4px);
    color: var(--nys-color-link, #004dd1);
  }

  .nys-unavheader__know:hover {
    color: var(--nys-color-link-strong, #003ba1);
  }

  .nys-unavheader__know:active {
    color: var(--nys-color-link-strongest, #002971);
  }

  .nys-unavheader__translatewrapper {
    position: relative;
  }

  .nys-unavheader__trustbar.hide,
  .nys-unavheader__languagelist.hide,
  .nys-unavheader__searchdropdown.hide {
    display: none;
  }

  .nys-unavheader__searchdropdown.show {
    background-color: var(--nys-color-neutral-50, #ededed);
    padding: var(--nys-space-250, 20px) var(--_nys-unavheader-gutter);
  }

  .nys-unavheader__trustbar.show {
    background-color: var(--nys-color-neutral-50, #ededed);
    color: var(--nys-color-ink, #1b1b1b);
    display: flex;
    padding: var(--nys-space-400, 32px) var(--_nys-unavheader-gutter);
    max-width: 1280px;
    margin: auto;
  }

  .nys-unavheader__trustcontent {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--nys-space-400, 24px);
  }

  .nys-unavheader__trustcontentmessage {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--nys-space-100, 8px);
    line-height: var(--nys-font-lineheight-ui-md, 32px);
  }

  .nys-unavheader__languagelist.show {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-width: 100%;
    width: max-content;
    z-index: 99999;
    background-color: var(--nys-color-neutral-50, #ededed);
    color: var(--nys-color-theme, #154973);
    margin-top: var(--nys-space-150, 12px);
  }

  :host([isMediumScreen]) .nys-unavheader__languagelist.show {
    right: 0;
  }

  a {
    padding: var(--nys-space-200, 16px) var(--nys-space-250, 20px);
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
  @media (min-width: 0) {
    /* Mobile (XS) */
    :host() {
      --_nys-unavheader-gutter: var(--nys-gutter-xs, 20px);
    }
    .nys-unavheader__officialmessage {
      display: flex;
      flex-direction: column;
      /* Typography */
      font-size: var(--nys-font-size-ui-xs, 12px);
      font-weight: var(--nys-font-weight-regular, 400);
      line-height: var(--nys-font-lineheight-ui-xs, 20px);
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
  }

  @media (min-width: 480px) {
    /* Mobile Large (SM - Above 480px) */
    :host() {
      --_nys-unavheader-gutter: var(--nys-gutter-sm, 20px);
    }
    .nys-unavheader__officialmessage {
      flex-direction: row;
      align-items: center;
      gap: var(--nys-space-100, 8px);
    }
  }

  @media (min-width: 768px) {
    /* Tablet (MD - Above 768px) */
    :host() {
      --_nys-unavheader-gutter: var(--nys-gutter-md, 32px);
    }
    .nys-unavheader__trustcontent {
      flex-direction: row;
    }
  }

  @media (min-width: 1024px) {
    /* Desktop (LG - Above 1024px) */
    :host() {
      --_nys-unavheader-gutter: var(--nys-gutter-lg, 32px);
    }
    .nys-unavheader__languagelist.show {
      margin-top: var(--nys-space-100, 8px);
    }
  }

  @media (min-width: 1280px) {
    /* Desktop Large (XL - Above 1280px) */
    :host {
      --_nys-unavheader-gutter: var(--nys-gutter-xl, 64px);
    }
  }
`;
