import { css } from "lit";

export default css`
  :host {
    /* Progress Bar */
    --_nys-fileinput-progress-background: var(--nys-color-neutral-50, #ededed);
    --_nys-fileinput-progress-fill-background: var(--nys-color-info, #004dd1);
  }

  /***** File List Item *****/
  .file-item {
    position: relative;
    border-radius: var(--_nys-fileinput-items-radius);
    border: var(--_nys-fileinput-items-border);
  }
  .file-item__main {
    display: flex;
    justify-items: center;
    align-items: center;
    gap: var(--_nys-fileinput-gap);
    padding: var(--_nys-fileinput-items-padding);
    height: 56px;
    box-sizing: border-box;
  }

  .file-item__info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .file-item p {
    margin: 0;
  }

  .error-msg {
    color: var(--nys-color-danger, #b52c2c);
    text-overflow: ellipsis;
    font-family: var(--nys-typography-type-family-ui, "Proxima Nova");
    font-size: var(--nys-typography-type-size-ui-md, 16px);
    font-style: normal;
    font-weight: 700;
    line-height: var(--nys-typography-font-lineheight-ui-md, 24px); /* 150% */
    letter-spacing: var(--nys-typography-font-letterspacing-ui-md, 0.044px);
  }

  /**** Progress Bar ****/
  progress {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 6px;
    border-radius: var(--nys-radius-round, 1776px);
    background: var(--_nys-fileinput-progress-fill-background);
    overflow: hidden;
    appearance: none;
  }
  /* Track */
  progress::-moz-progress-bar {
    background: var(--_nys-fileinput-progress-background);
  }
  /* Filled value (the blue bar) */
  progress::-webkit-progress-value {
    background: var(--_nys-fileinput-progress-fill-background);
  }
  /* Firefox */
  progress::-webkit-progress-bar {
    background: var(--_nys-fileinput-progress-background);
  }
`;
