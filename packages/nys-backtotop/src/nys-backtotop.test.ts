import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-backtotop.js";
import { NysBacktotop } from "./nys-backtotop.js";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-backtotop", () => {
  it("renders the component", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    expect(el).to.exist;
  });

  it("has a default position of 'right'", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    expect(el.position).to.equal("right");
  });

  it("allows setting the position attribute", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop position="left"></nys-backtotop>`,
    );
    expect(el.position).to.equal("left");
  });

  it("is not visible when scrolled to the top", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    expect(el.visible).to.be.false;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-backtotop></nys-backtotop>`);
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
