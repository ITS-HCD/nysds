import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-pagination.js";
import { NysPagination } from "./nys-pagination.js";
// Explicitly registered so the mobile prev/next nys-buttons upgrade in this
// test file even if that ever stops happening transitively through the
// package's own dist bundle.
import "@nysds/nys-button";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

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

  it("marks the current page with aria-current=page", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="3" totalPages="5"></nys-pagination>`,
    );
    const current = el.shadowRoot!.querySelector("#current-page");
    expect(current).to.have.attribute("aria-current", "page");

    // Only the current page button should carry aria-current.
    const marked = el.shadowRoot!.querySelectorAll('[aria-current="page"]');
    expect(marked.length).to.equal(1);
  });

  it("applies aria-current=page to the first page when it is current", async () => {
    const el = await fixture<NysPagination>(
      html`<nys-pagination currentPage="1" totalPages="5"></nys-pagination>`,
    );
    const marked = el.shadowRoot!.querySelectorAll('[aria-current="page"]');
    expect(marked.length).to.equal(1);
    // The single aria-current element is the first page button (label "1").
    expect(marked[0].getAttribute("label")).to.equal("1");
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
