import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-divider.js";
import { NysDivider } from "./nys-divider.js";

// You may need to import other dependencies such as the component's tag name
// For example:
// import { NysTextinput } from "./nys-textinput";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-divider", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-divider></nys-divider>`);
    expect(el).to.exist;
  });

  it("reflects inverted property correctly", async () => {
    const el = await fixture<NysDivider>(html`
      <nys-divider inverted></nys-divider>
    `);
    expect(el.inverted).to.be.true;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-divider></nys-divider>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
