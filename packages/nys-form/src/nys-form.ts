import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-form.styles";

@customElement("nys-form")
export class NysForm extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({type: String}) id = "";
  @property({type: Boolean}) fieldset = false;
  @property({type: String}) legend = "";

  /**************** Lifecycle Methods ****************/

  /******************** Functions ********************/

  render() {
    return html`
      <form id=${this.id}>
        <h1>This is a form</h1>
        <slot></slot>
      </form>
    `;
  }
}
