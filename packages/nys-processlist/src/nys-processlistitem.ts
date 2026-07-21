import { LitElement, html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-processlistitem.scss?inline";

/**
 * A single step in a `<nys-processlist>`. Renders as a list item containing a step number and a `<nys-label>`.
 *
 * Set `label` for the step label and `description` for supporting information. The step number is owned
 * by the parent list, so items are never numbered individually.
 *
 * @summary A numbered step for use inside `<nys-processlist>`.
 * @element nys-processlistitem
 */
export class NysProcesslistitem extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Step heading text.
   */
  @property({ type: String }) label = "";

  /**
   * Supporting information displayed below the label.
   */
  @property({ type: String }) description = "";

  /**
   * Rendered step number. Assigned by the parent `<nys-processlist>` via `setStep()` — numbering is
   * a property of the list's order, not of the item, so it is deliberately not part of this
   * component's public API.
   */
  @state() private _step = 1;

  /**
   * Sets the rendered step number.
   * @internal Called by `<nys-processlist>`; not intended for direct use.
   */
  setStep(step: number) {
    this._step = step;
  }

  connectedCallback() {
    super.connectedCallback();
    // Only expose the listitem role when actually inside a list, so a
    // standalone item isn't announced as an orphan listitem.
    if (
      !this.hasAttribute("role") &&
      this.parentElement?.tagName.toLowerCase() === "nys-processlist"
    ) {
      this.setAttribute("role", "listitem");
    }
  }

  render() {
    return html`
      <div class="nys-processlistitem">
        <!-- Not aria-hidden: role="list" carries no ordering, so the rendered
             number is the only thing conveying sequence to assistive tech. -->
        <div class="nys-processlistitem__step">${this._step}</div>
        <nys-label
          class="nys-processlistitem__label"
          label=${this.label}
          description=${this.description}
        ></nys-label>
      </div>
    `;
  }
}

if (!customElements.get("nys-processlistitem")) {
  customElements.define("nys-processlistitem", NysProcesslistitem);
}
