import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import styles from "./nys-input.styles"; // Assuming styles are in a separate file

@customElement("nys-input")
export class NysInput extends LitElement {
  static styles = styles;

  render() {
    return html`<input />`;
  }
}
