import { css } from "lit";

export default css`
  :host {
    /* Global Header Styles */
    --_nys-unavheader-color: var(
      --nys-color-ink-reverse,
      var(--nys-color-white, #ffffff)
    );
    --_nys-unavheader-background: var(
      --nys-color-theme,
      var(--nys-color-state-blue-700, #154973)
    );
    --_nys-unavheader-gap-spacing: var(--nys-space-100, 8px);
    --_nys-unavheader-padding: var(--nys-space-200, 16px);
    --_nys-unavheader-gutter: var(--nys-gutter-sm, 20px);
    --_nys-gutter: var(--nys-gutter-md, 32px);
    --_nys-unavheader-font-family: var(
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
    --_nys-unavheader-lineheight: normal;
    --_nys-unavheader-letterspacing: var(
      --nys-font-letterspacing-h2,
      var(--nys-font-letterspacing-100, 0.013px;)
    );
    --_nys-unavheader-font-weight-bold: var(--nys-font-weight-bold, 700);
    --_nys-unavheader-font-weight-semibold: var(
      --nys-font-weight-semibold,
      600
    );

    /* Agency and App Name Styling */
    --_nys-unavheader-font-size-main-name: var(
      --nys-font-size-agency-xl,
      var(--nys-font-size-2xl, 22px)
    );
    --_nys-unavheader-font-size-sub-name: var(
      --nys-font-size-agency-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-unavheader-font-family-agency: var(
      --nys-font-family-agency,
      "D Sari",
      Arial,
      sans-serif
    );

    /* Menu Content Styling */
    --_nys-unavheader-font-size-links: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-unavheader-link-gap-spacing: var(--nys-space-600, 48px);
  }

  .nys-unavheader {
    display: flex;
    padding: var(--_nys-unavheader-padding) var(--_nys-unavheader-gutter);
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--_nys-unavheader-background);
    color: var(--_nys-unavheader-color);
    gap: var(--_nys-unavheader-gap-spacing);
    width: 100%;
    box-sizing: border-box;
  }

  /* Left-hand side Agency and App names */
  .nys-unavheader__name-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: var(--_nys-unavheader-gap-spacing);
  }
  .nys-unavheader__name {
    margin: 0;
    color: var(--_nys-unavheader-color);
    font-family: var(--_nys-unavheader-font-family-agency);
    font-size: var(--_nys-unavheader-font-size-main-name);
    font-style: normal;
    font-weight: var(--_nys-unavheader-font-weight-semibold);
    line-height: var(--_nys-unavheader-lineheight);
    letter-spacing: var(--_nys-unavheader-letterspacing);
    text-wrap: wrap;
  }

  .nys-unavheader__agencyName {
    font-size: var(--_nys-unavheader-font-size-sub-name);
  }

  /* Set the font size for the agency to be the main font if appName is not defined */
  .nys-unavheader__agencyName.main {
    font-size: var(--_nys-unavheader-font-size-main-name);
  }

  /* Slotted content */
  .nys-unavheader__content {
    font-family: var(--_nys-unavheader-font-family);
    display: flex;
    flex-wrap: wrap;
    gap: var(--_nys-unavheader-link-gap-spacing);
    width: 100%;
  }

  ::slotted(a) {
    color: var(--_nys-unavheader-color);
    text-decoration: none;
    font-size: var(--_nys-unavheader-font-size-links);
    font-style: normal;
    font-weight: var(--_nys-unavheader-font-weight-semibold);
    line-height: var(--nys-font-lineheight-ui-md, 24px); /* 150% */
    letter-spacing: var(--nys-font-letterspacing-ui-md, 0.005em);
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
