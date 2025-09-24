import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-modal.js";
import { NysModal } from "./nys-modal.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-modal", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-modal></nys-modal>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysModal>(html`
      <nys-modal
        heading="Update Available"
        subheading="Please confirm"
        mandatory
      ></nys-modal>
    `);

    expect(el.heading).to.equal("Update Available");
    expect(el.subheading).to.equal("Please confirm");
    expect(el.mandatory).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-modal heading="Update Available"></nys-modal>`,
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
