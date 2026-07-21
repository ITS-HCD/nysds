import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-processlistitem.scss?inline";

/**
 * A single step in a `<nys-processlist>`. Renders as a list item containing a step number and one or two lines of text.
 *
 * The default slot holds the step label. Use `<span slot="description">` for supporting copy below
 * the label. The step number is assigned by the parent list and should not be set directly.
 *
 * @summary A numbered step for use inside `<nys-processlist>`.
 * @element nys-processlistitem
 *
 * @slot - Step label text.
 * @slot description - Optional supporting copy rendered below the label.
 */
export class NysProcesslistitem extends LitElement {
  static styles = unsafeCSS(styles);

  /**
   * Step number displayed beside the label. Set by the parent `<nys-processlist>`; not intended to
   * be set directly.
   * @default 1
   */
  @property({ type: Number, reflect: true }) step = 1;

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

  private _handleDescriptionSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const hasDescription = slot.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute("data-has-description", hasDescription);
  }

  render() {
    return html`
      <div class="nys-processlistitem">
        <!-- Not aria-hidden: role="list" carries no ordering, so the rendered
             number is the only thing conveying sequence to assistive tech. -->
        <div class="nys-processlistitem__step">${this.step}</div>
        <div class="nys-processlistitem__label">
          <slot></slot>
          <slot
            name="description"
            @slotchange=${this._handleDescriptionSlotChange}
          ></slot>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-processlistitem")) {
  customElements.define("nys-processlistitem", NysProcesslistitem);
}
