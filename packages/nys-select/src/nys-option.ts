import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

/**
 * An option item for use within `nys-select`. Wraps a native `<option>` element.
 *
 * Place inside `nys-select`. Set `value` for form submission and `label` for display text.
 * Alternatively, slot text content which auto-populates the label.
 *
 * @summary Option item for nys-select dropdown.
 * @element nys-option
 *
 * @slot - Option label text. Auto-populates the `label` prop if provided.
 *
 * @example Basic options
 * ```html
 * <nys-select>
 *   <nys-option value="ny">New York</nys-option>
 *   <nys-option value="ca" disabled>California</nys-option>
 * </nys-select>
 * ```
 */
export class NysOption extends LitElement {
  /** Prevents selection of this option. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Pre-selects this option. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Value submitted when this option is selected. */
  @property({ type: String }) value = "";

  /** Display text for the option. Auto-populated from slot content if not set. */
  @property({ type: String }) label = "";

  /** Hides the option from the dropdown list. */
  @property({ type: Boolean, reflect: true }) hidden = false;

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot) {
      slot.addEventListener("slotchange", () => {
        const assignedNodes = slot.assignedNodes({ flatten: true });
        if (assignedNodes.length > 0) {
          this.label = assignedNodes[0].textContent?.trim() || "";
        }
      });
    }
  }

  render() {
    return html`
      <option
        ?disabled=${this.disabled}
        ?selected=${this.selected}
        value=${this.value}
        label=${this.label}
        ?hidden=${this.hidden}
      >
        <slot>${this.label}</slot>
      </option>
    `;
  }
}

customElements.define("nys-option", NysOption);
