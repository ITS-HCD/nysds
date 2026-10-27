import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-hero.js";
import { NysHero } from "./nys-hero.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-hero", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-hero></nys-hero>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysHero>(html`<nys-hero></nys-hero>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-hero-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysHero>(html`
      <nys-hero label="My Label"></nys-hero>
    `);
    expect(el.id).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-hero label="My Label"></nys-hero>`);
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
