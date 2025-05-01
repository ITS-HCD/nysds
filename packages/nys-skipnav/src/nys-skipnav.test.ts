import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-skipnav.js";

// Below is an example of a test file for a web component. Add your own tests as needed.

// Render the component
describe("nys-skipnav", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-skipnav></nys-skipnav>`);
    expect(el).to.exist;
  });


  it("reflects attributes to properties", async () => {
    const el = await fixture(html`
      <nys-skipnav label="My Label" required optional></nys-skipnav>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
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