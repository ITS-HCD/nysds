import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("nys-radiogroup")
export class NysRadiogroup extends LitElement {
  render() {
    return html` <div role="radiogroup">
      <slot></slot>
    </div>`;
  }
}
