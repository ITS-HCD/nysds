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

  it("generates an id if not provided", async () => {
    const el = await fixture<NysTooltip>(html`<nys-tooltip></nys-tooltip>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-tooltip-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysTooltip>(html`
      <nys-tooltip text="My Text" position="top" inverted></nys-tooltip>
    `);
    expect(el.text).to.equal("My Text");
    expect(el.position).to.equal("top");
    expect(el.inverted).to.be.true;
  });

  it("reflects position attribute", async () => {
    const el = await fixture<NysTooltip>(
      html`<nys-tooltip text="Position test" position="right"></nys-tooltip>`,
    );

    expect(el.getAttribute("position")).to.equal("right");
    expect(el.position).to.equal("right");
  });

  it("does not render tooltip content when text is empty", async () => {
    const el = await fixture<NysTooltip>(
      html`<nys-tooltip text=""></nys-tooltip>`,
    );

    const content = el.shadowRoot?.querySelector(".nys-tooltip__content");
    expect(content).to.not.exist;
  });

  /****** Accessibility tests ******/
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

  it("closes tooltip when Escape key is pressed", async () => {
    const el = await fixture(html`
      <div>
        <button id="my-btn">Focus</button>
        <nys-tooltip for="my-btn" text="Escape test"></nys-tooltip>
      </div>
    `);

    const button = el.querySelector("#my-btn");
    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    button?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await tooltip.updateComplete;

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tooltip.updateComplete;

    const content = tooltip.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    expect(content.getAttribute("aria-hidden")).to.equal("true");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-tooltip text="My Text"></nys-tooltip>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
