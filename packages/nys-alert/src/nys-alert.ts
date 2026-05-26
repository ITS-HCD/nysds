import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-alert.scss?inline";

let alertIdCounter = 0;

/**
 * Displays contextual feedback messages with semantic styling. Uses ARIA live regions for screen reader announcements.
 *
 * Use `info` for neutral information, `success` for confirmations, `warning` for caution, `danger` for errors,
 * and `emergency` for critical system-wide alerts. Set `dismissible` to let users close the alert.
 * If an id is not passed, a unique id will be generated.
 *
 * ## When to use
 *
 * Use `nys-alert` to communicate important, time-sensitive information to users in a visually prominent way.
 * Ideal for messages such as success notifications, danger alerts, warnings, or informational updates.
 * Use for dismissible or temporary alerts when the message is not critical to user workflow.
 *
 * If the information is not time-sensitive or critical, consider using a less intrusive component, such as a tooltip or inline message.
 * Avoid using alerts for repetitive or non-actionable content that could frustrate users.
 * For notifications outside the page context, consider using a toast or modal component instead.
 *
 * ## Variants
 *
 * Keep the alert content concise and focused on the message. Use the appropriate `type` (e.g., `info`, `success`, `warning`, or `danger`)
 * to match the intent of the alert. Use the `dismissible` property for non-critical alerts, allowing users to clear them from the screen.
 * Avoid overusing alerts for non-critical information, as this can desensitize users to important messages.
 *
 * ## Accessibility
 *
 * The `nys-alert` component includes the following accessibility-focused features:
 * - Keyboard navigation support, allowing users to use voiceover to read the alert using the keyboard
 * - Visual focus indicators to help users navigate the component
 * - Each alert type contains an ARIA role attribute that can notify assistive technologies of time-sensitive and important messages
 * - `role="alert"`: Important messages that demand the user's immediate attention (danger and emergency alert)
 * - `role="status"`: Messages that provide advisory information but do not have the same urgency as alerts (success alert)
 * - `role="region"`: Messages that provide information the user would want to be able to easily find, but are not important enough to interrupt user workflow (info and warning alert with aria-label)
 *
 * ## Events
 *
 * The `nys-alert` component emits the `nys-close` event when the alert is dismissed by the user (via a close button).
 * The event's `detail` object includes:
 * - id (string): The id of the alert
 * - type (string): The alert's type (e.g., "success", "error", "info")
 * - label (string): The alert's heading text
 *
 * Consider persisting dismissal state (e.g., to localStorage or analytics) to prevent the alert from appearing again.
 *
 * ```js
 * const alert = document.querySelector("nys-alert");
 * alert.addEventListener("nys-close", (event) => {
 *   const { type, label } = event.detail;
 *   console.log(`Alert closed. Type: ${type}, Label: ${label}`);
 * });
 * ```
 *
 * @summary Alert for contextual feedback with semantic types and live region support.
 * @element nys-alert
 *
 * @slot - Default slot for custom body content. Overrides `text` prop when provided.
 *
 * @fires nys-close - Fired when alert is dismissed. Detail: `{id, type, label}`.
 *
 * @example Info alert
 * ```html
 * <nys-alert type="info" heading="Update available" text="A new version is ready to install."></nys-alert>
 * ```
 *
 * @example Dismissible success alert
 * ```html
 * <nys-alert type="success" heading="Application submitted" dismissible></nys-alert>
 * ```
 */

export class NysAlert extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Bold heading text displayed at the top of the alert. */
  @property({ type: String }) heading = "";

  /** Custom icon name. Defaults to type-appropriate icon if not set. */
  @property({ type: String }) icon = "";

  /** Shows close button allowing users to dismiss the alert. */
  @property({ type: Boolean, reflect: true }) dismissible = false;

  /** Auto-dismiss after specified milliseconds. Set to 0 to disable. */
  @property({ type: Number, reflect: true }) duration = 0;

  /** Body text content. Ignored if slot content is provided. */
  @property({ type: String }) text = "";

  /** URL for the primary action link. */
  @property({ type: String }) primaryAction = "";

  /** URL for the secondary action link. */
  @property({ type: String }) secondaryAction = "";

  /** Label text for primary action link. */
  @property({ type: String }) primaryLabel = "Learn more";

  /** Label text for secondary action link. */
  @property({ type: String }) secondaryLabel = "Dismiss";

  /**
   * Semantic alert type affecting color and ARIA role. `danger`/`emergency` use assertive live region.
   * @default "base"
   */
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
              ${this.heading?.trim()
                ? html`<p class="nys-alert__header">${this.heading}</p>`
                : ""}
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
