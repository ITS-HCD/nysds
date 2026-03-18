import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-skipnav.js";
import { NysSkipnav } from "./nys-skipnav";

describe("nys-skipnav", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-skipnav></nys-skipnav>`);
    expect(el).to.exist;
  });

  it("renders the component with default href values", async () => {
    const el = await fixture<NysSkipnav>(`<nys-skipnav></nys-skipnav>`);
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
    const el = await fixture<NysSkipnav>(`<nys-skipnav></nys-skipnav>`);
    const link = el.shadowRoot?.querySelector(".nys-skipnav__link");

    // Simulate focus/blur event
    link?.dispatchEvent(new Event("focus"));
    expect(link?.classList.contains("show")).to.be.true;
    link?.dispatchEvent(new FocusEvent("blur"));
    expect(link?.classList.contains("show")).to.be.false;
  });

  it("_handleClick focuses the default #main-content target and sets tabindex and outline", async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <nys-skipnav></nys-skipnav>
        <main id="main-content" tabindex="-1">Main content</main>
      </div>
    `);

    const el = container.querySelector<NysSkipnav>("nys-skipnav")!;
    await el.updateComplete;

    const link =
      el.shadowRoot!.querySelector<HTMLElement>(".nys-skipnav__link")!;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    const target = container.querySelector<HTMLElement>("#main-content")!;
    expect(target.getAttribute("tabindex")).to.equal("-1");
    expect(target.getAttribute("style")).to.include("outline");
  });

  it("_handleClick focuses a custom href target and sets tabindex and outline", async () => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <nys-skipnav href="#custom-target"></nys-skipnav>
        <section id="custom-target" tabindex="-1">Custom section</section>
      </div>
    `);

    const el = container.querySelector<NysSkipnav>("nys-skipnav")!;
    await el.updateComplete;

    const link =
      el.shadowRoot!.querySelector<HTMLElement>(".nys-skipnav__link")!;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;

    const target = container.querySelector<HTMLElement>("#custom-target")!;
    expect(target.getAttribute("tabindex")).to.equal("-1");
    expect(target.getAttribute("style")).to.include("outline");
  });

  it("_handleClick does nothing when target element does not exist", async () => {
    const el = await fixture<NysSkipnav>(
      html`<nys-skipnav href="#nonexistent"></nys-skipnav>`,
    );
    await el.updateComplete;

    const link =
      el.shadowRoot!.querySelector<HTMLElement>(".nys-skipnav__link")!;
    expect(() =>
      link.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    ).to.not.throw();
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html` <div>
        <nys-skipnav></nys-skipnav>
        <main id="main-content" tabindex="-1">Main content</main>
      </div>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
