import { css } from "lit";

export default css`
  :host {
    /* Label Typography */
    --_nys-label-font-family: var(
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
    --_nys-label-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-label-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-label-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-label-letter-spacing: var(--nys-font-letterspacing-ui-md, 0.044px);
    --_nys-label-color: var(--nys-color-text, #1b1b1b);
    --_nys-label-cursor: normal;

    /* Description */
    --_nys-description-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-description-font-style: italic;
    --_nys-description-font-color: var(--nys-color-text, #1b1b1b);

    /* Required Flag */
    --_nys-required-font-color: var(--nys-color-danger, #b52c2c);

    /* Optional Flag */
    --_nys-optional-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-optional-font-color: var(--nys-color-text-weak, #4a4d4f);

    /* Spacing */
    --_nys-label-gap: var(--nys-space-4px, 4px);
  }

  .nys-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: var(--_nys-label-font-family);
    font-size: var(--_nys-label-font-size);
    line-height: var(--_nys-label-line-height);
    letter-spacing: var(--_nys-label-letter-spacing);
  }

  .nys-label * {
    cursor: var(--_nys-label-cursor);
  }

  .nys-label__label {
    display: flex;
    gap: var(--_nys-label-gap);
    text-align: left;
    font-weight: var(--_nys-label-font-weight);
    color: var(--_nys-label-color);
  }

  .nys-label__description {
    text-align: left;
    font-weight: var(--_nys-description-font-weight);
    font-style: var(--_nys-description-font-style);
    color: var(--_nys-description-font-color);
  }

  .nys-label__required {
    font-weight: var(--_nys-label-font-weight);
    color: var(--_nys-required-font-color);
  }

  .nys-label__optional {
    font-weight: var(--_nys-optional-font-weight);
    color: var(--_nys-optional-font-color);
  }

  .nys-label__tooltip-wrapper {
    display: flex;
    gap: 5px;
  }

  .nys-label__tooltip-icon {
    margin-top: -2px;
  }
`;
