import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-alert.styles"; 


@customElement("nys-alert")
export class NysAlert extends LitElement {

  static styles = styles;

  render() {
    return html`
      <div class="nys-alert-container">
        <h1>Hello</h1>
      </div>
    `;
  }
}
