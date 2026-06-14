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

    const counter = el.shadowRoot?.querySelector(
      ".nys-stepper__counter",
    ) as HTMLElement;
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

  it("wraps the steps in a named navigation landmark", async () => {
    const el = await fixture<NysStepper>(html`
      <nys-stepper label="Application">
        <nys-step label="Step 1" current selected></nys-step>
        <nys-step label="Step 2"></nys-step>
      </nys-stepper>
    `);
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav).to.exist;
    expect(nav?.getAttribute("aria-label")).to.equal("Application progress");
  });

  it("falls back to a generic nav label when no label is set", async () => {
    const el = await fixture<NysStepper>(html`
      <nys-stepper>
        <nys-step label="Step 1" current selected></nys-step>
      </nys-stepper>
    `);
    await el.updateComplete;

    const nav = el.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).to.equal("Progress");
  });
});

describe("nys-step accessibility", () => {
  it("generates an id if not provided", async () => {
    const el = await fixture<NysStep>(html`<nys-step label="Step"></nys-step>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-step-\d+-\d+$/);
  });

  it("marks the current step with aria-current='step'", async () => {
    const el = await fixture<NysStep>(
      html`<nys-step label="Personal Info" current></nys-step>`,
    );
    await el.updateComplete;

    const wrapper = el.shadowRoot?.querySelector(
      ".nys-step__contentwrapper",
    ) as HTMLElement;
    expect(wrapper.getAttribute("aria-current")).to.equal("step");
  });

  it("does not set aria-current on non-current steps", async () => {
    const el = await fixture<NysStep>(
      html`<nys-step label="Contact" selected></nys-step>`,
    );
    await el.updateComplete;

    const wrapper = el.shadowRoot?.querySelector(
      ".nys-step__contentwrapper",
    ) as HTMLElement;
    expect(wrapper.hasAttribute("aria-current")).to.be.false;
  });

  it("exposes the interactive step row to assistive tech (not aria-hidden)", async () => {
    const el = await fixture<NysStep>(
      html`<nys-step label="Personal Info" current></nys-step>`,
    );
    await el.updateComplete;

    const wrapper = el.shadowRoot?.querySelector(
      ".nys-step__contentwrapper",
    ) as HTMLElement;
    // The interactive element must be the row and must NOT be hidden.
    expect(wrapper.getAttribute("role")).to.equal("button");
    expect(wrapper.hasAttribute("aria-hidden")).to.be.false;
    // The label is no longer hidden or a redundant nested button.
    const label = el.shadowRoot?.querySelector(
      ".nys-step__label",
    ) as HTMLElement;
    expect(label.hasAttribute("aria-hidden")).to.be.false;
    expect(label.hasAttribute("role")).to.be.false;
  });

  it("makes navigable steps focusable and future steps inert", async () => {
    const current = await fixture<NysStep>(
      html`<nys-step label="Step 1" current></nys-step>`,
    );
    await current.updateComplete;
    const currentWrapper = current.shadowRoot?.querySelector(
      ".nys-step__contentwrapper",
    ) as HTMLElement;
    expect(currentWrapper.getAttribute("tabindex")).to.equal("0");
    expect(currentWrapper.getAttribute("aria-disabled")).to.equal("false");

    const future = await fixture<NysStep>(
      html`<nys-step label="Step 2"></nys-step>`,
    );
    await future.updateComplete;
    const futureWrapper = future.shadowRoot?.querySelector(
      ".nys-step__contentwrapper",
    ) as HTMLElement;
    expect(futureWrapper.getAttribute("tabindex")).to.equal("-1");
    expect(futureWrapper.getAttribute("aria-disabled")).to.equal("true");
  });

  it("includes the step number in the accessible name when assigned", async () => {
    const el = await fixture<NysStep>(
      html`<nys-stepper>
        <nys-step label="Personal Info" current></nys-step>
      </nys-stepper>`,
    );
    await (el as any).updateComplete;
    const step = el.querySelector("nys-step") as NysStep;
    await step.updateComplete;

    const wrapper = step.shadowRoot?.querySelector(
      ".nys-step__contentwrapper",
    ) as HTMLElement;
    expect(wrapper.getAttribute("aria-label")).to.equal(
      "Personal Info, step 1",
    );
  });
});
