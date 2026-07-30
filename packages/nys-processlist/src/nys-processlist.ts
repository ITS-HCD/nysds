import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { NysProcesslistitem } from "./nys-processlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-processlist.light.scss?inline";

let componentIdCounter = 0;

let _lightSheet: CSSStyleSheet | null = null;
// Injects the light-DOM styling for <nys-processlist> into a single constructed
// stylesheet adopted on the document. Guarded so it runs once regardless of how
// many lists mount, and skipped during SSR where `document` is undefined.
function adoptLightStyles() {
  if (_lightSheet || typeof document === "undefined") return;
  _lightSheet = new CSSStyleSheet();
  _lightSheet.replaceSync(lightStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, _lightSheet];
}

/**
 * A process list is a component that displays a sequence of numbered steps, making it easy to communicate a multi-step process across web projects.
 *
 * Add `<nys-processlistitem>` elements as children. Each item takes a `label` and an optional
 * `description`. Steps are numbered by the list — from 1, or from `initialStep` — so items never
 * set their own number.
 *
 * @summary An ordered list of numbered process steps.
 * @element nys-processlist
 *
 * Children: one or more `<nys-processlistitem>` elements, kept in light DOM so the
 * `list`/`listitem` roles stay directly related in the accessibility tree. The
 * host itself is the `role="list"` container and renders in the light DOM, so
 * its styling comes from `nys-processlist.light.scss` adopted once onto
 * `document.adoptedStyleSheets` rather than from a shadow-DOM stylesheet.
 *
 * A list carries no accessible name of its own. Give one with `ariaLabel`, or with
 * `ariaLabelledBy` pointing at the visible heading above the list, so screen reader users can
 * tell what the process is and distinguish it from any other list on the page. Use
 * `ariaDescribedBy` for supporting copy such as an intro paragraph.
 *
 * @example Basic
 * ```html
 * <nys-processlist id="application-steps">
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Accessible Name
 * ```html
 * <nys-processlist id="application-steps-labelled" aria-label="Application steps">
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Accessible Name and Description
 * When a visible heading and intro paragraph already describe the process, point at them rather
 * than repeating the text, so the accessible name cannot drift from the visible one.
 * ```html
 * <h2 id="process-heading">Super duper app process</h2>
 * <p id="process-intro">
 *   In order to complete this process you will need 3.5 number 2 pencils and a glass of lemonade.
 * </p>
 *
 * <nys-processlist
 *   id="application-steps-described"
 *   aria-labelledby="process-heading"
 *   aria-describedby="process-intro"
 * >
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Description
 * ```html
 * <nys-processlist id="application-steps2">
 *   <nys-processlistitem
 *     label="Gather your documents"
 *     description="Recent pay stubs and a current property tax bill."
 *   ></nys-processlistitem>
 *   <nys-processlistitem
 *     label="Complete the application"
 *     description="Most applicants finish in about 20 minutes."
 *   ></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Description Slot
 * ```html
 * <nys-processlist id="application-steps-desc-slot">
 *   <nys-processlistitem label="Gather your documents">
 *     <div slot="description">Recent pay stubs and a <strong>current</strong> property tax bill.</div>
 *   </nys-processlistitem>
 *   <nys-processlistitem label="Complete the application">
 *     <div slot="description">Most applicants finish in about <a href="https://www.ny.gov">20 minutes</a>.</div>
 *   </nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Size Small
 * ```html
 * <nys-processlist id="application-steps-sm" size="sm">
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Strong
 * ```html
 * <nys-processlist id="application-steps-strong" strong>
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Neutral
 * ```html
 * <nys-processlist id="application-steps-neutral" neutral>
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Strong Neutral
 * ```html
 * <nys-processlist id="application-steps-strong-neutral" strong neutral>
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 * @example Initial Step
 * One process is sometimes interrupted by content that cannot live inside the list —
 * an intermission, a callout, a form. Splitting it into two lists would restart the
 * numbering at 1 and read as two separate processes, so the second list picks up where
 * the first left off. Two lists on one page means each needs its own accessible name.
 * ```html
 * <nys-processlist
 *   id="application-steps-part1"
 *   aria-label="Application steps, part 1"
 * >
 *   <nys-processlistitem label="Gather your documents"></nys-processlistitem>
 *   <nys-processlistitem label="Complete the application"></nys-processlistitem>
 *   <nys-processlistitem label="Submit and await review"></nys-processlistitem>
 * </nys-processlist>
 *
 * <p>OK, intermission time. Get up, stretch, and drink the glass of lemonade.</p>
 *
 * <nys-processlist
 *   id="application-steps-part2"
 *   initialstep="4"
 *   aria-label="Application steps, part 2"
 * >
 *   <nys-processlistitem label="Okay let's continue"></nys-processlistitem>
 *   <nys-processlistitem label="Wow, this might be tricky"></nys-processlistitem>
 *   <nys-processlistitem label="Cool cool, I got this thing"></nys-processlistitem>
 * </nys-processlist>
 * ```
 *
 */

export class NysProcesslist extends LitElement {
  /**
   * Unique identifier. Auto-generated if not provided.
   */
  @property({ type: String, reflect: true }) id = "";

  /**
   * Renders each step number in a bolder, higher-emphasis color.
   */
  @property({ type: Boolean, reflect: true }) strong = false;

  /**
   * Renders each step number using neutral (grayscale) coloring instead of the theme color.
   */
  @property({ type: Boolean, reflect: true }) neutral = false;

  /**
   * Step marker size: `sm` (smaller) or `md` (default).
   */
  @property({ type: String, reflect: true }) size: "md" | "sm" = "md";

  /**
   * Number given to the first step. Subsequent steps count up from it. Use this when one
   * process is split across several lists so the later lists continue the count instead of
   * restarting at 1.
   */
  @property({ type: Number, reflect: true }) initialStep = 1;

  /**
   * Accessible name for the list, e.g. "Application steps". A list has no name of its own, so
   * give one whenever the surrounding content does not already make the list's purpose obvious —
   * especially when a page holds more than one process list.
   *
   * Sets `aria-label` on the host. Use `ariaLabelledBy` instead when a visible heading already
   * names the list.
   */
  @property({ type: String, reflect: true, attribute: "aria-label" })
  ariaLabel: string | null = null;

  /**
   * Space-separated IDs of the elements that name the list, typically the visible heading above
   * it. Preferred over `ariaLabel` when such a heading exists, so the accessible name and the
   * visible one cannot drift apart.
   *
   * Sets `aria-labelledby` on the host.
   */
  @property({ type: String, reflect: true, attribute: "aria-labelledby" })
  ariaLabelledBy: string | null = null;

  /**
   * Space-separated IDs of the elements that describe the list, such as the intro paragraph
   * explaining what the process involves. A description supplements the name; it does not
   * replace it.
   *
   * Sets `aria-describedby` on the host.
   */
  @property({ type: String, reflect: true, attribute: "aria-describedby" })
  ariaDescribedBy: string | null = null;

  private _childObserver = new MutationObserver(() => this._syncSteps());

  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    adoptLightStyles();
    if (!this.id) {
      this.id = `nys-processlist-${Date.now()}-${componentIdCounter++}`;
    }
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }

    this._childObserver.observe(this, { childList: true });
    this._syncSteps();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._childObserver.disconnect();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has("initialStep")) {
      this._syncSteps();
    }
  }

  // Ordering lives on the list, not the item, so numbers stay correct when
  // items are added, removed, or reordered.
  private _syncSteps() {
    const items = Array.from(this.children).filter(
      (el): el is NysProcesslistitem =>
        el.tagName.toLowerCase() === "nys-processlistitem",
    );

    // A non-numeric or non-positive `initialStep` would render a nonsense
    // sequence, so fall back to the default rather than propagate it.
    const start =
      Number.isFinite(this.initialStep) && this.initialStep >= 1
        ? Math.floor(this.initialStep)
        : 1;

    items.forEach((item, index) => {
      item.setStep(index + start);
    });
  }
}

if (!customElements.get("nys-processlist")) {
  customElements.define("nys-processlist", NysProcesslist);
}
