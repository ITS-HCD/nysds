import { html, unsafeCSS, nothing } from "lit";
import { NysElement } from "@nysds/internals";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { dispatchNysEvent } from "@nysds/internals";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-onthispage.scss?inline";

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";
type HashBehavior = "none" | "hash" | "replace";

interface TrackedHeading {
  id: string;
  label: string;
  el: HTMLElement;
}

/** Detail payload for the `nys-click` event. */
interface NysOnThisPageClickDetail {
  // The `id` of the target heading.
  id: string;
  // The link text, taken from the heading text.
  label: string;
  // Zero-based position of the link in the list.
  index: number;
}

/** The `nys-click` event, fired on a committed selection. */
export type NysOnThisPageClickEvent = CustomEvent<NysOnThisPageClickDetail>;

/**
 * `<nys-onthispage>` is an in-page navigation component.
 *
 * @fires {NysOnThisPageClickEvent} nys-click - A link was activated. `detail: { id, label, index }`
 *
 * @example Basic
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage style="flex: 0 0 220px;"></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *     <p>Use this guide to find out if you qualify and how to apply.</p>
 *
 *     <h2>Eligibility</h2>
 *     <p>You must be a New York State resident aged 18 or older.</p>
 *     <p>Additional eligibility requirements may apply.</p>
 *     <p>Review the requirements before submitting your application.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>Complete the online form and upload your supporting documents.</p>
 *     <p>Make sure all information is accurate before submitting.</p>
 *     <p>Keep a copy of your application for your records.</p>
 *
 *     <h2>Required documents</h2>
 *     <p>Bring a valid proof of identity, proof of address, and any other supporting documentation.</p>
 *     <p>Additional documents may be requested during review.</p>
 *     <p>Ensure your documents are current and legible.</p>
 *
 *     <h2>What happens next</h2>
 *     <p>We review applications within 10 business days.</p>
 *     <p>You may be contacted if additional information is needed.</p>
 *     <p>You will receive a notification when a decision has been made.</p>
 *   </main>
 * </div>
 * ```
 *
 * @example Sticky
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage sticky offset="24"></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *     <p>Use this guide to find out if you qualify and how to apply.</p>
 *
 *     <h2>Eligibility</h2>
 *     <p>You must be a New York State resident aged 18 or older.</p>
 *     <p style="min-height: 60vh;">Review the requirements before submitting your application.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>Complete the online form and upload your supporting documents.</p>
 *     <p style="min-height: 60vh;">Keep a copy of your application for your records.</p>
 *
 *     <h2>Required documents</h2>
 *     <p>Bring a valid proof of identity, proof of address, and any other supporting documentation.</p>
 *     <p style="min-height: 60vh;">Ensure your documents are current and legible.</p>
 *
 *     <h2>What happens next</h2>
 *     <p>We review applications within 10 business days.</p>
 *     <p style="min-height: 60vh;">You will receive a notification when a decision has been made.</p>
 *   </main>
 * </div>
 * ```
 *
 * @example Custom heading
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage
 *     heading="In this guide"
 *   ></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *
 *     <h2>Eligibility</h2>
 *     <p>You must be a New York State resident aged 18 or older.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>Complete the online form and upload your supporting documents.</p>
 *
 *     <h2>What happens next</h2>
 *     <p>We review applications within 10 business days.</p>
 *   </main>
 * </div>
 * ```
 *
 * @example Track a different heading level
 * ```html
 * <nys-onthispage headingTracker="h3" scope="#guide"></nys-onthispage>
 *
 * <article id="guide">
 *   <h1>Part 1 (h1 tag)</h1>
 *   <h2>Part 2 (h2 tag)</h2>
 *   <h3>Eligibility (h3 tag)</h3>
 *   <h3>How to apply (h3 tag)</h3>
 * </article>
 * ```
 *
 * @example Exclude a heading
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *
 *     <h2>Eligibility</h2>
 *     <p>You must be a New York State resident aged 18 or older.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>Complete the online form and upload your supporting documents.</p>
 *
 *     <h2 data-nys-onthispage-ignore>Related links</h2>
 *     <p>This heading does not appear in the list.</p>
 *   </main>
 * </div>
 * ```
 *
 * @example Use your own heading ids
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage style="flex: 0 0 220px;"></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *
 *     <h2 id="eligibility">Eligibility</h2>
 *     <p>The link uses your id: #eligibility.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>No id set, so one is generated: #how-to-apply.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>Same text, so the generated id gets a suffix: #how-to-apply-2.</p>
 *   </main>
 * </div>
 * ```
 *
 * @example Update the URL hash
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage
 *     hashBehavior="replace"
 *     style="flex: 0 0 220px;"
 *   ></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *
 *     <h2>Eligibility</h2>
 *     <p style="min-height: 80vh;">You must be a New York State resident.</p>
 *
 *     <h2>How to apply</h2>
 *     <p style="min-height: 80vh;">Complete the online form.</p>
 *
 *     <h2>What happens next</h2>
 *     <p style="min-height: 80vh;">We review applications within 10 business days.</p>
 *   </main>
 * </div>
 * ```
 * Clicking a link updates the URL to `#how-to-apply`, for example.
 * `hash` adds a history entry per click, `replace` does not, and `none`
 * (the default) leaves the URL alone.
 *
 * @example Turn off smooth scrolling
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage
 *     smoothScroll="false"
 *     style="flex: 0 0 220px;"
 *   ></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *
 *     <h2>Eligibility</h2>
 *     <p style="min-height: 80vh;">You must be a New York State resident.</p>
 *
 *     <h2>How to apply</h2>
 *     <p style="min-height: 80vh;">Complete the online form.</p>
 *
 *     <h2>What happens next</h2>
 *     <p style="min-height: 80vh;">We review applications within 10 business days.</p>
 *   </main>
 * </div>
 * ```
 * Smooth scrolling is also turned off automatically for visitors who have
 * `prefers-reduced-motion` enabled.
 *
 * @example Listen for link activation
 * ```html
 * <div style="display: flex; gap: 2rem; align-items: flex-start;">
 *   <nys-onthispage id="toc" style="flex: 0 0 220px;"></nys-onthispage>
 *
 *   <main style="flex: 1; min-width: 0;">
 *     <h1>Apply for a permit</h1>
 *
 *     <h2>Eligibility</h2>
 *     <p>You must be a New York State resident aged 18 or older.</p>
 *
 *     <h2>How to apply</h2>
 *     <p>Complete the online form and upload your supporting documents.</p>
 *
 *     <h2>What happens next</h2>
 *     <p>We review applications within 10 business days.</p>
 *   </main>
 * </div>
 *
 * <script>
 *   document.querySelector("#toc").addEventListener("nys-click", (e) => {
 *     const { id, label, index } = e.detail;
 *     console.log(`Clicked "${label}" (#${id}, position ${index})`);
 *   });
 * </script>
 * ```
 * For example, clicking "How to apply" logs: `Clicked "How to apply" (#how-to-apply, position 1)`.
 */

export class NysOnthispage extends NysElement {
  static styles = unsafeCSS(styles);

  /** Unique identifier. Auto-generated by the shared base if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Heading level to track and link. `h1` is excluded.
   * @default "h2"
   */ @property({ type: String }) headingTracker: HeadingTag = "h2";

  /** Nav heading text. */
  @property({ type: String }) heading = "On this page";

  /** CSS selector for the container whose headings are tracked. */
  @property({ type: String }) scope = "main";

  /** Pins the nav to the top of the viewport at least 600px. Desktop only! */
  @property({ type: Boolean, reflect: true }) sticky = false;

  /**
   * Distance (px) from the viewport top to the trigger line. Also sets
   * `scroll-margin-top` on tracked headings and the sticky `top` value.
   */
  @property({ type: Number }) offset = 80;

  /** Smooth-scroll is default. Users can use `prefers-reduced-motion` to toggle it off. */
  @property({
    type: Boolean,
    converter: (value) => value !== null && value !== "false",
  })
  smoothScroll = true;

  /** `hash` pushes history, `replace` updates the URL silently, `none` leaves it alone. */
  @property({ type: String }) hashBehavior: HashBehavior = "none";

  @state() private _items: TrackedHeading[] = [];
  @state() private _activeId: string | null = null;

  private _observer?: MutationObserver;
  private _scrollFrame = 0;
  private _rebuildFrame = 0;

  /** True while a link-click scroll is in flight, so scroll events don't override the clicked link. */
  private _holdingActive = false;
  private _holdTimer = 0;

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Automatic id generation is provided by NysElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(); // assigns an auto id when none is provided

    window.addEventListener("scroll", this._onScroll, { passive: true });
    window.addEventListener("resize", this._onScroll, { passive: true });

    this._observer = new MutationObserver(this._scheduleRebuild);
    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this._onScroll);
    window.removeEventListener("resize", this._onScroll);
    this._observer?.disconnect();
    cancelAnimationFrame(this._scrollFrame);
    cancelAnimationFrame(this._rebuildFrame);
    clearTimeout(this._holdTimer);
  }

  /**
   * Derive state BEFORE rendering.
   *
   * Anything computed from another property — a `@state`, a formatted label, a
   * filtered list — belongs here. Setting a reactive property in `updated()`
   * lands after the render finished, so Lit has to schedule a second one and
   * warns about it (see https://lit.dev/msg/change-in-update).
   *
   * Reserve `updated()` for work that needs the rendered DOM: measuring
   * layout, syncing a native element, or `ElementInternals` calls.
   */
  willUpdate(changeProperties: Map<string | number | symbol, unknown>) {
    if (
      changeProperties.has("scope") ||
      changeProperties.has("headingTracker")
    ) {
      this._rebuild();
    }

    if (changeProperties.has("offset")) {
      this.style.setProperty("--_nys-onthispage-offset", `${this.offset}px`);
      this._applyScrollMargin();
      this._computeActive();
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  private _getScope() {
    try {
      return document.querySelector(this.scope);
    } catch {
      return null;
    }
  }

  /**
   * Checks if the header element is trackable:
   * Meaning the element doesn't contain hidden data attribute, or is hidden, or is inside an accordion.
   * Visibility must be true.
   *
   * @returns {boolean} True if the element is trackable
   */
  private _isTrackable(el: HTMLElement): boolean {
    if (el.hasAttribute("data-nys-onthispage-ignore")) return false;
    if (el.closest("nys-accordion")) return false;
    if (el.closest("[hidden]")) return false;
    return el.getClientRects().length > 0 && !!el.textContent?.trim();
  }

  private _scheduleRebuild = () => {
    if (this._rebuildFrame) return;
    this._rebuildFrame = requestAnimationFrame(() => {
      this._rebuildFrame = 0;
      this._rebuild();
    });
  };

  // "How to apply!" -> "how-to-apply". Falls back to "section" if nothing is left. */
  private _slugify(text: string): string {
    return (
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section"
    );
  }

  private _applyScrollMargin() {
    for (const { el } of this._items) {
      el.style.scrollMarginTop = `${this.offset}px`;
    }
  }

  /***
   * Collects the headings, assigns ids where missing, and updates state if changed.
   * Rebuilds the content in this function.
   */
  private _rebuild = () => {
    const scopeEl = this._getScope();
    const targetHeaderTag = /^h[2-6]$/.test(this.headingTracker)
      ? this.headingTracker
      : "h2";
    const foundHeaders = scopeEl
      ? Array.from(
          scopeEl.querySelectorAll<HTMLElement>(targetHeaderTag),
        ).filter((el) => this._isTrackable(el))
      : [];

    // A set of header elements that we want to generate in the navigation
    // Note: existing ids always win, so reserve them before generating new ones.
    const usedId = new Set(foundHeaders.map((el) => el.id).filter(Boolean));

    /**
     * Generate "id" for any header element that doesn't have one.
     * Existing `id` always used as the link target. Headings without one get
     * a generated id, with `-2`, `-3` suffixes on collisions.
     */
    const items = foundHeaders.map((el) => {
      const label = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      if (!el.id) {
        const base = this._slugify(label);
        let candidateId = base;
        let n = 2;
        while (
          usedId.has(candidateId) ||
          document.getElementById?.(candidateId)
        ) {
          candidateId = `${base}-${n++}`;
        }
        el.id = candidateId;
        usedId.add(candidateId);
      }
      return { id: el.id, label, el };
    });

    // Skip the re-render when nothing changed.
    const isSameList =
      items.length === this._items.length &&
      items.every((item, index) => {
        return (
          item.id === this._items[index].id &&
          item.label === this._items[index].label &&
          item.el === this._items[index].el
        );
      });

    if (!isSameList) {
      this._items = items;
      this._applyScrollMargin();
      this._computeActive();
    }
  };

  /**
   * Active item = the last tracked heading with the top edge at or above the trigger line. Not "nearest to top" since that would flicker at the boundaries
   */
  private _computeActive() {
    let active: string | null = null;
    for (const item of this._items) {
      if (item.el.getBoundingClientRect().top <= this.offset + 1) {
        active = item.id;
      } else {
        break;
      }
    }

    // a short last section can never scroll up to the trigger line,
    // so at the bottom of the page the last heading counts as active.
    const atBottom =
      window.scrollY > 0 &&
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
    if (atBottom && this._items.length) {
      active = this._items[this._items.length - 1].id;
    }

    if (active !== this._activeId) this._activeId = active;
  }

  /**
   * Keeps the clicked link active until scrolling has been idle for 150ms.
   */
  private _holdActive() {
    this._holdingActive = true;
    clearTimeout(this._holdTimer);
    this._holdTimer = window.setTimeout(() => {
      this._holdingActive = false;
    }, 150);
  }

  private _onScroll = () => {
    if (this._holdingActive) {
      this._holdActive();
      return;
    }

    if (this._scrollFrame) return;
    this._scrollFrame = requestAnimationFrame(() => {
      this._scrollFrame = 0;
      this._computeActive();
    });
  };

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  private _handleClick(e: MouseEvent, item: TrackedHeading, index: number) {
    e.preventDefault();

    this._activeId = item.id;
    this._holdActive();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    item.el.scrollIntoView({
      behavior: this.smoothScroll && !reduceMotion ? "smooth" : "auto",
    });

    item.el.setAttribute("tabindex", "-1");
    item.el.focus({ preventScroll: true });

    if (this.hashBehavior === "hash") {
      history.pushState(null, "", `#${item.id}`);
    } else if (this.hashBehavior === "replace") {
      history.replaceState(null, "", `#${item.id}`);
    }

    dispatchNysEvent<NysOnThisPageClickDetail>(this, "nys-click", {
      id: item.id,
      label: item.label,
      index,
    });
  }

  render() {
    if (this._items.length < 2) return nothing;
    const headingId = `${this.id}--heading`;

    return html`
      <div class="nys-onthispage">
        <h2 id="${headingId}" class="nys-onthispage__heading">
          ${this.heading}
        </h2>
        <nav class="nys-onthispage__nav" aria-labelledby="${headingId}">
          <ul class="nys-onthispage__list">
            ${this._items.map((item, index) => {
              const active = this._activeId === item.id;
              return html`
                <li class="nys-onthispage__item ${active ? "active" : ""}">
                  <a
                    class="nys-onthispage__link ${active ? "active" : ""}"
                    href="#${item.id}"
                    data-text=${item.label}
                    aria-current=${ifDefined(active ? "location" : undefined)}
                    @click=${(e: MouseEvent) =>
                      this._handleClick(e, item, index)}
                    >${item.label}</a
                  >
                </li>
              `;
            })}
          </ul>
        </nav>
      </div>
    `;
  }
}

if (!customElements.get("nys-onthispage")) {
  customElements.define("nys-onthispage", NysOnthispage);
}
