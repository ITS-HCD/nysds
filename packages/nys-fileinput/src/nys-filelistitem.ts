import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileinput.styles";

export class NysFileListItem extends LitElement {
  @property({ type: String }) filename = "";
  @property({ type: Boolean, reflect: true }) status = "";
  @property({ type: Number }) progress = 0;
  @property({ type: String }) error = "";

  static styles = styles;

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
        ></nys-button>
      </div>
    `;
  }
}

customElements.define("nys-filelistitem", NysFileListItem);
