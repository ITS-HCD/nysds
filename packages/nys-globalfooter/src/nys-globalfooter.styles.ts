import { css } from "lit";

export default css`
  :host {
    /* Global Footer Styles */
    --_nys-globalfooter-color: var(
      --nys-color-text,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-globalfooter-background-color: var(
      --nys-color-theme-weaker,
      var(--nys-color-state-blue-50, #eff6fb)
    );
    --_nys-globalfooter-gap: var(--nys-space-300, 24px);
    --_nys-globalfooter-padding--y: var(--nys-space-400, 32px);
    --_nys-globalfooter-padding--gutter: var(--nys-gutter-sm, 20px);
    --_nys-globalfooter-font-size--agency: var(
      --nys-font-size-agency-xl,
      var(--nys-font-size-2xl, 22px)
    );
    --_nys-globalfooter-font-size--link: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-globalfooter-line-height--agency: normal;
    --_nys-globalfooter-font-weight--regular: var(
      --nys-font-weight-regular,
      400
    );
    --_nys-globalfooter-font-weight--semibold: var(
      --nys-font-weight-semibold,
      600
    );
    --_nys-globalfooter-max-width: var(--nys-max-content-width, 1280px);

    /* Agency Name */
    --_nys-globalfooter-font-family--agency: var(
      --nys-font-family-agency,
      "D Sari",
      Arial,
      sans-serif
    );

    /* Links */
    --_nys-globalfooter-column-gap: var(--nys-space-400, 32px);
    --_nys-globalfooter-row-gap: var(--nys-space-400, 32px);
    --_nys-globalfooter-line-height--link: var(
      --nys-font-lineheight-ui-md,
      24px
    );
    --_nys-globalfooter-letter-spacing: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
    --_nys-globalfooter-font-family--link: var(
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
    --_nys-globalfooter-text-decoration-thickness: var(--nys-size-2px, 2px);

    /* Divider */
    --_nys-globalfooter-background--divider: var(--nys-color-theme, #154973);
    --_nys-globalfooter-margin--divider: var(--nys-space-50, 4px);
  }

  .nys-globalfooter {
    display: flex;
    padding: var(--_nys-globalfooter-padding--y)
      var(--_nys-globalfooter-padding--gutter);
    justify-content: center;
    background-color: var(--_nys-globalfooter-background-color);
    color: var(--_nys-globalfooter-color);
    width: 100%;
    box-sizing: border-box;
  }

  /** Main Container **/
  .nys-globalfooter__main-container {
    display: flex;
    flex-direction: column;
    gap: var(--_nys-globalfooter-gap);
    width: 100%;
    max-width: var(--_nys-globalfooter-max-width);
  }

  /* The Agency Name */
  .nys-globalfooter__name {
    text-align: left;
    margin: 0;
    color: var(--_nys-globalfooter-color);
    font-family: var(--_nys-globalfooter-font-family--agency);
    font-size: var(--_nys-globalfooter-font-size--agency);
    font-style: normal;
    font-weight: var(--_nys-globalfooter-font-weight--semibold);
    line-height: var(--_nys-globalfooter-line-height--agency);
    letter-spacing: normal;
  }

  /** Slotted content resets (menu links - cloned into shadowDOM from lightDOM) **/
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }

  a,
  span {
    color: var(--_nys-globalfooter-color);
    text-decoration: none;
    font-family: var(--_nys-globalfooter-font-family--link);
    font-size: var(--_nys-globalfooter-font-size--link);
    font-style: normal;
    font-weight: var(--_nys-globalfooter-font-weight--semibold);
    line-height: var(--_nys-globalfooter-line-height--link);
    letter-spacing: var(--_nys-globalfooter-letter-spacing);
  }

  ul li > span + ul li a {
    font-weight: var(--_nys-globalfooter-font-weight--regular);
  }

  a:hover {
    text-decoration: underline;
  }
  a:active {
    text-decoration-thickness: var(
      --_nys-globalfooter-text-decoration-thickness
    );
  }

  /** Specific layout for menu links (grouped or singular list of menus) **/
  .nys-globalfooter__content {
    width: 100%;
  }

  .nys-globalfooter__content ul {
    display: flex;
    flex-direction: column;
    gap: var(--_nys-globalfooter-row-gap) var(--_nys-globalfooter-column-gap);
    flex-wrap: wrap;
  }

  /** Column Menus **/
  .nys-globalfooter__content ul li:has(span ~ ul) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .nys-globalfooter__content ul:has(li > span ~ ul) {
    --_nys-globalfooter-column-gap: var(--nys-space-500, 40px);
  }

  .nys-globalfooter__content ul li > span ~ ul {
    display: flex;
    flex-direction: column;
    gap: var(--nys-space-200, 16px);
  }

  .divider {
    margin-top: var(--_nys-globalfooter-margin--divider);
    margin-bottom: var(--nys-space-300, 24px);
  }

  /* Breakpoints using NYSDS Guidelines (Menu Links) */
  @media (min-width: 768px) {
    /* Tablet (MD - Above 768px) */
    .nys-globalfooter__content ul {
      flex-direction: row;
    }
    .nys-globalfooter__content ul li:has(span ~ ul) {
      flex: 1 0 205px;
    }
    :host {
      --_nys-globalfooter-padding--gutter: var(--nys-gutter-lg, 32px);
      --_nys-globalfooter-row-gap: var(--nys-space-600, 48px);
    }
  }

  @media (min-width: 1280px) {
    /* Large Desktop (XL - Above 1280px) */
    :host {
      --_nys-globalfooter-padding--gutter: var(--nys-gutter-xl, 64px);
    }
  }
`;
