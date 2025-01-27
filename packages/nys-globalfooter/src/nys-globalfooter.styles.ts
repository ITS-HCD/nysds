import { css } from "lit";

export default css`
  :host {
    /* Global Footer Styles */
    --_nys-globalfooter-color: var(
      --nys-color-ink,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-globalfooter-background: var(
      --nys-color-theme-weaker,
      var(--nys-color-state-blue-50, #eff6fb)
    );
    --_nys-globalfooter-gap-spacing: var(--nys-space-300, 24px);
    --_nys-globalfooter-padding: var(--nys-space-400, 32px);
    --_nys-globalfooter-gutter: var(--nys-gutter-sm, 20px);
    --_nys-globalfooter-font-size: var(
      --nys-font-size-agency-xl,
      var(--nys-font-size-2xl, 22px)
    );
    --_nys-globalfooter-font-size-links: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-globalfooter-lineheight: normal;
    --_nys-globalfooter-letterspacing: var(
      --nys-font-letterspacing-h2,
      var(--nys-font-letterspacing-100, 0.013px;)
    );
    --_nys-globalfooter-font-weight-semibold: var(
      --nys-font-weight-semibold,
      600
    );

    /* Agency Name */
    --_nys-globalfooter-font-family-agency: var(
      --nys-font-family-agency,
      "D Sari",
      Arial,
      sans-serif
    );

    /* Links */
    --_nys-globalfooter-link-gap-spacing-row: var(--nys-space-400, 32px);
    --_nys-globalfooter-link-gap-spacing-column: var(--nys-space-600, 48px);
    --_nys-globalfooter-lineheight-links: var(
      --nys-font-lineheight-ui-md,
      24px
    );
    --_nys-globalfooter-letterspacing: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
    --_nys-globalfooter-font-family: var(
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
    --foo-color: red;
  }

  .nys-globalfooter {
    display: flex;
    padding: var(--_nys-globalfooter-padding) var(--_nys-globalfooter-gutter);
    gap: var(--_nys-globalfooter-gap-spacing);
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--_nys-globalfooter-background);
    color: var(--_nys-globalfooter-color);
    width: 100%;
    box-sizing: border-box;
  }

  .nys-globalfooter__name {
    margin: 0;
    color: var(--_nys-globalfooter-color);
    font-family: var(--_nys-globalfooter-font-family-agency);
    font-size: var(--_nys-globalfooter-font-size);
    font-style: normal;
    font-weight: var(--_nys-globalfooter-font-weight-semibold);
    line-height: var(--_nys-globalfooter-lineheight);
    letter-spacing: var(--_nys-globalfooter-letterspacing);
    text-wrap: wrap;
  }

  /* Slotted content (menu links) */
  ::slotted(ul) {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  ::slotted(ul) li {
    margin: 0;
    padding: 0;
    text-transform: uppercase;
  }

  a {
    text-decoration: none;
  }
  
  ::slotted(a) {
    color: var(--_nys-globalfooter-color);
    text-decoration: none;
    font-family: var(--_nys-globalfooter-font-family);
    font-size: var(--_nys-globalfooter-font-size-links);
    font-style: normal;
    font-weight: var(--_nys-globalfooter-font-weight-semibold);
    line-height: var(--_nys-globalfooter-lineheight-links);
    letter-spacing: var(--nys-font-letterspacing-ui-md, 0.005em);
  }

  .nys-globalfooter__content {
    display: flex;
    flex-wrap: wrap;
    gap: var(--_nys-globalfooter-link-gap-spacing-row)
      var(--_nys-globalfooter-link-gap-spacing-column);
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
    grid-template-columns: repeat(1, 1fr); /* One columns */
  }

  /* Breakpoints using Excelsior Grid Guidelines (Menu Links) */
  @media (min-width: 768px) {
    /* Tablet (MD - Above 768px) */
    .nys-globalfooter__content {
      grid-template-columns: repeat(2, 1fr); /* Two columns */
    }
    :host {
      --_nys-globalfooter-gutter: var(--nys-gutter-lg, 32px);
    }
  }

  @media (min-width: 1024px) {
    /* Large Desktop (LG - Above 1024px) */
    .nys-globalfooter__content {
      gap: var(--_nys-globalfooter-link-gap-spacing-column);
    }
  }

  @media (min-width: 1280px) {
    /* Large Desktop (XL - Above 1280px) */
    .nys-globalfooter__content {
      display: flex;
      flex-wrap: wrap;
    }
    :host {
      --_nys-globalfooter-gutter: var(--nys-gutter-xl, 64px);
    }
  }
`;
