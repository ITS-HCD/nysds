import { css } from "lit";

export default css`
  :host {
    /* Global fileitem Styles */
    --_nys-fileitem-items-radius: var(--nys-radius-md, 4px);
    --_nys-fileitem-items-padding: var(--nys-space-100, 8px)
      var(--nys-space-200, 16px);
    --_nys-fileitem-items-border: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-neutral-100, #d0d0ce);
    --_nys-fileitem-error-color: var(--nys-color-danger, #b52c2c);

    /* Typography */
    --_nys-fileitem-font-family: var(
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
    --_nys-fileitem-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-fileitem-font-weight-400: var(--nys-font-weight-regular, 400);
    --_nys-fileitem-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-fileitem-letterspacing: var(--nys-font-letterspacing-ui-md, 0.044px);

    /* Progress Bar */
    --_nys-fileitem-progress-background: var(--nys-color-neutral-50, #ededed);
    --_nys-fileitem-progress-fill-background: var(--nys-color-info, #004dd1);
  }

  /***** File List Item *****/
  .file-item {
    position: relative;
    border-radius: var(--_nys-fileitem-items-radius);
    border: var(--_nys-fileitem-items-border);
  }

  .file-item.error {
    --_nys-fileitem-items-border: var(--nys-border-width-sm, 1px) solid
      var(--nys-color-danger, #b52c2c);
  }

  .file-item__main {
    display: flex;
    justify-items: center;
    align-items: center;
    gap: var(--_nys-fileinput-gap);
    padding: var(--_nys-fileitem-items-padding);
    height: 56px;
    box-sizing: border-box;
  }

  .file-item__info {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--_nys-fileitem-font-family);
    font-size: var(--_nys-fileitem-font-size);
    font-style: normal;
    font-weight: var(--_nys-fileitem-font-weight-400);
    line-height: var(--_nys-fileitem-line-height);
    letter-spacing: var(--_nys-fileitem-letterspacing);
  }

  .file-item p {
    margin: 0;
  }

  .error-msg {
    color: var(--_nys-fileitem-error-color);
    text-overflow: ellipsis;
  }

  /**** Progress Bar ****/
  progress {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 6px;
    border-radius: var(--nys-radius-round, 1776px);
    background: var(--_nys-fileitem-progress-fill-background);
    overflow: hidden;
    appearance: none;
  }
  /* Track */
  progress::-moz-progress-bar {
    background: var(--_nys-fileitem-progress-background);
  }
  /* Filled value (the blue bar) */
  progress::-webkit-progress-value {
    background: var(--_nys-fileitem-progress-fill-background);
  }
  /* Firefox */
  progress::-webkit-progress-bar {
    background: var(--_nys-fileitem-progress-background);
  }

  /**** Icon ****/
  .file-icon[name="progress_activity"] {
    animation: spin 1s linear infinite;
  }

  .file-icon[name="error"] {
    color: var(--_nys-fileitem-error-color);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
