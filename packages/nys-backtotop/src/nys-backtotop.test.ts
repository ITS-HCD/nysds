import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-backtotop.js";
import { NysBacktotop } from "./nys-backtotop.js";

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

  it("becomes visible after scrolling past the threshold", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );

    // Stub viewport + document height
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      configurable: true,
    });

    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 5000, // >= innerHeight * 4
      configurable: true,
    });

    // Simulate scroll position beyond threshold (innerHeight * 1.5)
    Object.defineProperty(window, "scrollY", {
      value: 2000,
      configurable: true,
    });

    // Trigger scroll handler
    window.dispatchEvent(new Event("scroll"));
    await el.updateComplete;

    expect(el.visible).to.be.true;
  });

  it("calls window.scrollTo when clicked", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    const button = el.shadowRoot?.querySelector("nys-button")!;

    // Spy on window.scrollTo
    let calledWith: any = null;
    const originalScrollTo = window.scrollTo;
    window.scrollTo = (options: any) => {
      calledWith = options;
    };

    // Trigger click event
    button.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );

    await el.updateComplete;

    expect(calledWith).to.deep.equal({ top: 0, behavior: "smooth" });

    // Restore original function
    window.scrollTo = originalScrollTo;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-backtotop></nys-backtotop>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
