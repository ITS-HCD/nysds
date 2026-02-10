import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-dropdown.js";
import { NysDropdown } from "./nys-dropdown.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-dropdown", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-dropdown></nys-dropdown>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysDropdown>(html`<nys-dropdown></nys-dropdown>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-dropdown-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysDropdown>(html`
      <nys-dropdown label="My Label" required optional></nys-dropdown>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-dropdown label="My Label"></nys-dropdown>`,
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
