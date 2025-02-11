import { css } from "lit";

export default css`
  :host {
    /* Label Typography */
    --nys-label-font-family: var(
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
    --nys-label-font-weight: var(--nys-font-weight-semibold, 600);
    --nys-label-font-size: var(--nys-font-size-ui-md, 16px);
    --nys-label-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --nys-label-letter-spacing: var(--nys-font-letterspacing-ui-md, 0.044px);
    --nys-label-font-color: var(--nys-color-ink, #1b1b1b);

    /* Description Typography */
    --nys-description-font-weight: var(--nys-font-weight-regular, 400);
    --nys-description-font-style: italic;
    --nys-description-font-color: var(--nys-neutral-900, #1b1b1b);

    /* Required Flag */
    --nys-required-font-color: var(--nys-color-danger, #b52c2c);

    /* Optional Flag */
    --nys-optional-font-weight: var(--nys-font-weight-regular, 400);
    --nys-optional-font-color: var(--nys-color-neutral-700, #4a4d4f);

    /* Spacing */
    --nys-label-flag-gap: var(--nys-space-2px, 2px);
  }

  .nys-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: var(--nys-label-font-family);
    font-size: var(--nys-label-font-size);
    line-height: var(--nys-label-line-height);
    letter-spacing: var(--nys-label-letter-spacing);
  }

  .nys-label__labelwrapper {
    display: flex;
    gap: var(--nys-label-flag-gap);
  }

  .nys-label__label {
    font-weight: var(--nys-label-font-weight);
    color: var(--nys-label-font-color);
  }

  .nys-label__description {
    font-weight: var(--nys-description-font-weight);
    font-style: var(--nys-description-font-style);
    color: var(--nys-description-font-color);
  }

  .nys-label__required {
    font-weight: var(--nys-label-font-weight);
    color: var(--nys-required-font-color);
  }

  .nys-label__optional {
    font-weight: var(--nys-optional-font-weight);
    color: var(--nys-optional-font-color);
  }
`;
