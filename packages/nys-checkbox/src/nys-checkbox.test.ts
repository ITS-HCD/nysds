import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-checkbox.js";
import { NysCheckbox } from "./nys-checkbox";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-checkbox", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-checkbox></nys-checkbox>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox label="My Label" required></nys-checkbox>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
  });

  it("tile prop render", async () => {
    const el = await fixture(html`
      <nys-checkboxgroup tile>
        <nys-checkbox label="My Label"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    expect(el.hasAttribute("tile")).to.be.true;
  });

  it("toggles checked state when clicked", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Toggle me"></nys-checkbox>`,
    );

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(input).to.exist;

    expect(el.checked).to.be.false;
    expect(input!.checked).to.be.false;

    // click to check
    input!.click();
    await el.updateComplete;

    expect(el.checked).to.be.true;
    expect(el.hasAttribute("checked")).to.be.true;
    expect(input!.checked).to.be.true;

    // click to uncheck
    input!.click();
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(el.hasAttribute("checked")).to.be.false;
    expect(input!.checked).to.be.false;
  });

  it("toggles checked state when Space key is pressed on input", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Toggle me"></nys-checkbox>`,
    );

    const input = await el.getInputElement();
    expect(el.checked).to.be.false;

    input!.dispatchEvent(
      new KeyboardEvent("keydown", { code: "Space", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.true;

    input!.dispatchEvent(
      new KeyboardEvent("keydown", { code: "Space", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-checkbox label="My Label"></nys-checkbox>`,
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
