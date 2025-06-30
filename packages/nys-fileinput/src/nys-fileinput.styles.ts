import { css } from "lit";

export default css`
  :host {
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

    /* Dropzone */
    --_nys-fileinput-dropzone-radius: var(--nys-radius-lg, var(--nys-space-100, 8px));
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
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--_nys-fileinput-gap);
  }

  .file-item {
    display: flex;
    justify-items: center;
    align-items: center;
    padding: var(--_nys-fileinput-items-padding);
    border-radius: var(--_nys-fileinput-items-radius);
    border: var(--_nys-fileinput-items-border);
    gap: var(--_nys-fileinput-gap);
  }
  .file-info {
    display: flex;
    width: 100%;
  }
  .file-item p {
    margin: 0;
  }

  .nys-fileinput__dropzone {
    display: flex;
    padding: var(--nys-space-400, 32px) var(--nys-space-200, 16px);
    justify-content: center;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    border-radius: var(--_nys-fileinput-dropzone-radius);
    border: var(--nys-border-width-sm, 1px) dashed
      var(--nys-color-neutral-300, #a7a9ab);
    background: var(--nys-color-ink-reverse, #fff);
  }

  .nys-fileinput__dropzone.drag-active {
    border: var(--nys-border-width-sm, 1px) solid var(--nys-color-neutral-900, #1B1B1B);
    background: var(--nys-color-theme-faint, #F7FAFD);
  }
`;
