import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-accordion.js";
import { NysAccordion } from "./nys-accordion";

describe("nys-accordion", () => {
  it("renders the component", async () => {
    const el = await fixture<NysAccordion>(
      html`<nys-accordion heading="My Title"></nys-accordion>`,
    );
    expect(el).to.exist;
    expect(el.expanded).to.be.false;
    expect(el.bordered).to.be.false;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion heading="My Title" expanded bordered></nys-accordion>
    `);
    expect(el.heading).to.equal("My Title");
    expect(el.expanded).to.be.true;
    expect(el.bordered).to.be.true;
  });

  it("renders slot content", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion heading="Slot Test">
        <p>Slot content here</p>
      </nys-accordion>
    `);
    const slotContent = el.querySelector("p");
    expect(slotContent?.textContent).to.include("Slot content here");
  });

  // Toggles open/close the component through the "expanded" prop
  it("toggles expanded state and emits nys-toggle when clicked", async () => {
    const el = await fixture<NysAccordion>(
      html`<nys-accordion heading="Toggle Test"></nys-accordion>`,
    );
    const accordionHeader = el.shadowRoot?.querySelector(
      ".nys-accordion__heading",
    ) as HTMLElement;

    // Initial state: compress at start
    expect(el.expanded).to.be.false;

    // First click: expand the accordion
    const openEventListener = oneEvent(el, "nys-accordionToggle");
    accordionHeader.click();
    const { detail } = await openEventListener;

    expect(detail).to.include({
      heading: "Toggle Test",
      expanded: true,
    });
    expect(el.expanded).to.be.true;

    // Second click: compress the accordion
    const closeEventListener = oneEvent(el, "nys-accordionToggle");
    accordionHeader.click();
    const { detail: closeDetail } = await closeEventListener;

    expect(closeDetail).to.include({
      heading: "Toggle Test",
      expanded: false,
    });
    expect(el.expanded).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-accordion heading="My Label"></nys-accordion>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  // Other test to consider:
  // - Test for default values
  // - Test for different attributes
  // - Test for events
  // - Test for methods
  // - Test for accessibility
  // - Test for slot content
  // - Test for lifecycle methods
});
