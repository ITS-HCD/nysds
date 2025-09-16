import { css } from "lit";

export default css`
  :host {
    /* Global Unav Header Styles */
    --_nys-unavheader-padding--gutter: var(--nys-gutter-xs, 20px);
    --_nys-unavheader-background-color: var(
      --nys-color-surface,
      var(--nys-color-white, #ffffff)
    );
    --_nys-unavheader-color: var(
      --nys-color-text,
      var(--nys-color-neutral-900, #1b1b1b)
    );

    /* Trustbar, Search Bar, and Language */
    --_nys-unavheader-background-color--section-raised: var(
      --nys-color-surface-raised,
      var(--nys-color-neutral-10, #f6f6f6)
    );

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
    display: flex;
    flex-direction: column;
  }

  .nys-unavheader > * {
    padding: 0 var(--_nys-unavheader-padding--gutter);
  }

  .nys-unavheader__main.wrapper {
    background-color: var(--_nys-unavheader-background-color);
  }

  .nys-unavheader__main.content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--nys-space-300, 24px);
    padding-top: var(--nys-space-100, 8px);
    padding-bottom: var(--nys-space-100, 8px);
  }

  .nys-unavheader__spacer {
    flex: 1;
    border: solid tomato;
  }

  .nys-unavheader__officialmessage.wrapper {
    background-color: var(--nys-color-neutral-100, #d0d0ce);
    padding-top: var(--nys-space-100, 8px);
    padding-bottom: var(--nys-space-100, 8px);
  }
  .nys-unavheader__officialmessage > .content,
  .nys-unavheader__officialmessage > .content,
  * {
    cursor: pointer;
  }
  .nys-unavheader__officialmessage.inline,
  .nys-unavheader__officialmessage.inline #nys-unavheader__official {
    background-color: transparent;
    cursor: default;
  }

  /*
  .content -> small screens
  inline -> large screens
  */
  .nys-unavheader__officialmessage > .content,
  .nys-unavheader__officialmessage.inline {
    display: flex;
    align-items: center;
    gap: var(--nys-space-100, 8px);
    height: fit-content;
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

  a#nys-unavheader__logolink {
    outline-offset: var(--nys-space-2px, 2px);
  }

  .nys-unavheader__logo svg {
    vertical-align: top;
    height: var(--nys-size-500, 40px);
    width: auto;
  }

  #nys-unavheader__know {
    width: max-content;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: var(--nys-space-50, 4px);
    /* These props ARE NOT publicly overridable */
    --_nys-button-height: var(--nys-font-lineheight-ui-xs, 20px);
    --_nys-button-border-radius--left: var(--nys-radius-md, 4px);
    --_nys-button-border-radius--right: var(--nys-radius-md, 4px);
    --_nys-button-padding--y: var(--nys-space-2px, 2px);
    --_nys-button-padding--x: var(--nys-space-50, 4px);
    --_nys-button-border-width: 0px;
    --_nys-button-text-decoration: underline;
    /* These props ARE publicly overridable */
    --nys-button-color: var(--nys-color-link, #004dd1);
    --nys-button-color--hover: var(--nys-color-link-strong, #003ba1);
    --nys-button-color--active: var(--nys-color-link-strongest, #002971);
    --nys-button-background-color--hover: var(
      --nys-color-transparent,
      #ffffff00
    );
    --nys-button-background-color--active: var(
      --nys-color-transparent,
      #ffffff00
    );

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

  .hide {
    display: none;
  }

  .nys-unavheader__trustbar.wrapper.show {
    background-color: var(--_nys-unavheader-background-color--section-raised);
    display: flex;
    padding-top: var(--nys-space-400, 32px);
    padding-bottom: var(--nys-space-400, 32px);
  }
  .nys-unavheader__messagewrapper {
    display: flex;
    gap: var(--nys-space-400, 32px);
  }

  .nys-unavheader__trustbar.content {
    display: flex;
  }

  .nys-unavheader__trustcontentmessage {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-100, 8px);

    /* UI/Small/Bold */
    font-family: var(--nys-type-family-ui, "Proxima Nova");
    font-size: var(--nys-type-size-ui-sm, 14px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--nys-typography-font-lineheight-ui-sm, 24px);
    letter-spacing: var(--nys-typography-font-letterspacing-ui-sm, 0.044px);
  }
  .nys-unavheader__searchdropdown.wrapper {
    background-color: var(--_nys-unavheader-background-color--section-raised);
    padding-top: var(--nys-space-250, 20px);
    padding-bottom: var(--nys-space-250, 20px);
  }

  .nys-unavheader__trustbar.wrapper > .content,
  .nys-unavheader__main.wrapper > .content,
  .nys-unavheader__officialmessage > .content,
  .nys-unavheader__searchdropdown.wrapper > .content {
    max-width: 1280px;
    margin: 0 auto;
  }

  .nys-unavheader__search {
    width: var(--nys-form-width-md, 200px);
    transition: width 0.5s ease;
    --_nys-textinput-gap: 0px;
  }

  /* Grow size on focus */
  .nys-unavheader__search:focus {
    width: var(--nys-form-width-lg, 384px);
    transition: width 0.5s ease;
  }

  #nys-unavheader__translate,
  #nys-unavheader__searchbutton {
    /* These props ARE publicly overridable */
    --nys-button-color: var(--nys-color-state-blue-700, #154973);
    --nys-button-color--hover: var(--nys-color-state-blue-700, #154973);
    --nys-button-color--active: var(--nys-color-state-blue-700, #154973);
    --_nys-button-border-width: 0px;
  }

  .nys-unavheader__iconbutton {
    /* These props ARE NOT publicly overridable */
    --_nys-button-width: var(--nys-size-400, 32px);
    --_nys-button-height: var(--nys-size-400, 32px);
    --_nys-button-padding--y: 0;
    --_nys-button-padding--x: 0;
  }

  .nys-unavheader__translatewrapper {
    position: relative;
  }

  .nys-unavheader__languagelist.show {
    position: absolute;
    display: flex;
    flex-direction: column;
    min-width: fit-content;
    width: max-content;
    z-index: 99999;
    background-color: var(--_nys-unavheader-background-color--section-raised);
    color: var(--nys-color-state-blue-700, #154973);
    margin-top: var(--nys-space-150, 12px);
    right: 0;
  }

  a.nys-unavheader__languagelink {
    padding: var(--nys-space-200, 16px) var(--nys-space-250, 20px);
    color: var(--nys-color-state-blue-700, #154973);
    text-decoration: none;
  }

  a.nys-unavheader__languagelink:hover {
    background-color: var(--nys-color-neutral-100, #d0d0ce);
  }

  a.nys-unavheader__languagelink:active {
    background-color: var(--nys-color-neutral-200, #bec0c1);
  }

  /* Breakpoints using NYSDS Grid Guidelines */
  @media (min-width: 0) and (max-width: 479px) {
    /* Mobile (XS) */
    :host {
      --_nys-unavheader-padding--gutter: var(--nys-gutter-xs, 20px);
    }

    #nys-unavheader__know {
      --_nys-button-padding--x: 0px;
    }

    .nys-unavheader__officialmessage > .content {
      flex-direction: column;
      align-items: flex-start;
      gap: 0px;
    }

    .nys-unavheader__officialmessage.inline {
      display: none;
    }

    .nys-unavheader__messagewrapper {
      flex-direction: column;
    }

    #nys-unavheader__translate:not([circle]),
    #nys-unavheader__searchbar {
      display: none;
    }
  }

  @media (min-width: 480px) and (max-width: 767px) {
    /* Mobile Large (SM - Above 480px) */
    :host {
      --_nys-unavheader-padding--gutter: var(--nys-gutter-sm, 20px);
    }

    .nys-unavheader__officialmessage.inline {
      display: none;
    }

    #nys-unavheader__translate:not([circle]),
    #nys-unavheader__searchbar {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    /* Tablet (MD - Above 768px) */
    :host {
      --_nys-unavheader-padding--gutter: var(--nys-gutter-md, 32px);
    }

    .nys-unavheader__officialmessage.wrapper {
      display: none;
    }

    #nys-unavheader__translate:not([circle]),
    #nys-unavheader__searchbar {
      display: none;
    }

    .nys-unavheader__trustbar.wrapper.show {
      order: 2;
    }
  }

  @media (min-width: 1024px) and (max-width: 1279px) {
    /* Desktop (LG - Above 1024px) */
    :host {
      --_nys-unavheader-padding--gutter: var(--nys-gutter-lg, 32px);
    }
    .nys-unavheader__officialmessage.wrapper {
      display: none;
    }

    #nys-unavheader__translate[circle],
    #nys-unavheader__searchbutton[circle] {
      display: none;
    }

    .nys-unavheader__languagelist.show {
      margin-top: var(--nys-space-100, 8px);
    }

    .nys-unavheader__trustbar.wrapper.show {
      order: 2;
    }
  }

  @media (min-width: 1280px) {
    /* Desktop Large (XL - Above 1280px) */
    :host {
      --_nys-unavheader-padding--gutter: var(--nys-gutter-xl, 64px);
    }
    .nys-unavheader__officialmessage.wrapper {
      display: none;
    }

    #nys-unavheader__translate[circle],
    #nys-unavheader__searchbutton[circle] {
      display: none;
    }

    .nys-unavheader__languagelist.show {
      margin-top: var(--nys-space-100, 8px);
    }

    .nys-unavheader__trustbar.wrapper.show {
      order: 2;
    }
  }
`;
