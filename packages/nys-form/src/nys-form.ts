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

  // Current implementation shows the values of the submission.
  private _handleSubmit(e: Event) {
    // prevents sending the form
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (!form) {
      console.error("Form element not found.");
      return;
  }
  
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    console.log(formValues);
    alert(JSON.stringify(formValues, null, 2));
  }

  render() {
    return html`
      <form id=${this.id} @submit=${this._handleSubmit}>
        ${this.fieldset
          ? html`
              <fieldset>
                ${this.legend
                  ? html`<legend>${this.legend}</legend>`
                  : ""}
                <slot></slot>
              </fieldset>
            `
          : html`<slot></slot>`}
      </form>
    `;
  }
}
