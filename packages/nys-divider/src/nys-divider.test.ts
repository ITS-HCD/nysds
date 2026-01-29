import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-divider.js";
import { NysDivider } from "./nys-divider.js";

describe("nys-divider", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-divider></nys-divider>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysDivider>(html`<nys-divider></nys-divider>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-divider-\d+-\d+$/);
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
