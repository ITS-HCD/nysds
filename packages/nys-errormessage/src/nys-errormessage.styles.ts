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
    --nys-errormessage-font-weight: var(--nys-font-weight-semibold, 600);
    --nys-errormessage-font-size: var(--nys-font-size-ui-md, 16px);
    --nys-errormessage-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --nys-errormessage-letter-spacing: var(
      --nys-font-letterspacing-ui-md,
      0.044px
    );
    --nys-errormessage-font-color: var(
      --nys-color-danger,
      var(--nys-color-red-600, #b52c2c)
    );
    --nys-errormessage-gap: var(--nys-space-100, 8px);
  }

  .nys-errormessage {
    display: flex;
    align-items: center;
    gap: var( --nys-errormessage-gap);
    font-family: var(--nys-errormessage-font-family);
    font-weight: var(--nys-errormessage-font-weight);
    font-size: var(--nys-errormessage-font-size);
    line-height: var(--nys-errormessage-line-height);
    letter-spacing: var(--nys-errormessage-letter-spacing);
    color: var(--nys-errormessage-font-color);
  }
`;
