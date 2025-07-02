import { expect, html, fixture } from "@open-wc/testing";
import { nextFrame } from "@open-wc/testing-helpers";

import "../dist/nys-stepper.js";
import { NysStepper } from "../dist/nys-stepper.js";
// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-stepper", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-stepper></nys-stepper>`);
    expect(el).to.exist;
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

  it("does not allow child elements of other types", async () => {
    const el = await fixture(html`
      <nys-stepper>
        <p>this is not allowed</p>
        <nys-step label="Step 1"></nys-step>
        <nys-step label="Step 2"></nys-step>
      </nys-stepper>
    `);

    await nextFrame();

    expect(el.querySelector("div")).to.not.exist;
  });

  it("allows a slot named actions", async () => {
    const el = await fixture(html`
      <nys-stepper>
        <nys-step label="Step 1"></nys-step>
        <nys-step label="Step 2"></nys-step>
        <div slot="actions"><nys-button></nys-button></div>
      </nys-stepper>
    `);

    const actionsSlot = el.shadowRoot?.querySelector(
      '[slot="actions"]',
    ) as HTMLDivElement;
    expect(actionsSlot).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-stepper label="My Label"></nys-stepper>`,
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
