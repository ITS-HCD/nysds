import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-form.styles";

@customElement("nys-form")
export class NysForm extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: Boolean }) fieldset = false;
  @property({ type: String }) legend = "";
  @state() private _formElements: HTMLElement[] = [];

  /**************** Lifecycle Methods ****************/

  /******************** Functions ********************/

  // Because slot only projects HTML elements into the shadow DOM, we need to dynamically clone and append slotted elements into the shadow DOM form.
  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot) {
      // Retrieve slotted elements
      const nodes = slot.assignedElements({ flatten: true });

      // Clear current form elements
      this._formElements = [];

      // Add node to formElements to be use to populate node into shadow DOM
      nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          this._formElements.push(node);
        }
      });
    }
    this.requestUpdate(); // Request an update after processing options
  }

  // Current implementation shows the values of the submission.
  private _handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (!form) {
      console.error("Form element not found.");
      return;
    }

    const formData = new FormData(form);

    // Bubble up the formData using a custom event for product developers to use
    this.dispatchEvent(
      new CustomEvent("nys-formSubmitted", {
        detail: formData,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <form id=${this.id} @submit=${this._handleSubmit}>
        ${this.fieldset
          ? html`
              <fieldset>
                ${this.legend.length > 0
                  ? html`<legend>${this.legend}</legend>`
                  : ""}
                ${this._formElements.map(
                  (element) => html`${element.cloneNode(true)}`,
                )}
              </fieldset>
            `
          : html`
              ${this._formElements.map(
                (element) => html`${element.cloneNode(true)}`,
              )}
            `}
        <slot
          @slotchange="${this._handleSlotChange}"
          style="display:none;"
        ></slot>
      </form>
    `;
  }
}
