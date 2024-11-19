import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-toggle.styles";

@customElement("nys-toggle")
export class NysToggle extends LitElement {
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";

  static styles = styles;

  render() {
    return html`<h1>Hi</h1>`;
  }
}
