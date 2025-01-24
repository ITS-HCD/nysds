import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

export class NysOption extends LitElement {
  @property({ type: Boolean, attribute: "disabled" }) disabled = false;
  @property({ type: Boolean, attribute: "selected" }) selected = false;
  @property({ type: String, attribute: "value" }) value = "";
  @property({ type: String, attribute: "label" }) label = "";
  @property({ type: Boolean, attribute: "hidden" }) hidden = false;

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
