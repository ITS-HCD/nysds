import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Label Styles */
    --_nys-label-font-family: var(
      --nys-type-family-ui,
      "Proxima Nova",
      "Arial" /* TODO: this should not need to be specified */
    );
  }

  .nys-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--nys-space-50, 4px);
    font-family: var(--_nys-label-font-family);
  }

  .nys-label__label {
    color: var(--nys-color-ink, #1b1b1b);
    font-size: var(--nys-type-size-ui-md, 16px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--nys-font-lineheight-ui-md, 24px); /* 150% */
    letter-spacing: var(--nys-font-letterspacing-ui-md, 0.044px);
  }

  .nys-label__description {
    color: var(--Neutral-Neutral-9, #1b1b1b);
    font-style: italic;
    font-weight: 400;
    line-height: var(--nys-font-lineheight-ui-md, 24px); /* 150% */
    letter-spacing: var(--nys-font-letterspacing-ui-md, 0.044px);
  }

  .nys-label__required {
    color: var(--nys-color-danger, #b52c2c);
    font-weight: 400;
  }

  .nys-label__optional {
    color: var(--nys-neutral-700, #4a4d4f);
    font-weight: 400;
  }
`;
