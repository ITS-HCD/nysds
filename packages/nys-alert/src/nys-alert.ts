import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-alert.scss?inline";

let alertIdCounter = 0;

/**
 * `<nys-alert>` renders an informational, success, warning, or error alert.
 *
 * @slot - Default slot for additional alert content.
 *
 * @event nys-close - Fired when alert is dismissed (manual or timeout).
 *   @type {CustomEvent<{id: string, type: string, label: string}>}
 *
 * Features:
 * - Accessible ARIA roles and live-region announcements.
 * - Auto-close via `duration`.
 * - Handles default slot content or fallback `text`.
 * - Optional dismiss button.
 */

export class NysAlert extends LitElement {
  static styles = unsafeCSS(styles);

  // Properties
  @property({ type: String, reflect: true }) id = "";
  @property({ type: String }) heading = "";
  @property({ type: String }) icon = "";
  @property({ type: Boolean, reflect: true }) dismissible = false;
  @property({ type: Number, reflect: true }) duration = 0;
  @property({ type: String }) text = "";
  @property({ type: String }) primaryAction = "";
  @property({ type: String }) secondaryAction = "";
  @property({ type: String }) primaryLabel = "Learn more";
  @property({ type: String }) secondaryLabel = "Dismiss";
  @property({ type: String, reflect: true }) type:
    | "base"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "emergency" = "base";

  @state() private _alertClosed = false;
  @state() private _slotHasContent = true;

  /**
   * Returns ARIA role and label based on alert type.
   * - 'alert' => assertive live region (implied)
   * - 'status' => polite live region
   * - 'region' => generic, requires aria-label
   */
  get ariaAttributes(): {
    role: "alert" | "status" | "region";
    ariaLabel: string;
  } {
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

  /**
   * Returns live-region type for screen readers if applicable.
   * - 'polite' for status role
   * - undefined for alert (since it's implicitly assertive) or region
   */
  get liveRegion(): "polite" | undefined {
    const role = this.ariaAttributes.role;
    if (role === "status") return "polite";
    return undefined; // for region. No need to return "assertive" as role="alert" implies it
  }

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  private _timeoutId: any = null;

  connectedCallback() {
    super.connectedCallback();

    // Generate a unique ID if not provided
    if (!this.id) {
      this.id = this._generateUniqueId();
    }

    // For alerts that have durations, we set a timer to close them.
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

  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  private _generateUniqueId() {
    return `nys-alert-${Date.now()}-${alertIdCounter++}`;
  }

  private _resolveIconName() {
    return this.icon || this._checkAltNaming();
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

  /**
   * Checks whether the default slot has content.
   * Updates `_slotHasContent` accordingly.
   */
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
                name="${this._resolveIconName()}"
                size="3xl"
                label="${this.type} icon"
              ></nys-icon>
            </div>
            <div
              class="nys-alert__texts"
              role=${role}
              aria-live=${ifDefined(this.liveRegion)}
            >
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
                  style=${ifDefined(
                    this.type === "emergency"
                      ? "--_nys-button-outline-color: var(--nys-color-ink-reverse, var(--nys-color-white, #fff));"
                      : undefined,
                  )}
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
