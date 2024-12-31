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
  @state() private _formData: Record<string, any> = {}; // Store custom-component's data changes

  /********************** Lifecycle Hooks **********************/
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("nys-submitForm", this._handleChange); // nys-submitForm is listen on each custom component, their details are used during submission
    this._attachExternalSubmitListener();
  }

  disconnectedCallback() {
    this._detachExternalSubmitListener();
    this.removeEventListener("nys-submitForm", this._handleChange);
    super.disconnectedCallback();
  }

  /******************** External Submit Handling ********************/
  private _attachExternalSubmitListener() {
    if (this.id) {
      const externalButtons = document.querySelectorAll(
        `button[form="${this.id}"]`,
      );

      externalButtons.forEach((button) => {
        button.addEventListener("click", this._handleExternalSubmit);
      });
    }
  }

  private _detachExternalSubmitListener() {
    if (this.id) {
      const externalButtons = document.querySelectorAll(
        `button[form="${this.id}"]`,
      );

      externalButtons.forEach((button) => {
        button.removeEventListener("click", this._handleExternalSubmit);
      });
    }
  }

  private _handleExternalSubmit = (e: Event) => {
    e.preventDefault();
    const formElement = this.shadowRoot?.querySelector("form");
    if (formElement) {
      formElement.requestSubmit(); // Trigger internal form submission
    }
  };

  /******************** Functions ********************/
  // Because slot only projects HTML elements into the shadow DOM, we need to dynamically clone and append slotted elements into the shadow DOM form directly.
  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot) {
      const assignedElements = slot.assignedElements({ flatten: true });
      const formElement = this.shadowRoot?.querySelector("form");
      const fieldsetElement = formElement?.querySelector("fieldset");

      const parent = this.fieldset ? fieldsetElement : formElement;

      if (parent) {
        // Append slotted elements directly
        assignedElements.forEach((node) => {
          parent.appendChild(node.cloneNode(true));
          node.remove(); // remove from light DOM (this solves duplicated ID issue with slots)
        });
      }
    }
  }

  // Current implementation shows the values of the submission.
  private _handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);

    // Append custom form data (from nys-checkbox, nys-select, etc.)
    for (const key in this._formData) {
      formData.append(key, this._formData[key]);
    }

    // Include external elements with the `form` attribute in the FormData
    const externalNodes = document.querySelectorAll(`[form=${this.id}]`);
    externalNodes.forEach((node) => {
      if (
        node instanceof HTMLFormElement ||
        node instanceof HTMLInputElement ||
        node instanceof HTMLSelectElement
      ) {
        formData.append(node.name, node.value);
      }
    });

    // Bubble up the formData using a custom event for product developers to use
    this.dispatchEvent(
      new CustomEvent("nys-submit", {
        detail: formData,
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Listen for "change" events from custom form elements (like checkbox, select, etc.)
  private _handleChange(e: Event) {
    const customEvent = e as CustomEvent;
    const { name, value } = customEvent.detail;

    if (name) {
      this._formData[name] = value; // Update internal form data
    }
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
        <slot @slotchange="${this._handleSlotChange}"></slot>
      </form>
    `;
  }
}
