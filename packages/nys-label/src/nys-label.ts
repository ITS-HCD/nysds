import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-label.scss?inline";

/**
 * **Internal component.** Renders form labels with description, required/optional flag, and tooltip.
 *
 * Used internally by form components (textinput, select, checkbox, etc.). Not intended for direct use.
 * Handles label association via `for`, displays asterisk for required fields, and integrates tooltips.
 *
 * @summary Internal label component for form fields with flag and tooltip support.
 * @element nys-label
 *
 * @slot description - Custom HTML description content below the label.
 */
export class NysLabel extends LitElement {
  static styles = unsafeCSS(styles);

  /** ID of the form element this label is associated with. */
  @property({ type: String }) for = "";

  /** Label text displayed above the form field. */
  @property({ type: String }) label = "";

  /** Helper text displayed below the label. */
  @property({ type: String }) description = "";

  /** Flag type: `required` shows asterisk, `optional` shows "(Optional)". */
  @property({ type: String }) flag = "";

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;
  /** Tooltip text shown on hover/focus of info icon next to label. */
  @property({ type: String })
  get tooltip() {
    return this._tooltip;
  }
  set tooltip(value: string) {
    this._tooltip = value;
  }
  private _tooltip: string = "";

  render() {
    return html`
      <div class="nys-label ${this.inverted ? "invert" : ""}">
        <div class="nys-label__tooltip-wrapper">
          <label for=${this.for} class="nys-label__label"
            >${this.label}
            ${this.flag === "required"
              ? html`<div class="nys-label__required">*</div>`
              : ""}
            ${this.flag === "optional"
              ? html`<div class="nys-label__optional">(Optional)</div>`
              : ""}</label
          >
          ${this._tooltip
            ? html`<nys-tooltip
                  text="${this._tooltip}"
                  position="top"
                  focusable
                  ?inverted=${this.inverted}
                  for="tooltip-icon-${this.for}"
                >
                </nys-tooltip>
                <nys-icon
                  id="tooltip-icon-${this.for}"
                  name="info"
                  size="3xl"
                ></nys-icon> `
            : ""}
        </div>
        <label for=${this.for} class="nys-label__description">
          <slot name="description">${this.description}</slot>
        </label>
      </div>
    `;
  }
}

if (!customElements.get("nys-label")) {
  customElements.define("nys-label", NysLabel);
}
