import { css } from "lit";

export default css`
  :host {
    /* Global Footer Styles */
    --_nys-unavfooter-color: var(
      --nys-color-ink-reverse,
      var(--nys-color-white, #ffffff)
    );
    --_nys-unavfooter-background: var(
      --nys-color-ink,
      var(--nys-color-neutral-900, #1b1b1b)
    );
    --_nys-unavfooter-gap-spacing: var(--nys-space-200, 16px);
    --_nys-unavfooter-padding: var(--nys-space-250, 20px);
    --_nys-unavfooter-gutter: var(--nys-gutter-sm, 20px);
    --_nys-unavfooter-font-size: var(
      --nys-font-size-agency-xl,
      var(--nys-font-size-2xl, 22px)
    );
    --_nys-unavfooter-font-size-links: var(
      --nys-font-size-body-md,
      var(--nys-font-size-md, 16px)
    );
    --_nys-unavfooter-font-weight-semibold: var(
      --nys-font-weight-semibold,
      600
    );

    /* Separator */
    --_nys-unavfooter-separator-color: var(--nys-color-neutral-500, #797c7f);

    /* Links */
    --_nys-unavfooter-link-gap-spacing-row: var(--nys-space-250, 20px);
    --_nys-unavfooter-link-gap-spacing-column: var(--nys-space-600, 48px);
    --_nys-unavfooter-link-lineheight: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-unavfooter-link-letterspacing: var(
      --nys-font-letterspacing-ui-md,
      var(--nys-font-letterspacing-400, 0.044px)
    );
    --_nys-unavfooter-font-family: var(
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

  /* Slotted content (menu links) basic resets */
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--_nys-unavfooter-color);
    text-decoration: none;
    font-family: var(--_nys-unavfooter-font-family);
    font-size: var(--_nys-unavfooter-font-size-links);
    font-style: normal;
    font-weight: var(--_nys-unavfooter-font-weight-semibold);
    line-height: var(--_nys-unavfooter-link-lineheight);
    letter-spacing: var(--_nys-unavfooter-link-letterspacing);
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: 7%;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
  a:hover {
    text-decoration-line: underline;
  }
  a:active {
    text-decoration-thickness: 12%;
  }

  .nys-unavfooter {
    display: flex;
    flex-direction: column;
    gap: var(--_nys-unavfooter-gap-spacing);
    align-items: flex-start;
    background-color: var(--_nys-unavfooter-background);
    color: var(--_nys-unavfooter-color);
    width: 100%;
    box-sizing: border-box;
  }

  /* Top level container for the footer (NYS Logo and Menu links) */
  .nys-unavfooter__container_menu {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: var(--_nys-unavfooter-padding) var(--_nys-unavfooter-gutter);
    gap: var(--_nys-unavfooter-gap-spacing);
    border-bottom: 2px solid var(--_nys-unavfooter-separator-color);
    box-sizing: border-box;
  }

  /* Specific layout for menu links (grouped or singular list of menus) */
  .nys-unavfooter__content {
    display: flex;
    align-items: center;
  }

  .nys-unavfooter__content ul {
    display: flex;
    justify-content: center;
    gap: var(--_nys-unavfooter-link-gap-spacing-row)
      var(--_nys-unavfooter-link-gap-spacing-column);
    flex-wrap: wrap;
  }

  /* Breakpoints using Excelsior Grid Guidelines (Menu Links) */
  @media (min-width: 768px) {
    /* Tablet (MD - Above 768px) */
    .nys-unavfooter__container_menu {
      flex-direction: row;
    }
    .nys-unavfooter__content ul {
      justify-content: flex-start;
    }
    :host {
      --_nys-unavfooter-gutter: var(--nys-gutter-lg, 32px);
      --_nys-unavfooter-link-gap-spacing-column: var(--nys-space-600, 48px);
      --_nys-unavfooter-gap-spacing: var(--nys-space-800, 64px);
    }
  }

  @media (min-width: 1280px) {
    /* Large Desktop (XL - Above 1280px) */
    :host {
      --_nys-unavfooter-gutter: var(--nys-gutter-xl, 64px);
    }
  }
`;
