import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-radiobutton.js";
import { NysRadiogroup } from "./nys-radiogroup";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-radiobutton", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-radiobutton></nys-radiobutton>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysRadiogroup>(html`
      <nys-radiogroup
        label="What is your primary work location?"
        description="This is the location you use for your in office days."
        required
      >
        <nys-radiobutton
          name="office"
          label="Albany"
          description="Upstate New York"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          description="New York City"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    expect(el.label).to.equal("What is your primary work location?");
    expect(el.required).to.be.true;
  });

  it("tile prop render", async () => {
    const el = await fixture(html`
      <nys-radiogroup label="What is your primary work location?" tile>
        <nys-radiobutton
          name="office"
          label="Albany"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    expect(el.hasAttribute("tile")).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html` <nys-radiogroup label="What is your primary work location?">
        <nys-radiobutton
          name="office"
          label="Albany"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>`,
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
