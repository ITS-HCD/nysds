import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-dropdownmenu.js";
import { NysDropdownMenu } from "./nys-dropdownmenu.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

describe("nys-dropdownmenu", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-dropdownmenu></nys-dropdownmenu>`);
    expect(el).to.exist;
  });

  it("position property reflects to attribute", async () => {
    const el = await fixture<NysDropdownMenu>(html`
      <nys-dropdownmenu
        for="my-trigger"
        position="top-start"
      ></nys-dropdownmenu>
    `);
    await el.updateComplete;
    expect(el.position).to.equal("top-start");
    expect(el.getAttribute("position")).to.equal("top-start");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-dropdownmenu label="My Label"></nys-dropdownmenu>`,
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
