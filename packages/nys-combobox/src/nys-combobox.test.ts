import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-combobox.js";
import { NysCombobox } from "./nys-combobox.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-combobox", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-combobox></nys-combobox>`);
    expect(el).to.exist;
  });


  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox label="My Label" required optional></nys-combobox>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-combobox label="My Label"></nys-combobox>`);
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
})
