import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-button.styles";
import "@nys-excelsior/nys-icon";

@customElement("nys-textarea")
export class NysTextarea extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";

  static styles = styles;

  render() {
    return html` <button></button> `;
  }
}
