import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-alert.styles";
import { ifDefined } from "lit/directives/if-defined.js";
import "@nys-excelsior/nys-icon";

let alertIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-alert")
export class NysAlert extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: String }) icon = "";
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Number }) duration = 0;
  @property({ type: String }) text = "";
  @property({ type: String }) primaryAction = "";
  @property({ type: String }) secondaryAction = "";
  @property({ type: String }) primaryLabel = "Learn more";
  @property({ type: String }) secondaryLabel = "Dismiss";

  @state() private _alertClosed = false;
  private static readonly VALID_TYPES = [
    "base",
    "info",
    "success",
    "warning",
    "danger",
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
      : "base";
  }

  // Aria attributes based on the theme
  get ariaAttributes() {
    const ariaRole =
      this.theme === "danger" || this.theme === "emergency"
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
    return this.theme === "success"
      ? "check_circle"
      : this.theme === "base"
        ? "info"
        : this.theme === "danger"
          ? "error"
          : this.theme;
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

  private hasSlotContent(): boolean {
    const slot = this.shadowRoot?.querySelector('slot[name="text"]');
    if (slot !== null) {
      return (slot as HTMLSlotElement).assignedNodes().length > 0;
    }
    return false;
  }

  render() {
    const { role, ariaLabel } = this.ariaAttributes;

    // Helper function to determine if the slot is empty
    const isSlotEmpty =
      typeof this.text === "string" &&
      this.text.trim() === "" &&
      !this.hasSlotContent();

    return html`
      ${!this._alertClosed
        ? html` <div
            id=${this.id}
            class="nys-alert__container ${isSlotEmpty
              ? "nys-alert--centered"
              : ""}"
            role=${role}
            aria-label=${ifDefined(
              ariaLabel.trim() !== "" ? ariaLabel : undefined,
            )}
          >
            <div part="nys-alert__icon" class="nys-alert__icon">
              <nys-icon
                name="${this._getIconName()}"
                size="2xl"
                label="${this.theme} icon"
              ></nys-icon>
            </div>
            <div class="nys-alert__text">
              <h4 class="nys-alert__label">${this.heading}</h4>
              ${!isSlotEmpty ? html`<slot name="text">${this.text}</slot>` : ""}
              ${this.primaryAction || this.secondaryAction
                ? html`<div class="nys-alert__actions">
                    ${this.primaryAction
                      ? html`<a
                          href=${ifDefined(this.primaryAction || undefined)}
                          class="nys-alert__action nys-alert__primary"
                        >
                          ${this.primaryLabel}
                        </a>`
                      : ""}
                    ${this.secondaryAction
                      ? html`<a
                          href=${ifDefined(this.secondaryAction || undefined)}
                          class="nys-alert__action nys-alert__secondary"
                        >
                          ${this.secondaryLabel}
                        </a>`
                      : ""}
                  </div> `
                : ""}
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
