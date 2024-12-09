import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-alert.styles";
import "../../nys-icon/src/index.ts"; // references: "/packages/nys-icon/dist/nys-icon.es.js";
import { ifDefined } from "lit/directives/if-defined.js";

let alertIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-alert")
export class NysAlert extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: String }) icon = "";
  @property({ type: Boolean }) isSlim = false;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Number }) duration = 0;
  @property({ type: String }) text = "";

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

  get ariaAttributes() {
    const ariaRole =
      this.theme === "error" || this.theme === "emergency"
        ? "alert"
        : this.theme === "success"
          ? "status"
          : "region"; // Default role

    // Set aria-label only for role="region"
    const ariaLabel = ariaRole === "region" ? `${this.theme} alert` : "";

    return { role: ariaRole, ariaLabel };
  }

  /**************** Lifecycle Methods ****************/

  private _timeoutId: any = null;

  // For alerts that have durations, we set a timer to close them.
  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }

    if (this.duration > 0) {
      this._timeoutId = setTimeout(() => {
        this._closeAlert();
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
  private _generateUniqueId() {
    return `nys-alert-${Date.now()}-${alertIdCounter++}`;
  }

  // Helper function for overriding default icons or checking special naming cases (e.g. theme=success)
  private _getIconName() {
    if (this.icon) {
      return this.icon;
    } else {
      return this._checkAltNaming(); // checking alternative svg naming
    }
  }

  private _checkAltNaming() {
    // map 'success' to 'check_circle'
    return this.theme === "success" ? "check_circle" : this.theme;
  }

  private _closeAlert() {
    this._alertClosed = true;

    /* Dispatch a custom event for the close action:
     * allows bubbling up so if developers wish to implement a local save to remember closed alerts.
     */
    this.dispatchEvent(
      new CustomEvent("nys-alertClosed", {
        detail: { theme: this.theme, label: this.heading },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const { role, ariaLabel } = this.ariaAttributes;

    return html`
      ${!this._alertClosed
        ? html` <div
            id=${this.id}
            class="nys-alert__container nys-alert--${this.theme}"
            role=${role}
            aria-label=${ifDefined(
              ariaLabel.trim() !== "" ? ariaLabel : undefined,
            )}
          >
            <div
              class="nys-alert__icon ${this.isSlim ? "nys-alert--slim" : ""}"
            >
              <nys-icon
                name="${this._getIconName()}"
                size="2xl"
                label="${this.theme} icon"
              ></nys-icon>
            </div>
            <div class="nys-alert__text">
              ${this.isSlim
                ? ""
                : html`<h4 class="nys-alert__label">${this.heading}</h4>`}
              <slot name="text">${this.text}</slot>
            </div>
            ${this.dismissible
              ? html`<div class="close-container">
                  <button class="close-button" @click=${this._closeAlert}>
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
