import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-tab.js";
import { NysTab } from "./nys-tab.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-tab", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-tab></nys-tab>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysTab>(html`<nys-tab></nys-tab>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-tab-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysTab>(html`
      <nys-tab label="My Label" required optional></nys-tab>
    `);
    expect(el.label).to.equal("My Label");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-tab label="My Label"></nys-tab>`);
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
