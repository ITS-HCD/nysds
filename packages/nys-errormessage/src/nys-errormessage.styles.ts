import { css } from "lit";

export default css`
  :host {
    --nys-errormessage-font-family: var(
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
    --nys-errormessage-font-weight: var(--nys-font-weight-regular, 400);
    --nys-errormessage-font-size: var(--nys-font-size-ui-md, 16px);
    --nys-errormessage-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --nys-errormessage-letter-spacing: var(
      --nys-font-letterspacing-ui-md,
      0.044px
    );
    --nys-errormessage-color: var(
      --nys-color-danger,
      var(--nys-color-red-600, #b52c2c)
    );

    /* Spacing */
    --nys-errormessage-gap: var(--nys-space-100, 8px);
    --nys-errormessage-divider-gap: var(--nys-space-50, 4px);
    --nys-errormessage-divider-width: var(--nys-border-width-sm, 1px);
  }

  .nys-errormessage {
    display: flex;
    align-items: center;
    gap: var(--nys-errormessage-gap);
    font-family: var(--nys-errormessage-font-family);
    font-weight: var(--nys-errormessage-font-weight);
    font-size: var(--nys-errormessage-font-size);
    line-height: var(--nys-errormessage-line-height);
    letter-spacing: var(--nys-errormessage-letter-spacing);
    color: var(--nys-errormessage-color);
  }

  .nys-errormessage[showDivider] {
    padding-top: var(--nys-errormessage-divider-gap);
    margin-top: var(--nys-errormessage-divider-gap);
    border-top: var(--nys-errormessage-divider-width) solid
      var(--nys-errormessage-color);
  }
`;
