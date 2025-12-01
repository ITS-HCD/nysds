import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-datepicker.js";
import { NysDatepicker } from "./nys-datepicker.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-datepicker", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-datepicker></nys-datepicker>`);
    expect(el).to.exist;
  });


  it("reflects attributes to properties", async () => {
    const el = await fixture<NysDatepicker>(html`
      <nys-datepicker label="My Label" required optional></nys-datepicker>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-datepicker label="My Label"></nys-datepicker>`);
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
