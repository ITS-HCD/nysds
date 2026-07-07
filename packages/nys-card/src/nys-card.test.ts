import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-card.js";
import { NysCard } from "./nys-card.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-card", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-card></nys-card>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysCard>(html`<nys-card></nys-card>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-card-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCard>(html`
      <nys-card heading="My Label"></nys-card>
    `);
    expect(el.heading).to.equal("My Label");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-card heading="My Label"></nys-card>`);
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
