import { expect, html, fixture } from "@open-wc/testing";
import { NysIcon } from "./nys-icon";
import "../dist/nys-icon.js";

describe("nys-icon", () => {
  // renders an SVG icon when 'name' is valid
  it("renders default attributes of SVG icon when 'name' is valid", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="ac_unit"></nys-icon>`,
    );

    expect(el.name).to.equal("ac_unit");

    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.classList.contains("nys-icon--md")).to.be.true;
    expect(svg?.classList.contains("nys-icon--flip-")).to.be.false;
    expect(svg?.style.color).to.equal("currentcolor"); // Default color
    expect(svg?.style.rotate).to.equal("0deg");
  });

  it("applies size class based on size property", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" size="2xl"></nys-icon>`,
    );
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--2xl")).to.be.true;
  });

  it("falls back to default size when size is not passed", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--md")).to.be.true;
  });

  it("applies color styles", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" color="red"></nys-icon>`,
    );
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.color).to.equal("red");
  });

  it("applies rotation when prop is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" rotate="90"></nys-icon>`,
    );
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.style.rotate).to.equal("90deg");
  });

  it("applies flip when prop is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="check" flip="horizontal"></nys-icon>`,
    );
    const svg = el.shadowRoot?.querySelector("svg") as SVGElement;
    expect(svg.classList.contains("nys-icon--flip-horizontal")).to.be.true;
  });
});

// Accessibility Tests
/*
 * Ensure that the <nys-icon> component's aria is set correctly:
 * - role is set to "img" on the <svg> element.
 * - aria-label is set correctly on the <svg> element.
 * - aria-hidden is set correctly on the <svg> element.
 */
describe("nys-icon", () => {
  it("sets role to 'img' on the <svg> element", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.exist;
    expect(svg?.getAttribute("role")).to.equal("img");
  });

  it("renders nothing when 'name' is not valid", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon name="unknown"></nys-icon>`,
    );
    const svg = el.shadowRoot?.querySelector("svg");
    expect(svg).to.be.null;
  });

  it("sets accessibility attributes when 'ariaLabel' is provided", async () => {
    const el = await fixture<NysIcon>(
      html`<nys-icon ariaLabel="download icon" name="download"></nys-icon>`,
    );
    const svg = el.shadowRoot?.querySelector("svg");

    expect(svg).to.exist;
    expect(svg?.getAttribute("aria-label")).to.equal("download icon");
  });

  it("hides from screen readers when 'ariaLabel' is not provided", async () => {
    const el = await fixture<NysIcon>(html`<nys-icon name="check"></nys-icon>`);
    const svg = el.shadowRoot?.querySelector("svg");

    expect(svg?.getAttribute("aria-hidden")).to.equal("true");
    expect(svg?.getAttribute("aria-label")).to.be.null;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-unavfooter></nys-unavfooter>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
