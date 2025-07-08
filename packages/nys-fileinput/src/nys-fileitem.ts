import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileitem.styles";

export class NysFileListItem extends LitElement {
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

  private truncateFilename(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) {
      // No extension, truncate to max 30 chars + ellipsis if needed
      return filename.length > 30 ? filename.slice(0, 30) + "..." : filename;
    }

    const extension = filename.slice(lastDotIndex); // e.g. ".pdf"
    const namePart = filename.slice(0, lastDotIndex);

    // Show at most 30 chars total in namePart (including last 3 chars before extension)
    const maxNameLength = 30;
    if (namePart.length <= maxNameLength) {
      return filename; // no truncation needed
    }

    const startPart = namePart.slice(0, maxNameLength - 3);
    const endPart = namePart.slice(-3);

    return `${startPart}...${endPart}${extension}`;
  }

  render() {
    return html`
      <div class="file-item ${this.status}">
        <div class="file-item__main" role="group" aria-label="Filename: ${this.filename}">
          <nys-icon
            class="file-icon"
            name=${
              this.status === "processing"
                ? "progress_activity"
                : this.status === "error"
                  ? "error"
                  : "attach_file"
            }
            size="2xl"
          ></nys-icon>
          <div class="file-item__info">
            <p">
              ${this.truncateFilename(this.filename)}
            </p>
            ${
              this.errorMessage
                ? html`<p
                    class="error-msg"
                    role="alert"
                    aria-live="assertive"
                    id="${this.filename}-error"
                  >
                    ${this.errorMessage}
                  </p>`
                : null
            }
          </div>
          <nys-button
            circle
            icon="close"
            ariaLabel="close button"
            size="sm"
            variant="ghost"
            .onClick=${() => this._handleRemove()}
          ></nys-button>
        </div>
        ${
          this.status === "processing"
            ? html`<div
                class="progress-container"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${this.progress}"
                aria-label="Upload progress for ${this.filename}"
              >
                <progress value=${this.progress} max="100"></progress>
              </div>`
            : null
        }
      </div>
    `;
  }
}

customElements.define("nys-filelistitem", NysFileListItem);
