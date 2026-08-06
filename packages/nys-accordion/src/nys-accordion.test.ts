import {
  expect,
  html,
  fixture,
  oneEvent,
  nextFrame,
  aTimeout,
} from "@open-wc/testing";
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
    await nextFrame();

    const contentContainer = (el as any)._contentContainer;

    // Add new slotted content to trigger slotchange
    const newContent = document.createElement("p");
    newContent.textContent = "New content";
    el.appendChild(newContent);
    await el.updateComplete;
    await nextFrame();

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

  // --- Accessibility regression tests (WAI-ARIA Accordion pattern) ---

  it("auto-generates an id on the accordion container in the <tag>-n-n format", async () => {
    const el = await fixture<NysAccordion>(
      html`<nys-accordion></nys-accordion>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-accordion-\d+-\d+$/);
  });

  it("auto-generates an id on the accordion item in the <tag>-n-n format", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem></nys-accordionitem>`,
    );
    await el.updateComplete;

    expect(el.id).to.match(/^nys-accordionitem-\d+-\d+$/);
  });

  it("wraps the toggle button in a real h3 heading by default", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem heading="Heading test"></nys-accordionitem>`,
    );
    await el.updateComplete;

    const heading = el.shadowRoot?.querySelector(".nys-accordionitem__title");
    expect(heading, "heading wrapper exists").to.exist;
    expect(heading?.tagName).to.equal("H3");

    // No ARIA stand-in: the element itself carries the heading semantics.
    expect(heading?.hasAttribute("role")).to.be.false;
    expect(heading?.hasAttribute("aria-level")).to.be.false;

    // The button must be contained within the heading element.
    const button = heading?.querySelector(".nys-accordionitem__heading");
    expect(button, "button is inside the heading element").to.exist;
  });

  it("honors a headingLevel set on the item", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem
        heading="Heading test"
        headingLevel="h2"
      ></nys-accordionitem>`,
    );
    await el.updateComplete;

    const heading = el.shadowRoot?.querySelector(".nys-accordionitem__title");
    expect(heading?.tagName).to.equal("H2");
  });

  it("renders every supported heading level", async () => {
    for (const level of ["h2", "h3", "h4", "h5", "h6"]) {
      const el = await fixture<NysAccordionItem>(
        html`<nys-accordionitem heading="Level" .headingLevel=${level as any}>
        </nys-accordionitem>`,
      );
      await el.updateComplete;

      const heading = el.shadowRoot?.querySelector(".nys-accordionitem__title");
      expect(heading?.tagName.toLowerCase()).to.equal(level);
    }
  });

  it("falls back to h3 when headingLevel is out of range", async () => {
    // h1 and h7+ are outside the pattern's range; markup can still ask for them.
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem
        heading="Heading test"
        .headingLevel=${"h9" as any}
      ></nys-accordionitem>`,
    );
    await el.updateComplete;

    const heading = el.shadowRoot?.querySelector(".nys-accordionitem__title");
    expect(heading?.tagName).to.equal("H3");

    // h1 is excluded on purpose: an accordion trigger is not the page title.
    const h1 = await fixture<NysAccordionItem>(
      html`<nys-accordionitem
        heading="Heading test"
        .headingLevel=${"h1" as any}
      ></nys-accordionitem>`,
    );
    await h1.updateComplete;

    expect(
      h1.shadowRoot?.querySelector(".nys-accordionitem__title")?.tagName,
    ).to.equal("H3");
  });

  it("inherits headingLevel from the parent nys-accordion", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion headingLevel="h4">
        <nys-accordionitem heading="Item 1"></nys-accordionitem>
        <nys-accordionitem heading="Item 2"></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-accordionitem");
    for (const item of items) {
      await (item as any).updateComplete;
      const heading = item.shadowRoot?.querySelector(
        ".nys-accordionitem__title",
      );
      expect(heading?.tagName).to.equal("H4");
    }
  });

  it("lets an item override the group's headingLevel", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion headingLevel="h2">
        <nys-accordionitem heading="Follows the group"></nys-accordionitem>
        <nys-accordionitem
          heading="Sets its own"
          headingLevel="h5"
        ></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll("nys-accordionitem");
    await (items[0] as any).updateComplete;
    await (items[1] as any).updateComplete;

    expect(
      items[0].shadowRoot?.querySelector(".nys-accordionitem__title")?.tagName,
    ).to.equal("H2");
    expect(
      items[1].shadowRoot?.querySelector(".nys-accordionitem__title")?.tagName,
    ).to.equal("H5");
  });

  it("re-levels its items when the group's headingLevel changes", async () => {
    const el = await fixture<NysAccordion>(html`
      <nys-accordion>
        <nys-accordionitem heading="Item 1"></nys-accordionitem>
      </nys-accordion>
    `);
    await el.updateComplete;

    const item = el.querySelector("nys-accordionitem") as NysAccordionItem;
    await item.updateComplete;
    expect(
      item.shadowRoot?.querySelector(".nys-accordionitem__title")?.tagName,
    ).to.equal("H3");

    el.headingLevel = "h6";
    await el.updateComplete;
    await item.updateComplete;

    expect(
      item.shadowRoot?.querySelector(".nys-accordionitem__title")?.tagName,
    ).to.equal("H6");
  });

  it("defaults the group's headingLevel to h3 and reflects it", async () => {
    const el = await fixture<NysAccordion>(
      html`<nys-accordion headingLevel="h4"></nys-accordion>`,
    );
    await el.updateComplete;

    expect(el.headingLevel).to.equal("h4");
    expect(el.getAttribute("headinglevel")).to.equal("h4");

    const bare = await fixture<NysAccordion>(
      html`<nys-accordion></nys-accordion>`,
    );
    expect(bare.headingLevel).to.equal("h3");
  });

  it("labels the region panel via aria-labelledby pointing at the toggle button", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem heading="Region label"></nys-accordionitem>`,
    );
    await el.updateComplete;

    const region = el.shadowRoot?.querySelector('[role="region"]');
    const button = el.shadowRoot?.querySelector(".nys-accordionitem__heading");

    expect(region, "region exists").to.exist;
    expect(button?.id, "button has an id").to.not.be.empty;

    const labelledby = region?.getAttribute("aria-labelledby");
    expect(labelledby).to.equal(button?.id);
  });

  it("names the region with the trigger's own text", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem
        heading="Who needs a license?"
      ></nys-accordionitem>`,
    );
    await el.updateComplete;

    const region = el.shadowRoot?.querySelector('[role="region"]');
    const labelledby = region?.getAttribute("aria-labelledby") ?? "";
    const target = el.shadowRoot?.getElementById(labelledby);

    // A dangling IDREF would leave the landmark unnamed, so resolve it and
    // check the text a user agent would compute the name from.
    expect(target, "aria-labelledby resolves in the same root").to.exist;
    expect(target?.textContent?.trim()).to.equal("Who needs a license?");
  });

  it("keeps a collapsed panel out of the accessibility tree", async () => {
    // Landmark proliferation is bounded because collapsed panels are hidden:
    // only panels the user has opened contribute a region to the landmark list.
    const el = await fixture<NysAccordionItem>(html`
      <nys-accordionitem heading="Collapsed">
        <p>Panel content</p>
      </nys-accordionitem>
    `);
    await el.updateComplete;
    await nextFrame();

    const region = el.shadowRoot?.querySelector(
      '[role="region"]',
    ) as HTMLElement;
    expect(getComputedStyle(region).visibility).to.equal("hidden");

    el.expanded = true;
    await el.updateComplete;
    // Visibility is part of the panel's 300ms transition, so wait it out rather
    // than sampling a frame that may still be at progress 0.
    await aTimeout(400);

    expect(getComputedStyle(region).visibility).to.equal("visible");
  });

  it("keeps aria-controls on the button wired to the region panel id", async () => {
    const el = await fixture<NysAccordionItem>(
      html`<nys-accordionitem heading="Controls test"></nys-accordionitem>`,
    );
    await el.updateComplete;

    const button = el.shadowRoot?.querySelector(".nys-accordionitem__heading");
    const region = el.shadowRoot?.querySelector('[role="region"]');

    const controls = button?.getAttribute("aria-controls");
    expect(controls).to.equal(region?.id);
  });
});
