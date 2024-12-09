import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-test-component.styles";

@customElement("nys-test-component")
export class NysTestComponent extends LitElement {
  @property({ type: String }) name? = "World";

  static styles = styles;

  render() {
    return html`<h2>Hello, <span>${this.name}</span>!</h2>`;
  }
}
