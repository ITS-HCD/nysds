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
    --_nys-globalfooter-gap-spacing: var(--nys-space-600, 48px);
    --_nys-globalfooter-padding: var(--nys-space-400, 32px);
    --_nys-globalfooter-font-size: var(--nys-font-size-agency-xl, var(--nys-font-size-2xl, 22px));
    --_nys-globalfooter-font-size-links: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-globalfooter-lineheight: normal;
    --_nys-globalfooter-letterspacing: var(
      --nys-font-letterspacing-h2,
      var(--nys-font-letterspacing-100, 0.013px;)
    );
    --_nys-globalfooter-font-weight-bold: var(--nys-font-weight-bold, 700);
    --_nys-globalfooter-font-weight-semibold: var(
      --nys-font-weight-semibold,
      600
    );

    /* Agency Name */
    --_nys-globalfooter-font-family-agency: var(
      --nys-font-family-agency,
      "D Sari", Arial, sans-serif
    );

    /* Links */
    --_nys-globalfooter-lineheight-links: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-globalfooter-letterspacing: var(--nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, 0.044px));
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

    box-sizing: border-box;
  }

  .nys-globalfooter {
    display: flex;
    padding: var(--_nys-globalfooter-padding);
    gap: 24px;
    flex-direction: column;
    align-items: flex-start;
    background-color: var(--_nys-globalfooter-background);
    color: var(--_nys-globalfooter-color);
  }

  .nys-globalfooter__name {
    margin: 0;
    color: var(--_nys-globalfooter-color);
    font-family: var(--_nys-globalfooter-font-family-agency);
    font-size: var(--_nys-globalfooter-font-size);
    font-style: normal;
    font-weight: var(--_nys-globalfooter-font-weight-bold);
    line-height: var(--_nys-globalfooter-lineheight);
    letter-spacing: var(--_nys-globalfooter-letterspacing);
    text-wrap: wrap;
  }

  /* Slotted content */
  .nys-globalfooter__content {
    display: flex;
    flex-wrap: wrap;
    gap: var(--_nys-globalfooter-gap-spacing);
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
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

  /* Breakpoints using Excelsior Grid Guidelines */
  @media (min-width: 480px) {
    /* sm + xs */
    .nys-globalfooter__content {
      grid-template-columns: repeat(1, 1fr); /* One columns */
    }
  }

  @media (min-width: 768px) {
    /* md */
    .nys-globalfooter__content {
      grid-template-columns: repeat(2, 1fr); /* Two columns */
    }
    :host() {
      --_nys-globalfooter-gap-spacing: var(--nys-space-400, 32px);
    }
  }

  @media (min-width: 1024px) {
    /* lg + xl */
    .nys-globalfooter__content {
      grid-template-columns: repeat(
        auto-fill,
        minmax(100px, 1fr)
      ); /* Auto-fill columns */
    }
  }
`;
