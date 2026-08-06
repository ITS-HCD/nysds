import { expect, html, fixture, aTimeout } from "@open-wc/testing";
import "../dist/nys-pagination.js";
// The page controls are `nys-button`s; the aria-current and focus assertions below
// reach the real <button> inside them, so the definition has to be loaded.
import "@nysds/nys-button";
import { NysPagination } from "./nys-pagination.js";
// Explicitly registered so the mobile prev/next nys-buttons upgrade in this
// test file even if that ever stops happening transitively through the
// package's own dist bundle.
import "@nysds/nys-button";

/** The real control assistive tech interacts with, inside a `nys-button`. */
const innerButton = (host: Element | null | undefined) =>
  host?.shadowRoot?.querySelector("button") ?? null;

/** The `nys-button` that navigates to a given page. */
const pageButton = (el: NysPagination, page: number) =>
  el.shadowRoot!.querySelector<HTMLElement>(`nys-button[data-page="${page}"]`);

const isVisible = (el: Element | null | undefined): el is HTMLElement =>
  !!el && (el as HTMLElement).getClientRects().length > 0;

/**
 * The Previous/Next control this viewport actually shows. The suite runs at desktop
 * and phone sizes, and the layout swaps the labelled desktop controls for icon-only
 * mobile twins below 768px.
 */
const stepControl = (el: NysPagination, ids: string[]) =>
  ids.map((id) => el.shadowRoot!.getElementById(id)).find(isVisible) ?? null;

/** Settle the component and the `nys-button`s it renders, including focus restore. */
const settle = async (el: NysPagination) => {
  await el.updateComplete;
  await aTimeout(0);
};

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-pagination", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-pagination></nys-pagination>`);
    expect(el).to.exist;
  });

  it("has correct default values", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination></nys-pagination>`,
    );
    expect(el.currentPage).to.equal(1);
    expect(el.totalPages).to.equal(1);
  });

  it("has correct passed in values", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="4" totalPages="10"></nys-pagination>`,
    );
    expect(el.currentPage).to.equal(4);
    expect(el.totalPages).to.equal(10);
  });

  it("clamps currentPage between 1 and totalPages", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination totalPages="5"></nys-pagination>`,
    );
    el.currentPage = -10;
    await el.updateComplete;
    expect(el.currentPage).to.equal(1);

    el.currentPage = 999;
    await el.updateComplete;
    expect(el.currentPage).to.equal(5);
  });

  it("ensures totalPages is at least 1", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination totalPages="0" currentPage="1"></nys-pagination>`,
    );
    expect(el.totalPages).to.equal(1);
  });

  it("disables Previous button on first page", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="1" totalPages="5"></nys-pagination>`,
    );
    const prev = el.shadowRoot!.querySelector("#previous");
    expect(prev).to.have.attribute("disabled");
  });

  it("disables Next button on last page", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="5" totalPages="5"></nys-pagination>`,
    );
    const next = el.shadowRoot!.querySelector("#next");
    expect(next).to.have.attribute("disabled");
  });

  it("renders page buttons with current page filled", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="2" totalPages="3"></nys-pagination>`,
    );
    const btns = el.shadowRoot!.querySelectorAll("nys-button");
    expect(Array.from(btns).some((b) => b.getAttribute("variant") === "filled"))
      .to.be.true;
  });

  it("_handlePageClick updates currentPage, clamps it, and fires nys-change with correct detail", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="3" totalPages="5"></nys-pagination>`,
    );
    await el.updateComplete;

    let eventDetail: any = null;
    el.addEventListener("nys-change", (e: any) => (eventDetail = e.detail));

    // Normal click — page within range
    const btn = el.shadowRoot!.querySelector("#current-page") as HTMLElement;
    btn.dispatchEvent(new CustomEvent("nys-click", { bubbles: true }));
    await el.updateComplete;

    expect(el.currentPage).to.equal(3);
    expect(eventDetail).to.exist;
    expect(eventDetail.page).to.equal(3);

    // Out-of-range click — clamp kicks in
    eventDetail = null;
    (el as any)._handlePageClick(999);
    await el.updateComplete;

    expect(el.currentPage).to.equal(5);
    expect(eventDetail.page).to.equal(5);
  });

  it("wraps controls in a nav landmark with an accessible name", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="1" totalPages="5"></nys-pagination>`,
    );
    const nav = el.shadowRoot!.querySelector("nav");
    expect(nav).to.exist;
    expect(nav).to.have.attribute("aria-label", "Pagination");
  });

  // --- Regression: WCAG 4.1.2 — aria-current reaches the control, not the host ---
  // aria-current on the <nys-button> host reached nothing assistive tech can see: a
  // custom element with no role does not map its ARIA into the accessibility tree, and
  // host ARIA does not cross into the shadow root. It has to land on the internal
  // <button> the user actually operates (#1104).

  it("marks the current page with aria-current=page on the internal button", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="3" totalPages="5"></nys-pagination>`,
    );
    await settle(el);

    const current = el.shadowRoot!.querySelector("#current-page");
    expect(innerButton(current)).to.have.attribute("aria-current", "page");

    // Only the current page announces itself as current.
    const buttons = Array.from(el.shadowRoot!.querySelectorAll("nys-button"));
    const marked = buttons.filter((btn) =>
      innerButton(btn)?.hasAttribute("aria-current"),
    );
    expect(marked.length).to.equal(1);
  });

  it("applies aria-current=page to the first page when it is current", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="1" totalPages="5"></nys-pagination>`,
    );
    await settle(el);

    expect(innerButton(pageButton(el, 1))).to.have.attribute(
      "aria-current",
      "page",
    );
  });

  it("moves aria-current as the page changes", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="1" totalPages="10"></nys-pagination>`,
    );
    await settle(el);

    el.currentPage = 4;
    await settle(el);

    expect(innerButton(pageButton(el, 1))).to.not.have.attribute(
      "aria-current",
    );
    expect(innerButton(pageButton(el, 4))).to.have.attribute(
      "aria-current",
      "page",
    );
  });

  // --- Regression: the ellipsis is not a control (#1104) ---

  it("renders the ellipsis as inert text rather than a button", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="5" totalPages="10"></nys-pagination>`,
    );
    await settle(el);

    for (const id of ["first-spacer", "last-spacer"]) {
      const spacer = el.shadowRoot!.getElementById(id);
      expect(spacer, id).to.exist;
      expect(spacer!.tagName, id).to.equal("SPAN");
      expect(spacer, id).to.have.attribute("aria-hidden", "true");
      // No shadow root means no internal <button>, so no stop in the tab order.
      expect(spacer!.shadowRoot, id).to.equal(null);
    }

    const spacerButtons = el.shadowRoot!.querySelectorAll("nys-button.spacer");
    expect(spacerButtons.length).to.equal(0);
  });

  // --- Regression: focus management (#1104) ---
  // Three ways focus was pulled out from under a keyboard user: the window of page
  // numbers slides so the button holding focus by DOM position now navigates
  // somewhere else; Previous/Next disable themselves on the terminal pages and drop
  // focus to <body>; and the ellipsis was a button that did nothing.

  it("keeps focus on the page the user activated when the last page is chosen", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="5" totalPages="10"></nys-pagination>`,
    );
    await settle(el);

    // The last page button sits at the end of a 7-item row and at the end of a
    // 4-item one after activation: the element that held focus is gone entirely.
    const last = pageButton(el, 10)!;
    last.focus();
    expect(el.shadowRoot!.activeElement, "precondition").to.equal(last);

    last.dispatchEvent(new CustomEvent("nys-click", { bubbles: true }));
    await settle(el);

    expect(el.currentPage).to.equal(10);
    expect(el.shadowRoot!.activeElement).to.equal(pageButton(el, 10));
    expect(innerButton(pageButton(el, 10))).to.have.attribute(
      "aria-current",
      "page",
    );
  });

  it("keeps focus on the page the user activated past page 2", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="2" totalPages="10"></nys-pagination>`,
    );
    await settle(el);

    // The reported repro: activating page 3 inserts the leading ellipsis, so the
    // button that keeps focus by position is the one now labelled "2".
    const three = pageButton(el, 3);
    // Hidden by the mobile layout, which shows only first/current/last; the
    // last-page case above covers the same slide at phone sizes.
    if (!isVisible(three)) return;

    three.focus();
    expect(el.shadowRoot!.activeElement, "precondition").to.equal(three);

    three.dispatchEvent(new CustomEvent("nys-click", { bubbles: true }));
    await settle(el);

    expect(el.currentPage).to.equal(3);
    expect(el.shadowRoot!.activeElement).to.equal(pageButton(el, 3));
  });

  it("moves focus to the current page when Next disables itself", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="9" totalPages="10"></nys-pagination>`,
    );
    await settle(el);

    const next = stepControl(el, ["next", "next--mobile"])!;
    expect(next, "precondition").to.exist;
    next.focus();
    expect(el.shadowRoot!.activeElement, "precondition").to.equal(next);

    next.dispatchEvent(new CustomEvent("nys-click", { bubbles: true }));
    await settle(el);

    expect(next).to.have.attribute("disabled");
    expect(el.shadowRoot!.activeElement).to.equal(pageButton(el, 10));
  });

  it("moves focus to the current page when Previous disables itself", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="2" totalPages="10"></nys-pagination>`,
    );
    await settle(el);

    const previous = stepControl(el, ["previous", "previous--mobile"])!;
    expect(previous, "precondition").to.exist;
    previous.focus();
    expect(el.shadowRoot!.activeElement, "precondition").to.equal(previous);

    previous.dispatchEvent(new CustomEvent("nys-click", { bubbles: true }));
    await settle(el);

    expect(previous).to.have.attribute("disabled");
    expect(el.shadowRoot!.activeElement).to.equal(pageButton(el, 1));
  });

  it("leaves focus alone when the page changes programmatically", async () => {
    const wrapper = await fixture(html`
      <div>
        <button id="outside">outside</button>
        <nys-pagination currentPage="5" totalPages="10"></nys-pagination>
      </div>
    `);
    const el = wrapper.querySelector<NysPagination>("nys-pagination")!;
    const outside = wrapper.querySelector<HTMLButtonElement>("#outside")!;
    await settle(el);

    outside.focus();
    el.currentPage = 7;
    await settle(el);

    expect(document.activeElement).to.equal(outside);
    expect(el.shadowRoot!.activeElement).to.equal(null);
  });

  it("auto-generates an id when none is provided", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination totalPages="5"></nys-pagination>`,
    );
    expect(el.id).to.match(/^nys-pagination-\d+-\d+$/);
  });

  it("preserves a consumer-provided id", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination id="my-pager" totalPages="5"></nys-pagination>`,
    );
    expect(el.id).to.equal("my-pager");
  });

  it("gives the icon-only mobile Previous/Next buttons a real accessible name", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="5" totalPages="10"></nys-pagination>`,
    );
    await el.updateComplete;

    const prev = el.shadowRoot!.getElementById(
      "previous--mobile",
    ) as HTMLElement;
    const next = el.shadowRoot!.getElementById("next--mobile") as HTMLElement;

    // These buttons render icon-only (no `label`, so nys-button falls back to
    // its default slot). The accessible name has to come from content that
    // actually lands in that slot — not a dead `ariaLabel` attribute nys-button
    // never forwards to the internal <button>.
    const prevSlot = prev.shadowRoot?.querySelector(
      "slot.nys-button__default-slot",
    ) as HTMLSlotElement | null;
    const nextSlot = next.shadowRoot?.querySelector(
      "slot.nys-button__default-slot",
    ) as HTMLSlotElement | null;

    const prevName = prevSlot
      ?.assignedElements({ flatten: true })
      .map((n) => n.textContent?.trim())
      .join("");
    const nextName = nextSlot
      ?.assignedElements({ flatten: true })
      .map((n) => n.textContent?.trim())
      .join("");

    expect(prevName).to.equal("Previous Page");
    expect(nextName).to.equal("Next Page");

    // Neither button carries the old dead attribute anymore.
    expect(prev.hasAttribute("arialabel")).to.be.false;
    expect(next.hasAttribute("arialabel")).to.be.false;
  });

  it("does not leave dead ariaLabel attributes on the desktop Previous/Next or page-number buttons", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="2" totalPages="5"></nys-pagination>`,
    );
    await el.updateComplete;

    // These buttons already have a real accessible name from the visible
    // `label` prop ("Previous", "Next", the page number). The old `ariaLabel`
    // attribute never reached nys-button and is now removed rather than left
    // behind as misleading dead markup.
    const buttons = el.shadowRoot!.querySelectorAll("nys-button");
    for (const button of Array.from(buttons)) {
      expect(button.hasAttribute("arialabel"), button.id || "(page button)")
        .to.be.false;
    }
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-pagination></nys-pagination>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
