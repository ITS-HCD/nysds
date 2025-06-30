import { css } from "lit";

export default css`
  :host {
    /* Global Filelistitem Styles */
    --_nys-filelistitem-font-family: var(
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
    --_nys-filelistitem-font-size: var(--nys-font-size-ui-md, 16px);
    --_nys-filelistitem-font-weight-400: var(--nys-font-weight-regular, 400);
    --_nys-filelistitem-line-height: var(--nys-font-lineheight-ui-md, 24px);
    --_nys-filelistitem-letterspacing: var(--nys-font-letterspacing-ui-md, 0.044px);

    /* Progress Bar */
    --_nys-filelistitem-progress-background: var(--nys-color-neutral-50, #ededed);
    --_nys-filelistitem-progress-fill-background: var(--nys-color-info, #004dd1);
  }

  /***** File List Item *****/
  .file-item {
    position: relative;
    border-radius: var(--_nys-filelistitem-items-radius);
    border: var(--_nys-filelistitem-items-border);
  }
  .file-item__main {
    display: flex;
    justify-items: center;
    align-items: center;
    gap: var(--_nys-filelistitem-gap);
    padding: var(--_nys-filelistitem-items-padding);
    height: 56px;
    box-sizing: border-box;
  }

  .file-item__info {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: var(--_nys-filelistitem-font-family);
    font-size: var(--_nys-filelistitem-font-size);
    font-style: normal;
    font-weight: var(--_nys-filelistitem-font-weight-400);
    line-height: var(--_nys-filelistitem-line-height);
    letter-spacing: var(--_nys-filelistitem-letterspacing);
  }

  .file-item p {
    margin: 0;
  }

  .error-msg {
    color: var(--nys-color-danger, #b52c2c);
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
    background: var(--_nys-filelistitem-progress-fill-background);
    overflow: hidden;
    appearance: none;
  }
  /* Track */
  progress::-moz-progress-bar {
    background: var(--_nys-filelistitem-progress-background);
  }
  /* Filled value (the blue bar) */
  progress::-webkit-progress-value {
    background: var(--_nys-filelistitem-progress-fill-background);
  }
  /* Firefox */
  progress::-webkit-progress-bar {
    background: var(--_nys-filelistitem-progress-background);
  }
`;
