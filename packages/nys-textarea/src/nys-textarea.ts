import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-textarea.scss?inline";

let textareaIdCounter = 0;

/**
 * A multi-line text input for collecting longer responses like comments, descriptions, or feedback.
 * Form-associated with validation support via ElementInternals.
 *
 * Use for detailed responses needing multiple lines. For single-line input, use `nys-textinput`.
 * For predefined options, use `nys-select`, `nys-radiobutton`, or `nys-checkbox`.
 *
 * @summary Multi-line text input for comments, descriptions, and feedback.
 * @element nys-textarea
 *
 * @slot description - Custom HTML description content below the label.
 *
 * @fires nys-input - Fired on input change. Detail: `{id, value}`.
 * @fires nys-focus - Fired when textarea gains focus.
 * @fires nys-blur - Fired when textarea loses focus. Triggers validation.
 * @fires nys-select - Fired when user selects text. Detail: `{id, value}`.
 *
 * @example Basic textarea
 * ```html
 * <nys-textarea label="Comments" rows="4"></nys-textarea>
 * ```
 *
 * @example Required with description
 * ```html
 * <nys-textarea label="Describe the incident" description="Please provide details" required></nys-textarea>
 * ```
 */

export class NysTextarea extends LitElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. */
  @property({ type: String, reflect: true }) name = "";

  /** Visible label text. Required for accessibility. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Placeholder text. Don't use as label replacement. */
  @property({ type: String }) placeholder = "";

  /** Current textarea value. */
  @property({ type: String }) value = "";

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Makes textarea read-only but focusable. */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /** Marks as required. Shows "Required" flag and validates on blur. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Shows "Optional" flag. Use when most fields are required. */
  @property({ type: Boolean, reflect: true }) optional = false;

  /** Tooltip text shown on hover/focus of info icon. */
  @property({ type: String }) tooltip = "";

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /** Form `id` to associate with when textarea is outside form element. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /** Maximum character length. */
  @property({ type: Number }) maxlength: number | null = null;

  /**
   * Textarea width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default).
   * @default "full"
   */
  @property({ type: String, reflect: true }) width:
    | "sm"
    | "md"
    | "lg"
    | "full" = "full";

  /**
   * Visible height in lines.
   * @default 4
   */
  @property({ type: Number }) rows = 4;

  /**
   * Resize behavior: `vertical` (default, user can resize height), `none` (fixed size).
   * @default "vertical"
   */
  @property({ type: String, reflect: true }) resize: "vertical" | "none" =
    "vertical";

  /** Shows error message when true. Set by validation or manually. */
  @property({ type: Boolean, reflect: true }) showError = false;

  /** Error message text. Shown only when `showError` is true. */
  @property({ type: String }) errorMessage = "";

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    await Promise.resolve();
    if (changedProperties.has("rows")) {
      this.rows = this.rows ?? 4;
    }
    if (
      changedProperties.has("readonly") ||
      changedProperties.has("required")
    ) {
      const input = this.shadowRoot?.querySelector("textarea");

      if (input) input.required = this.required && !this.readonly;
    }
  }

  private _hasUserInteracted = false; // need this flag for "eager mode"
  private _internals: ElementInternals;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-textarea-${Date.now()}-${textareaIdCounter++}`;
    }
    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */

  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire();
  }

  private _manageRequire() {
    const textarea = this.shadowRoot?.querySelector("textarea");

    if (!textarea) return;

    const message = this.errorMessage || "This field is required";
    const isInvalid = this.required && !this.value;

    if (isInvalid) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, textarea);
    } else {
      this._internals.ariaRequired = "false"; // Reset when valid
      this._internals.setValidity({});
      this._hasUserInteracted = false; // Reset lazy validation when valid
    }
  }

  private _setValidityMessage(message: string = "") {
    const textarea = this.shadowRoot?.querySelector("textarea");
    if (!textarea) return;

    // Toggle the HTML <div> tag error message
    this.showError = !!message;
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      textarea,
    );
  }

  private _validate() {
    const textarea = this.shadowRoot?.querySelector("textarea");
    if (!textarea) return;

    // Get the native validation state
    let message = textarea.validationMessage;

    this._setValidityMessage(message);
  }

  // This callback is automatically called when the parent form is reset.
  public formResetCallback() {
    this.value = "";

    const textarea = this.shadowRoot?.querySelector("textarea");
    if (textarea) {
      textarea.value = "";
      textarea.setAttribute("aria-invalid", "false");
    }

    // Reset validation UI
    this.showError = false;
    this._internals.setValidity({});

    // Re-render UI
    this.requestUpdate();
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    const textarea = this.shadowRoot?.querySelector("textarea");
    return textarea ? textarea.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._hasUserInteracted = true; // Start aggressive mode due to form submission
    this._validate();

    const textarea = this.shadowRoot?.querySelector("textarea");
    if (textarea) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        // Find the first element in the form that is invalid
        const firstInvalidElement = elements.find(
          (element) =>
            typeof element.checkValidity === "function" &&
            !element.checkValidity(),
        );
        if (firstInvalidElement === this) {
          textarea.focus();
        }
      } else {
        // If not part of a form, simply focus.
        textarea.focus();
      }
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Handle input event to check pattern validity
  private _handleInput(event: Event) {
    const textarea = event.target as HTMLInputElement;
    this.value = textarea.value;
    this._internals.setFormValue(this.value);

    // Field is invalid after unfocused, validate aggressively on each input (e.g. Eager mode: a combination of aggressive and lazy.)
    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Handle focus event
  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  // Handle blur event
  private _handleBlur() {
    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true; // At initial unfocus: if textarea is invalid, start aggressive mode
    }

    this._validate();
    this.dispatchEvent(new Event("nys-blur"));
  }

  private _handleSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("nys-select", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleSelectionChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("nys-selectionchange", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <label class="nys-textarea">
        <nys-label
          for=${this.id + "--native"}
          label=${this.label}
          description=${this.description}
          flag=${this.required && !this.readonly
            ? "required"
            : this.optional
              ? "optional"
              : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <textarea
          class="nys-textarea__textarea ${this.resize}"
          name=${this.name}
          id=${this.id + "--native"}
          .value=${this.value}
          ?disabled=${this.disabled}
          ?required=${this.required && !this.readonly}
          ?readonly=${this.readonly}
          aria-disabled=${ifDefined(this.disabled ? "true" : undefined)}
          aria-required=${ifDefined(this.required ? "true" : undefined)}
          aria-label=${ifDefined(this.label || undefined)}
          aria-description=${ifDefined(this.description || undefined)}
          placeholder=${ifDefined(
            this.placeholder ? this.placeholder : undefined,
          )}
          maxlength=${ifDefined(this.maxlength ?? undefined)}
          .rows=${this.rows}
          form=${ifDefined(this.form || undefined)}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @select="${this._handleSelect}"
          @selectionchange="${this._handleSelectionChange}"
        ></textarea>
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this._internals.validationMessage || this.errorMessage}
        ></nys-errormessage>
      </label>
    `;
  }
}

if (!customElements.get("nys-textarea")) {
  customElements.define("nys-textarea", NysTextarea);
}
