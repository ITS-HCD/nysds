import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileinput.styles";

export class NysFileListItem extends LitElement {
  @property({ type: String }) filename = "";
  @property({ type: Boolean, reflect: true }) status = "";
  @property({ type: Number }) progress = 0;
  @property({ type: String }) error = "";

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

  render() {
    return html`
      <div class="file-item">
        <div class="file-info">
          <p>${this.filename}</p>
          ${this.error ? html`<p class="error-msg">${this.error}</p>` : null}
        </div>
        <nys-button
          ariaLabel="close button"
          size="sm"
          variant="ghost"
          prefixIcon="close"
          @click=${this._handleRemove}
        ></nys-button>
      </div>
    `;
  }
}

customElements.define("nys-filelistitem", NysFileListItem);
