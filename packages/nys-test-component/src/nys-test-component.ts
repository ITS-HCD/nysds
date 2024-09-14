import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js"; // Correct imports for decorators

@customElement("nys-test-component")
export class NysTestComponent extends LitElement {
  @property({ type: String }) name = "World";

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-family: Arial, sans-serif;
    }
    h2 {
      color: #333;
    }
  `;

  render() {
    return html`<h2>Hello, ${this.name}!</h2>`;
  }
}
