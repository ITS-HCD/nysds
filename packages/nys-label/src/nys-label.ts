import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-label.scss?inline";

let labelIdCounter = 0;

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

  /** The ID of the label. */
  @property({ type: String, reflect: true }) id = "";

  /** Label text displayed above the form field. */
  @property({ type: String }) label = "";

  /** Helper text displayed below the label. */
  @property({ type: String }) description = "";

  /** Flag type: `required` shows asterisk, `optional` shows "(Optional)". */
  @property({ type: String }) flag = "";

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;
  /** Tooltip text shown on hover/focus of info icon next to label. */
  @property({ type: String }) tooltip = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-label-${Date.now()}-${labelIdCounter++}`;
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  /**
   * While most components don't need to listen for this event.
   * Special components like "nys-fileinput" and "nys-toggle" need to listen for label to execute their specific functionalities.
   */
  private _dispatchLabelClick() {
    this.dispatchEvent(
      new CustomEvent("nys-label-click", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="nys-label ${this.inverted ? "invert" : ""}">
        <div class="nys-label__tooltip-wrapper">
          <label class="nys-label__label" @click=${this._dispatchLabelClick}
            >${this.label}
            ${this.flag === "required"
              ? html`<div class="nys-label__required">*</div>`
              : ""}
            ${this.flag === "optional"
              ? html`<div class="nys-label__optional">(Optional)</div>`
              : ""}</label
          >
          ${this.tooltip
            ? html`<nys-tooltip
                  text="${this.tooltip}"
                  position="top"
                  focusable
                  ?inverted=${this.inverted}
                  for="tooltip-icon-${this.id}"
                >
                </nys-tooltip>
                <nys-icon
                  id="tooltip-icon-${this.id}"
                  name="info"
                  size="3xl"
                ></nys-icon> `
            : ""}
        </div>
        <p class="nys-label__description" @click=${this._dispatchLabelClick}>
          <slot name="description">${this.description}</slot>
        </p>
      </div>
    `;
  }
}

if (!customElements.get("nys-label")) {
  customElements.define("nys-label", NysLabel);
}
