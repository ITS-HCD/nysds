import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-checkbox.styles";

let checkboxgroupIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-checkboxgroup")
export class NysCheckboxgroup extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";

  static styles = styles;

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${checkboxgroupIdCounter++}`;
    }
  }

  render() {
    return html` <div class="nys-checkboxgroup">
      ${this.label &&
      html` <div class="nys-checkbox__text">
        <div class="nys-checkbox__requiredwrapper">
          <label for=${this.id} class="nys-checkbox__label"
            >${this.label}</label
          >
          ${this.required
            ? html`<label class="nys-checkbox__required">*</label>`
            : ""}
        </div>
        <label for=${this.id} class="nys-checkbox__description">
          ${this.description}
          <slot name="description"></slot>
        </label>
      </div>`}
      <div class="nys-checkboxgroup__content">
        <slot></slot>
      </div>
      ${this.showError && this.errorMessage
        ? html`<div class="nys-checkbox__error">
            <nys-icon name="error"></nys-icon>
            ${this.errorMessage}
          </div>`
        : ""}
    </div>`;
  }
}
