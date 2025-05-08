import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-skipnav.js";

describe("nys-skipnav", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-skipnav></nys-skipnav>`);
    expect(el).to.exist;
  });

  it("renders the component with default href values", async () => {
    const el = await fixture<HTMLElement>(`<nys-skipnav></nys-skipnav>`);
    const link = el.shadowRoot?.querySelector(".nys-skipnav__link");

    expect(link).to.exist;
    expect(link?.getAttribute("href")).to.equal("#main-content");
  });

  it("reflects attribute changes to properties", async () => {
    const el: any = await fixture(html`
      <nys-skipnav href="#core-content-container"></nys-skipnav>
    `);
    expect(el.href).to.equal("#core-content-container");
  });

  it("adds 'show' class on focus and removes on blur", async () => {
    const el = await fixture<HTMLElement>(`<nys-skipnav></nys-skipnav>`);
    const link = el.shadowRoot?.querySelector(".nys-skipnav__link");

    // Simulate focus/blur event
    link?.dispatchEvent(new Event("focus"));
    expect(link?.classList.contains("show")).to.be.true;
    link?.dispatchEvent(new FocusEvent("blur"));
    expect(link?.classList.contains("show")).to.be.false;
  });

  it("keeps 'show' class after blur if demoVisible is true", async () => {
    const el = await fixture(html`<nys-skipnav demoVisible></nys-skipnav>`);
    const link = el.shadowRoot?.querySelector(".nys-skipnav__link")!;
    link.dispatchEvent(new FocusEvent("focus"));
    link.dispatchEvent(new FocusEvent("blur"));
    expect(link.classList.contains("show")).to.be.true;
  });
});
