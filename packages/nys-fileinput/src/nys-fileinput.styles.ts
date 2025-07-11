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

    /* Dropzone */
    --_nys-fileinput-dropzone-background: var(--nys-color-ink-reverse, #fff);
    --_nys-fileinput-dropzone-radius: var(
      --nys-radius-lg,
      var(--nys-space-100, 8px)
    );
    --_nys-fileinput-dropzone-border: var(--nys-border-width-sm, 1px) dashed
      var(--nys-color-neutral-300, #a7a9ab);
    --_nys-fileinput-dropzone-color: var(--nys-color-text-disabled, #bec0c1);
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
  :host([width="lg"]) .nys-fileinput {
    max-width: var(--nys-form-width-lg, 384px);
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

  /***** Dragzone *****/
  .nys-fileinput__dropzone {
    display: flex;
    padding: var(--nys-space-400, 32px) var(--nys-space-200, 16px);
    justify-content: center;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    border-radius: var(--_nys-fileinput-dropzone-radius);
    border: var(--_nys-fileinput-dropzone-border);
    background: var(--_nys-fileinput-dropzone-background);
  }

  .nys-fileinput__dropzone:hover {
    cursor: pointer;
    --_nys-fileinput-dropzone-border: var(--nys-border-width-sm, 1px) dashed
      var(--nys-color-neutral-900, #1b1b1b);
  }

  .nys-fileinput__dropzone.drag-active {
    --_nys-fileinput-dropzone-border: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-neutral-900, #1b1b1b);
    --_nys-fileinput-dropzone-background: var(--nys-color-theme-faint, #f7fafd);
  }

  .nys-fileinput__dropzone.error {
    --_nys-fileinput-dropzone-border: var(--nys-border-width-md, 2px) dashed
      var(--nys-color-danger, #b52c2c);
  }

  .nys-fileinput__dropzone.disabled {
    cursor: not-allowed;
    --_nys-fileinput-dropzone-border: var(--nys-border-width-sm, 1px) dashed
      var(--nys-color-neutral-300, #a7a9ab);
    --_nys-fileinput-dropzone-background: var(--nys-color-neutral-10, #f6f6f6);
    color: var(--_nys-fileinput-dropzone-color);
  }

  progress {
    display: flex;
    width: 100%;
    height: 6px;
    border-radius: var(--nys-radius-round, 1776px);
    background: var(--_nys-fileinput-progress-background);
    overflow: hidden;
    appearance: none;
    border: none;
  }
  progress::-moz-progress-bar {
    background: var(--_nys-fileinput-progress-background);
  }
  progress::-webkit-progress-value {
    background: var(--_nys-fileinput-progress-background);
  }
  progress::-webkit-progress-bar {
    background: var(--_nys-fileinput-progress-background);
  }
`;
