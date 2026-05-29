import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-label.scss?inline";

let labelIdCounter = 0;

/**
 * **Internal component.** Renders form labels with description, required/optional flag, and tooltip.
 *
 * **Status:** Stable | **WCAG:** 2.2 AA
 *
 * Used internally by form components (textinput, select, checkbox, radiobutton, etc.). Not intended for direct use.
 * Handles label association via the `for` attribute, displays asterisk (*) for required fields, "(Optional)" text
 * for optional fields, and integrates optional tooltips via the info icon.
 *
 * ## When to use
 * - This component is built into form fields and should not be used alone.
 * - Use the `required` flag only if the required prop is added to the form field.
 * - Use the `optional` flag to explicitly mark optional form fields.
 * - Use clear, descriptive wording for labels that explain the form field's purpose.
 * - Use the `description` prop or description slot for helper text below the label (e.g., format hints, constraints).
 * - Use `tooltip` to provide additional context, hints, or guidance for the field (shown on hover/focus of the info icon).
 *
 * ## When to consider something else
 * - Do not use the label alone or without a form field.
 * - Do not embed the `<nys-label>` component directly in your HTML; it is automatically included in form components.
 *
 * ## Label content guidelines
 * - Write concise, descriptive labels that explain the form field's purpose.
 * - Use action-oriented or descriptive wording (e.g., "Email address" instead of "Enter email").
 * - Keep labels short when possible; use descriptions for longer explanations.
 * - Provide clear visual distinction between required (*) and optional (Optional) fields.
 * - Use tooltips for supplementary guidance (hover/focus of the info icon next to the label).
 * - Descriptions provide helper text below the label; use the `description` prop for plain text or the slot for custom HTML.
 *
 * ## Flags and indicators
 * - **Required flag (`flag="required"`)**: Displays an asterisk (*) next to the label to indicate a required field.
 * - **Optional flag (`flag="optional"`)**: Displays "(Optional)" text next to the label to indicate an optional field.
 * - Only one flag should be set at a time; if both are set, `required` takes precedence.
 *
 * ## Dark mode support
 * Set the `inverted` prop to `true` when the label is on a dark background to adjust colors for better contrast.
 *
 * @accessibility
 * - Labels are automatically associated with form fields via the `for` attribute, linking the label to the input's ID.
 * - Required fields display an asterisk (*) for visual indication; always pair with ARIA attributes on the input.
 * - Optional fields display "(Optional)" text for clarity.
 * - Tooltips are keyboard accessible (focusable on the info icon) and announced to screen readers.
 * - Label text is properly associated with the input via `aria-labelledby` on the input.
 *
 * ## Do's and Don'ts
 * **Do:**
 * - Use required/optional flags to indicate field requirement status.
 * - Provide clear, descriptive label text that explains the form field's purpose.
 * - Use descriptions for helper text and tooltips for supplementary guidance.
 * - Ensure labels are properly associated with their form inputs.
 *
 * **Don't:**
 * - Use this component directly in HTML (use form field components instead).
 * - Use vague or unclear label text that doesn't explain the field's purpose.
 * - Embed both required and optional flags on the same field.
 * - Forget to provide labels for form fields—labels are essential for accessibility.
 *
 * ## Dependencies
 *
 * This component depends on the following NYS Design System components:
 *
 *   - `nys-icon`
 *   - `nys-tooltip`
 *
 * @summary Internal label component for form fields with flag, description, tooltip, and dark mode support.
 * @element nys-label
 *
 * @slot description - Custom HTML description content below the label.
 */
export class NysLabel extends LitElement {
  static styles = unsafeCSS(styles);

  /** The ID of the label. */
  @property({ type: String, reflect: true }) id = "";

  /** Label text displayed above the form field. */
  @property({ type: String }) label = "";

  /** Helper text displayed below the label. */
  @property({ type: String }) description = "";

  /** Flag type: `required` shows asterisk, `optional` shows "(Optional)". */
  @property({ type: String }) flag = "";

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;
  /** Tooltip text shown on hover/focus of info icon next to label. */
  @property({ type: String }) tooltip = "";

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-label-${Date.now()}-${labelIdCounter++}`;
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  /**
   * While most components don't need to listen for this event.
   * Special components like "nys-fileinput" and "nys-toggle" need to listen for label to execute their specific functionalities.
   */
  private _dispatchLabelClick() {
    this.dispatchEvent(
      new CustomEvent("nys-label-click", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="nys-label ${this.inverted ? "invert" : ""}">
        <div class="nys-label__tooltip-wrapper">
          <label class="nys-label__label" @click=${this._dispatchLabelClick}
            >${this.label}
            ${this.flag === "required"
              ? html`<div class="nys-label__required">*</div>`
              : ""}
            ${this.flag === "optional"
              ? html`<div class="nys-label__optional">(Optional)</div>`
              : ""}</label
          >
          ${this.tooltip
            ? html`<nys-tooltip
                  text="${this.tooltip}"
                  position="top"
                  focusable
                  ?inverted=${this.inverted}
                  for="tooltip-icon-${this.id}"
                >
                </nys-tooltip>
                <nys-icon
                  id="tooltip-icon-${this.id}"
                  name="info"
                  size="3xl"
                ></nys-icon> `
            : ""}
        </div>
        <p class="nys-label__description" @click=${this._dispatchLabelClick}>
          <slot name="description">${this.description}</slot>
        </p>
      </div>
    `;
  }
}

if (!customElements.get("nys-label")) {
  customElements.define("nys-label", NysLabel);
}
