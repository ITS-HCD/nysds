import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-stepper.js";
import { NysStepper } from "./nys-stepper.js";
import { NysStep } from "./nys-step.js";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-stepper", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-stepper></nys-stepper>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysStepper>(html`<nys-stepper></nys-stepper>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-stepper-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysStepper>(html`
      <nys-stepper label="My Label" required optional></nys-stepper>
    `);
    expect(el.label).to.equal("My Label");
  });

  // child elements must be of type nys step
  it("allows child elements of type nys-step", async () => {
    const el = await fixture(html`
      <nys-stepper>
        <nys-step label="Step 1"></nys-step>
      </nys-stepper>
    `);
    expect(el.querySelector("nys-step")).to.exist;
  });

  it("allows a slot named actions", async () => {
    const el = await fixture(html`
      <nys-stepper>
        <nys-step label="Step 1"></nys-step>
        <nys-step label="Step 2"></nys-step>
        <div slot="actions"><nys-button></nys-button></div>
      </nys-stepper>
    `);

    const slot = el.shadowRoot?.querySelector(
      'slot[name="actions"]',
    ) as HTMLSlotElement;
    expect(slot).to.exist;

    const assignedElements = slot.assignedElements();
    expect(assignedElements.length).to.be.greaterThan(0);
    expect(assignedElements[0].tagName.toLowerCase()).to.equal("div");
    expect(assignedElements[0].getAttribute("slot")).to.equal("actions");
  });

   it("toggles compact view when counter is clicked", async () => {
    const el = await fixture<NysStepper>(html`
      <nys-stepper>
        <nys-step label="Step 1" current selected></nys-step>
        <nys-step label="Step 2"></nys-step>
      </nys-stepper>
    `);

    const counter = el.shadowRoot?.querySelector(".nys-stepper__counter") as HTMLElement;
    counter.click();
    await el.updateComplete;

    expect(el.isCompactExpanded).to.be.true;

    counter.click();
    await el.updateComplete;
    expect(el.isCompactExpanded).to.be.false;
  });

  it("handles Enter/Space key on counter to toggle compact", async () => {
    const el = await fixture<NysStepper>(html`
      <nys-stepper>
        <nys-step label="Step 1" current selected></nys-step>
        <nys-step label="Step 2"></nys-step>
      </nys-stepper>
    `);

    const counter = el.shadowRoot?.querySelector(
      ".nys-stepper__counter",
    ) as HTMLElement;

    counter.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.isCompactExpanded).to.be.true;

    counter.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.isCompactExpanded).to.be.false;
  });

  it("calls onClick if provided", async () => {
    let clicked = false;
    const el = await fixture<NysStep>(
      html`<nys-step label="Step" current></nys-step>`,
    );
    el.onClick = () => (clicked = true);

    const content = el.shadowRoot?.querySelector(".nys-step__contentwrapper")!;
    content.dispatchEvent(new Event("click", { bubbles: true }));

    expect(clicked).to.be.true;
  });

  it("dispatches nys-step-click only if step is previous or current and not selected", async () => {
    const el = await fixture<NysStep>(
      html`<nys-step label="Step" current></nys-step>`,
    );

    const content = el.shadowRoot?.querySelector(".nys-step__contentwrapper")!;
    setTimeout(
      () => content.dispatchEvent(new Event("click", { bubbles: true })),
      0,
    );

    const event = await oneEvent(el, "nys-step-click");
    expect(event).to.exist;
    expect(event.detail).to.deep.equal({ href: "", label: "Step" });
  });

  it("does not dispatch nys-step-click if already selected", async () => {
    const el = await fixture<NysStep>(
      html`<nys-step label="Step" current selected></nys-step>`,
    );

    let dispatched = false;
    el.addEventListener("nys-step-click", () => (dispatched = true));

    const content = el.shadowRoot?.querySelector(".nys-step__contentwrapper")!;
    content.dispatchEvent(new Event("click", { bubbles: true }));
    await el.updateComplete;

    expect(dispatched).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-stepper label="My Label"></nys-stepper>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
