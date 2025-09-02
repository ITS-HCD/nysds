import { css } from "lit";

export default css`
  :host {
    /* Global fileitem Styles */
    --_nys-fileitem-border-radius: var(--nys-radius-md, 4px);
    --_nys-fileitem-padding: var(--nys-space-100, 8px)
      var(--nys-space-200, 16px);
    --_nys-fileitem-background-color: var(--nys-color-ink-reverse, #fff);
    --_nys-fileitem-border-color: var(--nys-color-neutral-100, #d0d0ce);

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
    --_nys-fileitem-font-weight: var(--nys-font-weight-regular, 400);
    --_nys-fileitem-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-fileitem-letter-spacing: var(
      --nys-font-letterspacing-ui-md,
      0.044px
    );

    /* Progress Bar */
    --_nys-fileitem-background-color--progress: var(
      --nys-color-neutral-50,
      #ededed
    );
    --_nys-fileitem-background-color--progress--fill: var(
      --nys-color-info,
      #004dd1
    );
  }

  /***** File List Item *****/
  .file-item {
    position: relative;
    border-radius: var(--_nys-fileitem-border-radius);
    border-width: var(--nys-border-width-sm, 1px);
    border-style: solid;
    border-color: var(--_nys-fileitem-border-color);
    background-color: var(--_nys-fileitem-background-color);
  }

  .file-item.error {
    --_nys-fileitem-border-color: var(--nys-color-danger, #b52c2c);
  }

  .file-item__main {
    display: flex;
    justify-items: center;
    align-items: center;
    gap: var(--_nys-fileinput-gap);
    padding: var(--_nys-fileitem-padding);
    height: 56px;
    box-sizing: border-box;
  }

  .file-item__info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    font-family: var(--_nys-fileitem-font-family);
    font-size: var(--_nys-fileitem-font-size);
    font-style: normal;
    font-weight: var(--_nys-fileitem-font-weight);
    line-height: var(--_nys-fileitem-line-height);
    letter-spacing: var(--_nys-fileitem-letter-spacing);
  }

  .file-item__info-name {
    display: flex;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    align-items: center;
  }

  .file-item__info-name-start {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
    min-width: 0;
  }

  .file-item p {
    margin: 0;
  }

  .file-item__error {
    color: var(--nys-color-danger, #b52c2c);
    text-overflow: ellipsis;
    font-weight: 700;
  }

  /**** Progress Bar ****/
  progress {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 6px;
    border-radius: var(--nys-radius-round, 1776px);
    background: var(--_nys-fileitem-background-color--progress--fill);
    overflow: hidden;
    appearance: none;
  }
  /* Track */
  progress::-moz-progress-bar {
    background-color: var(--_nys-fileitem-background-color--progress);
  }
  /* Filled value (the blue bar) */
  progress::-webkit-progress-value {
    background-color: var(--_nys-fileitem-background-color--progress--fill);
  }
  /* Firefox */
  progress::-webkit-progress-bar {
    background-color: var(--_nys-fileitem-background-color--progress);
  }

  /**** Icon ****/
  .file-icon[name="progress_activity"] {
    animation: spin 1s linear infinite;
  }

  .file-icon[name="error"] {
    color: var(--nys-color-danger, #b52c2c);
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
