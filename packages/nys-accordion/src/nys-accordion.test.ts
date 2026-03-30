import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-accordion.js";
import { NysAccordionItem } from "./nys-accordionitem";
import { NysAccordion } from "./nys-accordion.js";

describe("nys-accordionitem", () => {
  it("renders the component", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem heading="My Title"></nys-accordionitem>`,
    );
    expect(el).to.exist;
    expect(el.expanded).to.be.false;
    expect(el.bordered).to.be.false;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem></nys-accordionitem>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-accordionitem-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysAccordionItem>(html`
      <nys-accordionitem
        heading="My Title"
        expanded
        bordered
      ></nys-accordionitem>
    `);
    expect(el.heading).to.equal("My Title");
    expect(el.expanded).to.be.true;
    expect(el.bordered).to.be.true;
  });

  it("propagates bordered to all child accordionitem elements", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion bordered>
        <nys-accordionitem heading="Item 1"></nys-accordionitem>
        <nys-accordionitem heading="Item 2"></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-accordionitem");
    items.forEach((item) => {
      expect((item as any).bordered).to.be.true;
    });
  });

  it("renders slot content", async () => {
    const el = await fixture<NysAccordionItem>(html`
      <nys-accordionitem heading="Slot Test">
        <p>Slot content here</p>
      </nys-accordionitem>
    `);
    const slotContent = el.querySelector("p");
    expect(slotContent?.textContent).to.include("Slot content here");
  });

  // Toggles open/close the component through the "expanded" prop
  it("toggles expanded state and emits nys-toggle when clicked", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem heading="Toggle Test"></nys-accordionitem>`,
    );
    const accordionHeader = el.shadowRoot?.querySelector(
      ".nys-accordionitem__heading",
    ) as HTMLElement;

    // Initial state: compress at start
    expect(el.expanded).to.be.false;

    // First click: expand the accordion
    const openEventListener = oneEvent(el, "nys-accordionitem-toggle");
    accordionHeader.click();
    const { detail } = await openEventListener;

    expect(detail).to.include({
      heading: "Toggle Test",
      expanded: true,
    });
    expect(el.expanded).to.be.true;

    // Second click: compress the accordion
    const closeEventListener = oneEvent(el, "nys-accordionitem-toggle");
    accordionHeader.click();
    const { detail: closeDetail } = await closeEventListener;

    expect(closeDetail).to.include({
      heading: "Toggle Test",
      expanded: false,
    });
    expect(el.expanded).to.be.false;
  });

  it("toggles expanded state and emits nys-toggle on keyboard (Enter/Space)", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem heading="Toggle Test"></nys-accordionitem>`,
    );
    const accordionHeader = el.shadowRoot?.querySelector(
      ".nys-accordionitem__heading",
    ) as HTMLElement;

    // Initial state: collapsed
    expect(el.expanded).to.be.false;

    // Press Enter to expand
    const enterEventListener = oneEvent(el, "nys-accordionitem-toggle");
    accordionHeader.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    const { detail } = await enterEventListener;

    expect(detail).to.include({
      heading: "Toggle Test",
      expanded: true,
    });
    expect(el.expanded).to.be.true;

    // Press Space to collapse
    const spaceEventListener = oneEvent(el, "nys-accordionitem-toggle");
    accordionHeader.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    const { detail: spaceDetail } = await spaceEventListener;

    expect(spaceDetail).to.include({
      heading: "Toggle Test",
      expanded: false,
    });
    expect(el.expanded).to.be.false;
  });

  it("calls _updateHeight when slot content changes and expanded is true", async () => {
    const el = await fixture<NysAccordionItem>(html`
      <nys-accordionitem heading="Item 1" expanded>
        <p>Initial content</p>
      </nys-accordionitem>
    `);
    await el.updateComplete;

    const contentContainer = (el as any)._contentContainer;

    // Add new slotted content to trigger slotchange
    const newContent = document.createElement("p");
    newContent.textContent = "New content";
    el.appendChild(newContent);
    await el.updateComplete;

    expect(contentContainer.style.height).to.not.equal("0");
    expect(contentContainer.style.height).to.equal(
      `${contentContainer.scrollHeight}px`,
    );
  });

  it("does not collapse other items when the toggled item is not expanded", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion singleSelect>
        <nys-accordionitem heading="Item 1" expanded></nys-accordionitem>
        <nys-accordionitem heading="Item 2" expanded></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-accordionitem");
    const firstHeader = (items[0] as any).shadowRoot?.querySelector(
      ".nys-accordionitem__heading",
    ) as HTMLElement;

    // Click to collapse item 1 (expanded -> false), other items should remain untouched
    firstHeader.click();
    await el.updateComplete;

    expect((items[0] as any).expanded).to.be.false;
    expect((items[1] as any).expanded).to.be.true;
  });

  it("collapses other expanded items when a new item is expanded in singleSelect mode", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion singleSelect>
        <nys-accordionitem heading="Item 1" expanded></nys-accordionitem>
        <nys-accordionitem heading="Item 2"></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-accordionitem");
    const secondHeader = (items[1] as any).shadowRoot?.querySelector(
      ".nys-accordionitem__heading",
    ) as HTMLElement;

    // Expand item 2 — item 1 should be collapsed
    secondHeader.click();
    await el.updateComplete;

    expect((items[0] as any).expanded).to.be.false;
    expect((items[1] as any).expanded).to.be.true;
  });

  it("does not collapse other items when singleSelect is false", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion>
        <nys-accordionitem heading="Item 1" expanded></nys-accordionitem>
        <nys-accordionitem heading="Item 2"></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-accordionitem");
    const secondHeader = (items[1] as any).shadowRoot?.querySelector(
      ".nys-accordionitem__heading",
    ) as HTMLElement;

    let eventDetail: any = null;
    el.addEventListener(
      "nys-accordionitem-toggle",
      (e: any) => (eventDetail = e.detail),
    );

    secondHeader.click();
    await el.updateComplete;

    expect(eventDetail).to.exist;
    expect(eventDetail.expanded).to.equal(true);

    // Both items should remain expanded — singleSelect is off
    expect((items[0] as any).expanded).to.be.true;
    expect((items[1] as any).expanded).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-accordionitem heading="My Label"></nys-accordionitem>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
