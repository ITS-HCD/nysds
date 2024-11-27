import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-alert.styles";
import "@excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

let alertIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-alert")
export class NysAlert extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) title = "Title";
  @property({ type: Boolean }) noIcon = false;
  @property({ type: String }) icon = "";
  @property({ type: Boolean }) isSlim = false;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Number }) duration = 0;
  @state() private _alertClosed = false;
  private static readonly VALID_TYPES = [
    "info",
    "warning",
    "success",
    "error",
    "emergency",
  ] as const;
  private _theme: (typeof NysAlert.VALID_TYPES)[number] = "info";

  @property({ reflect: true })
  get theme() {
    return this._theme;
  }

  set theme(value: string) {
    this._theme = NysAlert.VALID_TYPES.includes(
      value as (typeof NysAlert.VALID_TYPES)[number],
    )
      ? (value as (typeof NysAlert.VALID_TYPES)[number])
      : "info";
  }

  /**************** Lifecycle Methods ****************/

  private _timeoutId: any = null;

  // For alerts that have durations, we set a timer to close them.
  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this.generateUniqueId();
    }

    if (this.duration > 0) {
      this._timeoutId = setTimeout(() => {
        this.closeAlert();
      }, this.duration);
    }
  }
  disconnectedCallback() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    super.disconnectedCallback();
  }

  /******************** Functions ********************/
  private generateUniqueId() {
    return `nys-alert-${Date.now()}-${alertIdCounter++}`;
  }

  // Helper function for overriding default icons or checking special naming cases (e.g. theme=success)
  private getIconName() {
    if (this.icon) {
      return this.icon;
    } else {
      return this.checkAltNaming(); // checking alternative svg naming
    }
  }

  private checkAltNaming() {
    // map 'success' to 'check-circle'
    return this.theme === "success" ? "check-circle" : this.theme;
  }

  closeAlert() {
    this._alertClosed = true;

    /* Dispatch a custom event for the close action:
     * allows bubbling up so if developers wish to implement a local save to remember closed alerts.
     */
    this.dispatchEvent(
      new CustomEvent("alert-closed", {
        detail: { theme: this.theme, title: this.title },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      ${!this._alertClosed
        ? html` <div
            id=${this.id}
            class="nys-alert__container nys-alert--${this.theme}"
          >
            <div
              class="nys-alert__icon ${this.isSlim ? "nys-alert--slim" : ""}"
            >
              ${this.noIcon
                ? ""
                : html`<nys-icon
                    name="${this.getIconName()}"
                    size="2xl"
                    label="${this.theme} icon"
                  ></nys-icon>`}
            </div>
            <div class="nys-alert__heading">
              ${this.isSlim
                ? ""
                : html`<h4 class="nys-alert__title">${this.title}</h4>`}
              <slot class="nys-alert__text"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</slot
              >
            </div>
            ${this.dismissible
              ? html`<div class="close-container">
                  <button class="close-button" @click=${this.closeAlert}>
                    <nys-icon
                      name="close"
                      size="lg"
                      label="close icon"
                    ></nys-icon>
                  </button>
                </div>`
              : ""}
          </div>`
        : ""}
    `;
  }
}
