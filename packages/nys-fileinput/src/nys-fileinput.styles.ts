import { css } from "lit";

export default css`
  :host {
    /* Anything that can be overridden should be defined here */

    /* Global Fileinput Styles */
    --_nys-fileinput-gap: var(--nys-space-100, 8px);

    /* Typography */
    --_nys-fileinput-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-fileinput-font-weight: var(--nys-font-weight-semibold, 600);
    --_nys-fileinput-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-fileinput-font-family: var(
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

    /* File items */
    --_nys-fileinput-items-radius: var(--nys-radius-md, 4px);
    --_nys-fileinput-items-padding: var(--nys-space-100, 8px);
    --_nys-fileinput-items-border: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-neutral-100, #d0d0ce);
  }

  .nys-fileinput {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: var(--_nys-fileinput-gap);
    font-family: var(--_nys-fileinput-font-family);
    font-size: var(--_nys-fileinput-font-size);
    font-weight: var(--_nys-fileinput-font-weight);
    line-height: var(--_nys-fileinput-line-height);
  }

  ul {
    list-style-type: none;
    padding: 0px;
    margin: 0px;
  }

  .file-item {
    display: flex;
    justify-items: center;
    align-items: center;
    padding: var(--_nys-fileinput-items-padding);
    border-radius: var(--_nys-fileinput-items-radius);
    border: var(--_nys-fileinput-items-border);
  }
  .file-item p {
    flex: 1;
    margin: 0;
  }
`;
