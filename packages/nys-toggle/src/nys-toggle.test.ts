import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-toggle.js";
import { NysToggle } from "./nys-toggle";

describe("nys-toggle", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-toggle></nys-toggle>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysToggle>(html`
      <nys-toggle label="My Label" checked></nys-toggle>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.checked).to.be.true;
  });
  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-toggle label="My Label"></nys-toggle>`);
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
