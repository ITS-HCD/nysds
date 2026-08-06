import { html, unsafeCSS, type TemplateResult } from "lit";
import { property, query } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-accordion.scss?inline";

/**
 * Heading levels an accordion trigger may occupy. `h1` is intentionally absent:
 * the trigger is never the page title, so the shallowest useful level is `h2`.
 */
type NysAccordionHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

/** Level used when neither the item nor its parent accordion specifies one. */
const DEFAULT_ACCORDION_HEADING_LEVEL: NysAccordionHeadingLevel = "h3";

const HEADING_LEVELS: readonly string[] = ["h2", "h3", "h4", "h5", "h6"];

/**
 * Coerce an author-supplied value into a supported heading level.
 *
 * Attributes are stringly typed, so an out-of-range or misspelled value has to
 * resolve to something: it returns null and the caller falls back rather than
 * rendering an element the ARIA heading contract does not allow.
 */
function normalizeAccordionHeadingLevel(
  value: unknown,
): NysAccordionHeadingLevel | null {
  if (typeof value !== "string") return null;
  const level = value.trim().toLowerCase();
  return HEADING_LEVELS.includes(level)
    ? (level as NysAccordionHeadingLevel)
    : null;
}

/**
 * A collapsible content panel used within `nys-accordion`. Supports keyboard navigation and smooth animations.
 *
 * Place inside `nys-accordion`. Set `expanded` to open by default. The heading acts as a toggle button
 * accessible via click, Enter, or Space. Parent accordion controls `bordered` and `singleSelect` behavior.
 *
 * Per the WAI-ARIA Accordion pattern the toggle button is wrapped in a real
 * heading element so the panels appear in the document outline and screen
 * reader users can jump between them by heading. Set `headingLevel` (here or on
 * the parent `nys-accordion`) to the level that fits the surrounding page.
 *
 * @summary Collapsible panel for use within nys-accordion with keyboard support.
 * @element nys-accordionitem
 *
 * @slot - Default slot for panel content shown when expanded.
 *
 * @fires nys-accordionitem-toggle - Fired when expanded state changes. Detail: `{id, heading, expanded}`.
 *
 * @example Expanded item
 * ```html
 * <nys-accordion>
 *   <nys-accordionitem heading="How do I apply?" expanded>
 *     <p>Visit ny.gov and complete the online application.</p>
 *   </nys-accordionitem>
 *   <nys-accordionitem heading="What documents do I need?">
 *     <p>You will need a valid ID and proof of residency.</p>
 *   </nys-accordionitem>
 * </nys-accordion>
 * ```
 *
 * @example Per-item heading level
 * ```html
 * <nys-accordion headingLevel="h2">
 *   <nys-accordionitem heading="Sits at h2, inherited from the group">
 *     <p>Every item follows the group unless it says otherwise.</p>
 *   </nys-accordionitem>
 *   <nys-accordionitem headingLevel="h3" heading="Sits at h3, set on the item">
 *     <p>An item that nests under the preceding one sets its own level.</p>
 *   </nys-accordionitem>
 * </nys-accordion>
 * ```
 */

export class NysAccordionItem extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Heading text displayed in the clickable toggle button. */
  @property({ type: String }) heading = "";

  /**
   * Heading element that wraps the toggle button (`h2` through `h6`).
   *
   * Pick the level that puts the trigger in the right place in the page
   * outline — one level below the heading that introduces the accordion. Leave
   * it empty to follow the `headingLevel` of the enclosing `nys-accordion`,
   * which is the usual way to set it for a whole group; `h3` applies when
   * neither is specified. `h1` is not offered because an accordion trigger is
   * never the page title.
   */
  @property({ type: String, reflect: true }) headingLevel:
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "" = "";

  /** Whether the content panel is visible. Toggle via click or keyboard. */
  @property({ type: Boolean, reflect: true }) expanded = false;

  /** Adds border styling. Set by parent `nys-accordion`, not directly. */
  @property({ type: Boolean, reflect: true }) bordered = false;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns a unique id
    // when one is not provided. The accordion item host carries no role: the
    // semantics live on the inner heading/button (toggle) and the region panel,
    // so defaultRole stays null.
    super.connectedCallback();
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector("slot");

    /**
     * When the accordion starts expanded, but the slot is empty
     * the _updateHeight() runs too early and calculates height as 0.
     * Listening for slotchange ensures we recalculate after the slot’s
     * content is rendered so the final height is correct.
     */
    if (this.expanded && slot) {
      slot.addEventListener("slotchange", () => {
        this._updateHeight();
      });
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has("expanded") ||
      changedProperties.has("bordered")
    ) {
      this._updateHeight();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

  /**
   * The level actually rendered: this item's own `headingLevel`, otherwise the
   * one set on the enclosing `nys-accordion`, otherwise the `h3` default.
   *
   * The group's value is read here rather than pushed down from the container
   * so there is a single source of truth per item and an item-level value
   * always wins. `nys-accordion` re-renders its items when its own level
   * changes (see `_notifyHeadingLevel` there).
   */
  private _resolveHeadingLevel(): NysAccordionHeadingLevel {
    const own = normalizeAccordionHeadingLevel(this.headingLevel);
    if (own) return own;

    const group = this.closest("nys-accordion") as
      | (HTMLElement & { headingLevel?: string })
      | null;

    return (
      normalizeAccordionHeadingLevel(group?.headingLevel) ??
      DEFAULT_ACCORDION_HEADING_LEVEL
    );
  }

  private _dispatchEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-accordionitem-toggle", {
        detail: { id: this.id, heading: this.heading, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleExpand() {
    this.expanded = !this.expanded;
    this._updateHeight();
    this._dispatchEvent();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault(); // prevent page scroll on space
      this._handleExpand();
    }
  }

  // Call this after first render and whenever expanded changes
  @query(".nys-accordionitem__content") private _contentContainer!: HTMLElement;
  private _updateHeight() {
    if (!this._contentContainer) return;

    if (this.expanded) {
      // Slide down the content by setting a calculated max-height, depending on the panel's height on different screen sizes
      requestAnimationFrame(() => {
        const slotHeight = this._contentContainer.scrollHeight;
        this._contentContainer.style.height = `${slotHeight}px`;
      });
    } else {
      // Collapse
      this._contentContainer.style.height = "0";
      this._contentContainer.style.overflow = "hidden";
    }
  }

  /**
   * Helper Render Functions
   * --------------------------------------------------------------------------
   */

  /**
   * WAI-ARIA Accordion pattern: the toggle button must be contained in a
   * heading at the level appropriate for the surrounding page. A real `h2`-`h6`
   * element is used rather than `role="heading"` + `aria-level` so the trigger
   * carries native heading semantics everywhere — including the places that
   * read the DOM instead of the accessibility tree.
   */
  private _renderHeading(trigger: TemplateResult) {
    const cls = "nys-accordionitem__title";

    switch (this._resolveHeadingLevel()) {
      case "h2":
        return html`<h2 class=${cls}>${trigger}</h2>`;
      case "h4":
        return html`<h4 class=${cls}>${trigger}</h4>`;
      case "h5":
        return html`<h5 class=${cls}>${trigger}</h5>`;
      case "h6":
        return html`<h6 class=${cls}>${trigger}</h6>`;
      default:
        return html`<h3 class=${cls}>${trigger}</h3>`;
    }
  }

  render() {
    const contentId = `${this.id}-content`;
    const buttonId = `${this.id}-button`;

    const trigger = html`<button
      id=${buttonId}
      class="nys-accordionitem__heading"
      type="button"
      @click=${this._handleExpand}
      @keydown=${this._handleKeydown}
      aria-expanded=${this.expanded ? "true" : "false"}
      aria-controls=${contentId}
    >
      <span class="nys-accordionitem__heading-title">${this.heading}</span>
      <nys-icon class="expand-icon" name="chevron_down" size="24"></nys-icon>
    </button>`;

    return html`
      <div class="nys-accordionitem">
        ${this._renderHeading(trigger)}
        <!--
          The panel is a labelled region so it can be reached from the landmark
          list, named by the trigger that opens it. A collapsed panel is
          visibility:hidden, so it contributes no landmark at all: the list only
          ever holds the panels a user has actually opened (at most one under
          singleSelect), which is why the role is unconditional here.
        -->
        <div
          id=${contentId}
          class="nys-accordionitem__content ${this.expanded
            ? "expanded"
            : "collapsed"}"
          role="region"
          aria-labelledby=${buttonId}
          @nys-child-resize=${this._updateHeight}
        >
          <div class="nys-accordionitem__content-slot-container">
            <div class="nys-accordionitem__content-slot-container-text">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("nys-accordionitem")) {
  customElements.define("nys-accordionitem", NysAccordionItem);
}
