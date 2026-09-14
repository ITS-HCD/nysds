import { PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { NysElement } from "@nysds/internals";
// Bare side-effect import: `NysProcesslistitem` below is used only in a type
// position (the `el is NysProcesslistitem` guard in `_syncSteps`), so a
// TS/esbuild import-elision pass can drop a plain named import entirely,
// leaving <nys-processlistitem> unregistered whenever nys-processlist is
// imported standalone. This import guarantees registration regardless.
import "./nys-processlistitem";
import { NysProcesslistitem } from "./nys-processlistitem";
// @ts-ignore: SCSS module imported via bundler as inline
import lightStyles from "./nys-processlist.light.scss?inline";

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

// Resolves once the browser has had a real chance to finish hydrating an
// SSR'd page (e.g. a React/Next.js host) before a light-DOM component
// performs its first render. A single requestAnimationFrame isn't reliable
// here: with streamed/RSC payloads, the segment containing this element can
// hydrate more than one frame after its module (and thus this custom
// element) registers. requestIdleCallback waits for the main thread to
// actually go quiet, which covers that case; a capped timeout keeps a busy
// page from deferring indefinitely. Safari has no requestIdleCallback, so it
// falls back to a double rAF (one frame is what MDN/Web.dev document as the
// minimum "next paint" proxy; two gives hydration a second frame of margin).
function waitPastHydration(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 300 });
    } else if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    } else {
      resolve();
    }
  });
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
 * A list carries no accessible name of its own. Give one with `aria-label`, or with
 * `aria-labelledby` pointing at the visible heading above the list, so screen reader users can
 * tell what the process is and distinguish it from any other list on the page. Use
 * `aria-describedby` for supporting copy such as an intro paragraph. Because the host renders
 * in the light DOM, these native attributes work with zero component code.
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

export class NysProcesslist extends NysElement {
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

  private _childObserver = new MutationObserver(() => this._syncSteps());

  // Tracks children we've already warned about so a MutationObserver churn
  // (or repeated updated() calls) doesn't spam the console for the same node.
  private _warnedChildren = new WeakSet<Element>();

  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }

  // Guards only the first update. This component renders into the light DOM
  // (see createRenderRoot), so connectedCallback would otherwise set the
  // host's `role` attribute and number its children's steps synchronously
  // during custom-element upgrade — before a framework's SSR hydration
  // (e.g. Next.js) finishes walking this same subtree, which reads as a
  // hydration mismatch (React error #418). Deferring the first update until
  // the main thread goes quiet (see waitPastHydration above) lets hydration
  // settle against the SSR-rendered markup first — Lit's own documented
  // pattern for retiming an update (see ReactiveElement.scheduleUpdate).
  // Later updates are unaffected.
  private _firstUpdatePending = true;

  protected async scheduleUpdate() {
    if (this._firstUpdatePending) {
      this._firstUpdatePending = false;
      await waitPastHydration();
    }
    super.scheduleUpdate();
  }

  connectedCallback() {
    // super.connectedCallback() (NysElement) assigns an auto id when
    // one is not provided, preserving the `nys-processlist-<ts>-<n>` shape.
    // Accessible-name attributes (aria-label, aria-labelledby, aria-describedby)
    // are not reflected as component properties: the host renders in the light
    // DOM, so those native attributes already work without any component code.
    super.connectedCallback();
    adoptLightStyles();
    this._childObserver.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._childObserver.disconnect();
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "list");
    }
    this._syncSteps();
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

    // light.scss hides any non-nys-processlistitem child with display:none,
    // which silently drops author content from the accessibility tree
    // (WCAG 1.3.1). Warn so the mistake is visible in dev.
    Array.from(this.children).forEach((el) => {
      if (
        el.tagName.toLowerCase() !== "nys-processlistitem" &&
        !this._warnedChildren.has(el)
      ) {
        this._warnedChildren.add(el);
        console.warn(
          `nys-processlist: <${el.tagName.toLowerCase()}> is not a <nys-processlistitem> and will be hidden (display: none), removing it from the accessibility tree. Only <nys-processlistitem> elements are supported as children.`,
          el,
        );
      }
    });

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
