import { css } from "lit";

export default css`
  :host {
  }

  .nys-unavheader {
    background-color: var(--nys-color-ink-reverse, #ffffff);
    display: flex;
    justify-content: space-between;
  }

  .nys-unavheader * {
    display: flex;
    align-items: center;
    gap: var(--nys-space-300, 24px);
  }

  #nys-unav__translate {
  }

  .nys-unavheader__know {
    color: var(--nys-color-link, #004dd1);
  }

  .nys-unavheader__trustbar.hide {
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
