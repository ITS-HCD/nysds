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

  it("moves focus to document.body after scrolling to top", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    const button = el.shadowRoot?.querySelector("nys-button")!;

    const originalScrollTo = window.scrollTo;
    window.scrollTo = () => {
      setTimeout(() => window.dispatchEvent(new Event("scroll")), 0);
    };

    button.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );

    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(document.activeElement).to.equal(document.body);

    window.scrollTo = originalScrollTo;
    document.body.removeAttribute("tabindex");
  });

  it("auto-generates an id in the format /^nys-backtotop-\\d+-\\d+$/ when none is provided", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    expect(el.id).to.match(/^nys-backtotop-\d+-\d+$/);
  });

  it("preserves a consumer-provided id", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop id="custom-btt"></nys-backtotop>`,
    );
    expect(el.id).to.equal("custom-btt");
  });

  it("gives the inner button an accessible name via the label prop", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    const button = el.shadowRoot?.querySelector("nys-button")!;
    expect(button.getAttribute("label")).to.equal("Back to top");
  });

  it("does not hardcode a duplicate id on the inner button", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    const button = el.shadowRoot?.querySelector("nys-button")!;
    // The inner button must not reuse the host tag name as a static id,
    // which would collide across multiple instances.
    expect(button.getAttribute("id")).to.not.equal("nys-backtotop");
  });

  it("respects prefers-reduced-motion by using instant scroll", async () => {
    const el = await fixture<NysBacktotop>(
      html`<nys-backtotop></nys-backtotop>`,
    );
    const button = el.shadowRoot?.querySelector("nys-button")!;

    // Force a non-top scroll position so _scrollToTop performs a scroll.
    Object.defineProperty(window, "scrollY", {
      value: 500,
      configurable: true,
    });

    // Stub matchMedia to report reduced-motion preference.
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener() {},
        removeEventListener() {},
      }) as unknown as MediaQueryList) as typeof window.matchMedia;

    let calledWith: any = null;
    const originalScrollTo = window.scrollTo;
    window.scrollTo = ((options: any) => {
      calledWith = options;
    }) as typeof window.scrollTo;

    button.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect(calledWith).to.deep.equal({ top: 0, behavior: "auto" });

    window.scrollTo = originalScrollTo;
    window.matchMedia = originalMatchMedia;
    document.body.removeAttribute("tabindex");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-backtotop></nys-backtotop>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
