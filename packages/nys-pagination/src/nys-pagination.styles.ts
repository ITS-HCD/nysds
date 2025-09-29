import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Pagination Styles */
    --_nys-pagination-width: fit-content;
    --_nys-pagination-height: var(--nys-size-500, 40px);
    --_nys-pagination-radius: var(--nys-radius-xl, 12px);
    --_nys-pagination-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-pagination-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-pagination-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-pagination-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-pagination-font-family: var(
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

  .nys-pagination {
    width: var(--_nys-pagination-width);
    height: var(--_nys-pagination-height);
    border-radius: var(--_nys-pagination-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--_nys-pagination-gap);
    font-family: var(--_nys-pagination-font-family);
    font-size: var(--_nys-pagination-font-size);
    font-weight: var(--_nys-pagination-font-weight);
    line-height: var(--_nys-pagination-line-height);
  }

  nys-button {
    --_nys-button-height: var(--_nys-pagination-height);
    --_nys-button-border-width: var(--nys-border-width-sm, 1px);
    --_nys-button-border-radius--left: var(--nys-radius-md, 4px);
    --_nys-button-border-radius--right: var(--nys-radius-md, 4px);
    --_nys-button-padding--x: var(--nys-space-200, 16px);
  }

  nys-button[variant="outline"] {
    --nys-button-background-color: var(--nys-color-ink-reverse, #fff);
    --nys-button-background-color--hover: var(--nys-color-neutral-10, #f6f6f6);
    --nys-button-background-color--active: var(--nys-color-neutral-50, #ededed);
    --nys-button-border-color: var(--nys-color-neutral-200, #bec0c1);
    --nys-button-border-color--hover: var(--nys-color-neutral-600, #62666a);
    --nys-button-border-color--active: var(--nys-color-neutral-900, #1b1b1b);
    --nys-button-color: var(--nys-color-link, #004dd1);
    --nys-button-color--hover: var(--nys-color-link, #004dd1);
    --nys-button-color--active: var(--nys-color-link, #004dd1);
  }

  nys-button[variant="filled"] {
    --nys-button-background-color: var(--nys-color-link, #004dd1);
    --nys-button-background-color--hover: var(
      --nys-color-link-strong,
      ##003ba1
    );
    --nys-button-background-color--active: var(
      --nys-color-link-strongest,
      ##002971
    );
    --nys-button-border-color: var(--nys-color-link, #004dd1);
    --nys-button-border-color--hover: var(--nys-color-link-strong, ##003ba1);
    --nys-button-border-color--active: var(
      --nys-color-link-strongest,
      ##002971
    );
    --nys-button-color: var(--nys-color-ink-reverse, #fff);
    --nys-button-color--hover: var(--nys-color-ink-reverse, #fff);
    --nys-button-color--active: var(--nys-color-ink-reverse, #fff);
  }

  nys-button#previous,
  nys-button#next,
  nys-button#previous--mobile,
  nys-button#next--mobile {
    --nys-button-color: var(--nys-color-text, ##1b1b1b);
    --nys-button-color--hover: var(--nys-color-text, ##1b1b1b);
    --nys-button-color--active: var(--nys-color-text, ##1b1b1b);
    --_nys-button-padding--x: var(--nys-space-150, 12px);
  }

  nys-button#previous--mobile,
  nys-button#next--mobile {
    display: none;
  }

  nys-button.spacer {
    --nys-button-border-color: transparent;
    --nys-button-border-color--hover: transparent;
    --nys-button-border-color--active: transparent;
    --nys-button-background-color: transparent;
    --nys-button-background-color--hover: transparent;
    --nys-button-background-color--active: transparent;
    --nys-button-color: var(--nys-color-text, ##1b1b1b);
    --nys-button-color--hover: var(--nys-color-text, ##1b1b1b);
    --nys-button-color--active: var(--nys-color-text, ##1b1b1b);
    --_nys-button-padding--x: var(--nys-space-1px, 1px);
    --_nys-button-cursor: default;
  }

  :host([currentPage="3"]) nys-button#first-spacer,
  :host([_twoBeforeLast]) nys-button#last-spacer {
    display: none;
  }

  @media (min-width: 0) and (max-width: 767px) {
    /* Mobile (XS) and Mobile Large (SM) */

    /* Hide 1 less and more than currentPage */
    nys-button#prev-page,
    nys-button#next-page {
      display: none;
    }

    /* Show spacer instead of 1 less and more than currentPage*/
    :host([currentPage="3"]) nys-button#first-spacer,
    :host([_twoBeforeLast]) nys-button#last-spacer {
      display: block;
    }

    /* Swap to icon only previous and next buttons */
    nys-button#previous--mobile,
    nys-button#next--mobile {
      display: block;
    }
    nys-button#previous,
    nys-button#next {
      display: none;
    }
  }
`;
