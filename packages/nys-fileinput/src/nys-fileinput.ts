import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileinput.styles";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";

let fileinputIdCounter = 0; // Counter for generating unique IDs

export class NysFileinput extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: String }) accept = ""; // e.g., "image/*,.pdf"
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) optional = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean }) showError = false;
  @property({ type: Boolean }) dropzone = false;

  private _selectedFiles = [] as File[];

  static styles = styles;

  /********************** Lifecycle updates **********************/
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${fileinputIdCounter++}`;
    }
  }

  /******************** Event Handlers ********************/
  private _openFileDialog() {
    const input = this.renderRoot.querySelector(
      "#hidden-file-input",
    ) as HTMLInputElement;
    input?.click();
  }

  private _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;

    // Store the files
    this._selectedFiles = files ? Array.from(files) : [];

    this.requestUpdate(); // Trigger re-render

    this.dispatchEvent(
      new CustomEvent("nys-fileChange", {
        detail: { files },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`<div class="nys-fileinput">
      <nys-label
        id=${this.id}
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>

      <input
        id="hidden-file-input"
        type="file"
        name=${this.name}
        ?multiple=${this.multiple}
        accept=${this.accept}
        ?required=${this.required}
        ?disabled=${this.disabled}
        hidden
        @change=${this._handleFileChange}
      />

      ${!this.dropzone
        ? html`<nys-button
            id="file-btn"
            name="file-btn"
            label="Choose file"
            variant="outline"
            @click=${this._openFileDialog}
          ></nys-button>`
        : html`<div class="dropzone-container">
            <nys-button
              id="file-btn"
              name="file-btn"
              label="Choose file"
              variant="outline"
              @click=${this._openFileDialog}
            ></nys-button>
            <p>or drag here</p>
          </div>`}
      ${this.showError
        ? html`
            <nys-errormessage
              ?showError=${this.showError}
              errorMessage=${this.errorMessage}
            ></nys-errormessage>
          `
        : null}
      ${this._selectedFiles.length > 0
        ? html`
            <ul>
              ${this._selectedFiles.map(
                (file) =>
                  html` <li class="file-item">
                    <p>${file.name}</p>
                    <nys-button
                      ariaLabel="close button"
                      size="sm"
                      variant="ghost"
                      prefixIcon="close"
                    ></nys-button>
                  </li>`,
              )}
            </ul>
          `
        : null}
    </div>`;
  }
}

if (!customElements.get("nys-fileinput")) {
  customElements.define("nys-fileinput", NysFileinput);
}
