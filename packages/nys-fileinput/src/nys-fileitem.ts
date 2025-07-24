import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileitem.styles";

export class NysFileItem extends LitElement {
  @property({ type: String }) filename = "";
  @property({ type: String }) status:
    | "pending"
    | "processing"
    | "done"
    | "error" = "pending";
  @property({ type: Number }) progress = 0;
  @property({ type: String }) errorMessage = "";

  static styles = styles;

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
            .onClick=${() => this._handleRemove()}
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
