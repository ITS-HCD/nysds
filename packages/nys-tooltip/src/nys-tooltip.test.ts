import { expect, html, fixture } from "@open-wc/testing";
import { NysTooltip } from "./nys-tooltip";
import "../dist/nys-tooltip.js";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-tooltip", () => {
  it("renders the component", async () => {
    const el = await fixture(
      html`<nys-tooltip text="Helpful Tip."></nys-tooltip>`,
    );
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysTooltip>(html`
      <nys-tooltip text="My Text" position="top" inverted></nys-tooltip>
    `);
    expect(el.text).to.equal("My Text");
    expect(el.position).to.equal("top");
    expect(el.inverted).to.be.true;
  });

  /*** Accessibility tests ***/
  it("renders tooltip content with role=tooltip", async () => {
    const el = await fixture<NysTooltip>(
      html`<nys-tooltip text="Info"></nys-tooltip>`,
    );
    const tooltip = el.shadowRoot?.querySelector('[role="tooltip"]');
    expect(tooltip).to.exist;
  });

  it("links tooltip to nys-icon and passes tooltip text to the icon", async () => {
    const el = await fixture(html`
      <div>
        <nys-icon id="my-icon"></nys-icon>
        <nys-tooltip for="my-icon" text="Hello World"></nys-tooltip>
      </div>
    `);

    const icon = el.querySelector("nys-icon") as HTMLElement;
    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    expect(tooltip.for).to.equal("my-icon");
    expect(icon.getAttribute("ariaLabel")).to.equal("Hint: Hello World");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-tooltip text="My Text"></nys-tooltip>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
