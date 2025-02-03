import { css } from "lit";

export default css`
  :host {
    /* Global Header Styles */
    --_nys-globalheader-color: var(
      --nys-color-ink-reverse,
      var(--nys-color-white, #ffffff)
    );
    --_nys-globalheader-background: var(
      --nys-color-theme,
      var(--nys-color-state-blue-700, #154973)
    );
    --_nys-globalheader-gap-spacing: var(--nys-space-100, 8px);
    --_nys-globalheader-padding: var(--nys-space-200, 16px);
    --_nys-globalheader-gutter: var(--nys-gutter-sm, 20px);
    --_nys-globalheader-font-family: var(
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
    --_nys-globalheader-lineheight: normal;
    --_nys-globalheader-letterspacing: var(
      --nys-font-letterspacing-h2,
      var(--nys-font-letterspacing-100, 0.013px;)
    );
    --_nys-globalheader-font-weight-bold: var(--nys-font-weight-bold, 700);
    --_nys-globalheader-font-weight-semibold: var(
      --nys-font-weight-semibold,
      600
    );

    /* Agency and App Name Styling */
    --_nys-globalheader-font-size-main-name: var(
      --nys-font-size-agency-xl,
      var(--nys-font-size-2xl, 22px)
    );
    --_nys-globalheader-font-size-sub-name: var(
      --nys-font-size-agency-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-globalheader-font-family-agency: var(
      --nys-font-family-agency,
      "D Sari",
      Arial,
      sans-serif
    );

    /* Menu Content Styling */
    --_nys-globalheader-font-size-links: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-globalheader-link-gap-spacing: var(--nys-space-600, 48px);
    --_nys-globalheader-link-lineheight: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-globalheader-link-letterspacing: var(
      --nys-font-letterspacing-ui-md,
      0.005em
    );
  }

  .nys-globalheader {
    display: flex;
    padding: var(--_nys-globalheader-padding) var(--_nys-globalheader-gutter);
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--_nys-globalheader-background);
    color: var(--_nys-globalheader-color);
    gap: var(--_nys-globalheader-gap-spacing);
    width: 100%;
    box-sizing: border-box;
  }

  /* Left-hand side Agency and App names */
  .nys-globalheader__name-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: var(--_nys-globalheader-gap-spacing);
  }
  .nys-globalheader__name {
    margin: 0;
    color: var(--_nys-globalheader-color);
    font-family: var(--_nys-globalheader-font-family-agency);
    font-size: var(--_nys-globalheader-font-size-main-name);
    font-style: normal;
    font-weight: var(--_nys-globalheader-font-weight-semibold);
    line-height: var(--_nys-globalheader-lineheight);
    letter-spacing: var(--_nys-globalheader-letterspacing);
    text-wrap: wrap;
  }

  .nys-globalheader__agencyName {
    font-size: var(--_nys-globalheader-font-size-sub-name);
  }

  /* Set the font size for the agency to be the main font if appName is not defined */
  .nys-globalheader__agencyName.main {
    font-size: var(--_nys-globalheader-font-size-main-name);
  }

  /* Slotted content */
  .nys-globalheader__content {
    font-family: var(--_nys-globalheader-font-family);
    display: flex;
    flex-wrap: wrap;
    gap: var(--_nys-globalheader-link-gap-spacing);
    width: 100%;
  }

  ::slotted(a) {
    color: var(--_nys-globalheader-color);
    text-decoration: none;
    font-size: var(--_nys-globalheader-font-size-links);
    font-style: normal;
    font-weight: var(--_nys-globalheader-font-weight-semibold);
    line-height: var(--_nys-globalheader-link-lineheight);
    letter-spacing: var(--_nys-globalheader-link-letterspacing);
  }

  /* Breakpoints using Excelsior Grid Guidelines */
  @media (min-width: 768px) {
    /* Tablet (MD - Above 768px) */
    .nys-globalheader__content {
      grid-template-columns: repeat(2, 1fr); /* Two columns */
    }
    :host() {
      --_nys-globalheader-gap-spacing: var(--nys-space-400, 32px);
      --_nys-globalheader-gutter: var(--nys-gutter-lg, 32px);
    }
  }

  @media (min-width: 1280px) {
    /* Large Desktop (XL - Above 1280px) */
    :host {
      --_nys-globalheader-gutter: var(--nys-gutter-xl, 64px);
    }
  }
`;
