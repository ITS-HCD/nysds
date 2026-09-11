import { html, unsafeCSS } from "lit";
import { property, state } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-processlistitem.scss?inline";

/**
 * A single step in a `<nys-processlist>`. Renders as a list item containing a step number and text.
 *
 * Set `label` for the step label and `description` for supporting information. For rich text, use the
 * `description` slot instead of the property. The step number is owned by the parent list, so items
 * are never numbered individually.
 *
 * @summary A numbered step for use inside `<nys-processlist>`.
 * @element nys-processlistitem
 * @slot description - Custom HTML description content below the label. Overrides the `description` property.
 */
export class NysProcesslistitem extends NysElement {
  static styles = unsafeCSS(styles);

  /**
   * Step heading text.
   */
  @property({ type: String }) label = "";

  /**
   * Supporting information displayed below the label. Use the `description` slot for rich text.
   */
  @property({ type: String }) description = "";

  /**
   * Rendered step number. Assigned by the parent `<nys-processlist>` via `setStep()` — numbering is
   * a property of the list's order, not of the item, so it is deliberately not part of this
   * component's public API.
   */
  @state() private _step = 1;

  /**
   * A description is shown when either the property or the slot has content, so an item with
   * neither renders no empty paragraph.
   */
  private get _hasDescription() {
    return !!this.description || !!this.querySelector('[slot="description"]');
  }

  /**
   * Sets the rendered step number.
   * @internal Called by `<nys-processlist>`; not intended for direct use.
   */
  setStep(step: number) {
    this._step = step;
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto id when
    // one is not provided, preserving the `nys-processlistitem-<ts>-<n>` shape.
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
        <div class="nys-processlistitem__stepwrapper">
          <div class="nys-processlistitem__step">${this._step}</div>
          <div class="nys-processlistitem__connector"></div>
        </div>
        <div class="nys-processlistitem__content">
          <div class="nys-processlistitem__label">${this.label}</div>
          ${this._hasDescription
            ? html`<p class="nys-processlistitem__description">
                <slot name="description">${this.description}</slot>
              </p>`
            : ""}
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-processlistitem")) {
  customElements.define("nys-processlistitem", NysProcesslistitem);
}
