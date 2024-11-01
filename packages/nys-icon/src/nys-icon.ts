import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconLibrary from "./nys-icon.libary";

@customElement("nys-icon")
export class NysIcon extends LitElement {
	@property({ type: String }) name = "";
	@property({ type: String }) label = "";
	@property({ type: Boolean }) focusable = false;

	getIcon() {
		const iconSVG = iconLibrary[this.name];
		return html`${iconSVG ? iconSVG : html`<span>Icon not found</span>`}`;
	}

	// Update accessibility attributes based on the label
	handleLabelChange() {
		const hasLabel = typeof this.label === "string" && this.label.length > 0;

		if (hasLabel) {
			this.setAttribute("role", "img");
			this.setAttribute("aria-label", this.label);
			this.removeAttribute("aria-hidden");
		} else {
			this.removeAttribute("role");
			this.removeAttribute("aria-label");
			this.setAttribute("aria-hidden", "true");
		}
	}


  // Watch for changes specifically to the `label` property
  updated(changedProperties: Map<string, any>) {
		if (changedProperties.has("label")) {
         this.handleLabelChange();
      }
	}

	render() {
		return this.getIcon;
	}
}
