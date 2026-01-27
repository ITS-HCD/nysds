import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-fileitem.scss?inline";

/**
 * **Internal component.** Displays an individual file within `nys-fileinput` with status and progress.
 *
 * Rendered automatically by `nys-fileinput` for each selected file. Shows filename, upload status
 * (pending/processing/done/error), progress bar during upload, and error messages. Remove button emits event.
 *
 * @summary Internal file item display with status, progress bar, and remove action.
 * @element nys-fileitem
 *
 * @fires nys-fileRemove - Fired when remove button is clicked. Detail: `{filename}`.
 */
export class NysFileItem extends LitElement {
  static styles = unsafeCSS(styles);

  /** Name of the file being displayed. */
  @property({ type: String }) filename = "";

  /**
   * Upload status: `pending` (queued), `processing` (uploading), `done` (complete), `error` (failed).
   * @default "pending"
   */
  @property({ type: String }) status:
    | "pending"
    | "processing"
    | "done"
    | "error" = "pending";

  /** Upload progress percentage (0-100). Only shown when status is `processing`. */
  @property({ type: Number }) progress = 0;

  /** Error message displayed when status is `error`. */
  @property({ type: String }) errorMessage = "";

  private _handleRemove() {
    this.dispatchEvent(
      new CustomEvent("nys-fileRemove", {
        detail: { filename: this.filename },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private splitFilename(filename: string) {
    const lastDotIndex = filename.lastIndexOf(".");
    const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : ""; // e.g. ".pdf"
    const name =
      lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;

    const startPart = name.slice(0, name.length - 3);
    const endPart = name.slice(-3);

    return { startPart, endPart, extension };
  }

  render() {
    const { startPart, endPart, extension } = this.splitFilename(this.filename);

    return html`
      <div
        class="file-item ${this.status}"
        aria-busy=${this.status === "processing" ? "true" : "false"}
        aria-label="You have selected ${this.filename}"
      >
        <div class="file-item__main" role="group">
          <nys-icon
            class="file-icon"
            name=${this.status === "processing"
              ? "progress_activity"
              : this.status === "error"
                ? "error"
                : "attach_file"}
            size="2xl"
          ></nys-icon>
          <div class="file-item__info">
            <div class="file-item__info-name">
              <span class="file-item__info-name-start">${startPart}</span>
              <span class="file-item__info-name-end"
                >${endPart}${extension}</span
              >
            </div>
            ${this.errorMessage
              ? html`<p
                  class="file-item__error"
                  role="alert"
                  aria-live="assertive"
                  aria-invalid="true"
                  aria-errormessage=${this.errorMessage}
                  id="${this.filename}-error"
                >
                  ${this.errorMessage}
                </p>`
              : null}
          </div>
          <nys-button
            circle
            icon="close"
            ariaLabel="close button"
            size="sm"
            variant="ghost"
            @nys-click=${this._handleRemove}
            ariaLabel="Remove file: ${this.filename}"
          ></nys-button>
        </div>
        ${this.status === "processing"
          ? html`<div
              class="file-item__progress-container"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="${this.progress}"
              aria-label="Upload progress for ${this.filename}"
            >
              <progress value=${this.progress} max="100"></progress>
            </div>`
          : null}
      </div>
    `;
  }
}

customElements.define("nys-fileitem", NysFileItem);
