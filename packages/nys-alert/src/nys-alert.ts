import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import styles from "./nys-alert.styles";
import { ifDefined } from "lit/directives/if-defined.js";

let alertIdCounter = 0; // Counter for generating unique IDs

export class NysAlert extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: String }) icon = "";
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ type: Number, reflect: true }) duration = 0;
  @property({ type: String }) text = "";
  @property({ type: String }) primaryAction = "";
  @property({ type: String }) secondaryAction = "";
  @property({ type: String }) primaryLabel = "Learn more";
  @property({ type: String }) secondaryLabel = "Dismiss";

  @state() private _alertClosed = false;
  @state() private _slotHasContent = true;

  // --- Valid Alert Types --- //
  private static readonly VALID_TYPES = [
    "base",
    "info",
    "success",
    "warning",
    "danger",
    "emergency",
  ] as const;
  private _type: (typeof NysAlert.VALID_TYPES)[number] = "base";

  @property({ reflect: true })
  get type() {
    return this._type;
  }

  set type(value: string) {
    this._type = NysAlert.VALID_TYPES.includes(
      value as (typeof NysAlert.VALID_TYPES)[number],
    )
      ? (value as (typeof NysAlert.VALID_TYPES)[number])
      : "base";
  }

  // Aria attributes based on the type
  get ariaAttributes() {
    const ariaRole =
      this.type === "danger" || this.type === "emergency"
        ? "alert"
        : this.type === "success"
          ? "status"
          : "region"; // Default role

    // Set aria-label only for role="region"
    const ariaLabel = ariaRole === "region" ? `${this.type} alert` : "";

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

  firstUpdated() {
    this._checkSlotContent();
  }

  /******************** Functions ********************/
  private _generateUniqueId() {
    return `nys-alert-${Date.now()}-${alertIdCounter++}`;
  }

  // Helper function for overriding default icons or checking special naming cases (e.g. type=success)
  private _getIconName() {
    if (this.icon) {
      return this.icon;
    } else {
      return this._checkAltNaming(); // checking alternative svg naming
    }
  }

  private _checkAltNaming() {
    // map 'success' to 'check_circle'
    return this.type === "success"
      ? "check_circle"
      : this.type === "base"
        ? "info"
        : this.type === "danger"
          ? "error"
          : this.type === "emergency"
            ? "emergency_home"
            : this.type;
  }

  private _closeAlert() {
    this._alertClosed = true;
    /* Dispatch a custom event for the close action:
     * allows bubbling up so if developers wish to implement a local save to remember closed alerts.
     */
    this.dispatchEvent(
      new CustomEvent("nys-close", {
        detail: { id: this.id, type: this.type, label: this.heading },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private async _checkSlotContent() {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot");
    if (slot) {
      // Check if slot has assigned nodes with content (elements or non-empty text nodes)
      const assignedNodes = slot
        .assignedNodes({ flatten: true })
        .filter(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE ||
            (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
        );

      await Promise.resolve();
      this._slotHasContent = assignedNodes.length > 0;
    } else {
      await Promise.resolve();
      this._slotHasContent = false; // No slot found
    }
  }

  render() {
    const { role, ariaLabel } = this.ariaAttributes;

    return html`
      ${!this._alertClosed
        ? html` <div
            id=${this.id}
            class="nys-alert__container ${this._slotHasContent ||
            this.text?.trim().length > 0
              ? ""
              : "nys-alert--centered"}"
            aria-label=${ifDefined(
              ariaLabel.trim() !== "" ? ariaLabel : undefined,
            )}
          >
            <div part="nys-alert__icon" class="nys-alert__icon">
              <nys-icon
                name="${this._getIconName()}"
                size="3xl"
                label="${this.type} icon"
              ></nys-icon>
            </div>
            <div class="nys-alert__texts" role=${role}>
              <p class="nys-alert__header">${this.heading}</p>
              ${this._slotHasContent
                ? html`<slot></slot>`
                : this.text?.trim().length > 0
                  ? html`<p class="nys-alert__text">${this.text}</p>`
                  : ""}
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
              ? html` <nys-button
                  id="dismiss-btn"
                  variant="ghost"
                  circle
                  icon="close"
                  size="sm"
                  ?inverted=${this.type === "emergency"}
                  ariaLabel="${this.heading}, alert, Close"
                  @nys-click=${this._closeAlert}
                ></nys-button>`
              : ""}
          </div>`
        : ""}
    `;
  }
}

if (!customElements.get("nys-alert")) {
  customElements.define("nys-alert", NysAlert);
}
