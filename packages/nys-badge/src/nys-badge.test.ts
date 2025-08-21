import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-badge.js";
import { NysBadge } from "./nys-badge.js";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-badge", () => {
  it("renders the component", async () => {
    const el = await fixture<NysBadge>(html`<nys-badge></nys-badge>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysBadge>(html`
      <nys-badge label="My Label" prefixIcon suffixIcon></nys-badge>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.prefixIcon).to.be.true;
    expect(el.suffixIcon).to.be.true;
  });

  it("default intent is neutral", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label"></nys-badge>`,
    );
    expect(el.intent).to.equal("neutral");
  });

  it("can have custom icons", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label" prefixIcon="check"></nys-badge>`,
    );
    expect(el.prefixIcon).to.equal("check");
  });

  it("renders the prefix", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge prefixLabel="prefix" label="label"></nys-badge>`,
    );
    expect(el.prefixLabel).to.equal("prefix");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture<NysBadge>(
      html`<nys-badge label="My Label"></nys-badge>`,
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
