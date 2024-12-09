import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-test-component.styles";

// Import the nys-checkbox component
import "@nys-excelsior/nys-checkbox";

@customElement("nys-test-component")
export class NysTestComponent extends LitElement {
  @property({ type: String }) name = "World"; // Original name passed as an attribute
  @state() private isSubscribed = false; // Internal state to track checkbox value

  static styles = styles;

  render() {
    return html`
      <h2>Hello, <span>${this.currentName}</span>!</h2>
      <nys-checkbox
        label="Subscribe to newsletter"
        ?checked="${this.isSubscribed}"
        @change="${this.handleCheckboxChange}"
      ></nys-checkbox>
    `;
  }

  // A getter dynamically calculates the name based on state
  private get currentName() {
    return this.isSubscribed ? "Subscriber" : this.name;
  }

  // Handle checkbox changes and toggle subscription state
  private handleCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isSubscribed = checkbox.checked;
  }
}
