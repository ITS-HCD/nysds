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

  it("triggers fade out, removes scroll listeners, and resets state after timeout", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Fade test"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    // force tooltip active and grab content
    (tooltip as any)._active = true;
    await tooltip.updateComplete;

    const content = tooltip.shadowRoot?.querySelector(
      ".nys-tooltip__content",
    ) as HTMLElement;

    expect(content).to.exist;
    expect((tooltip as any)._hideTimeout).to.be.null;

    // call the method directly
    (tooltip as any)._triggerFadeOut(content);

    expect(content.classList.contains("fade-out")).to.be.true;
    expect((tooltip as any)._hideTimeout).to.not.be.null;

    // wait for fade-out timeout
    await new Promise((r) => setTimeout(r, 210));

    expect((tooltip as any)._active).to.be.false;
    expect((tooltip as any)._hideTimeout).to.be.null;
    expect(content.classList.contains("fade-out")).to.be.false;
    expect(content.style.top).to.equal("0px");
    expect(content.style.left).to.equal("0px");
    expect(content.style.transform).to.equal("");
  });

  it("positions the tooltip element correctly for all sides", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Position test"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    const reference = document.createElement("div");
    const content = document.createElement("div");

    // Mock getBoundingClientRect for reference and content
    reference.getBoundingClientRect = () => ({
      top: 100,
      bottom: 150,
      left: 200,
      right: 250,
      width: 50,
      height: 50,
      x: 200,
      y: 100,
      toJSON: () => {},
    });

    content.getBoundingClientRect = () => ({
      top: 0,
      bottom: 20,
      left: 0,
      right: 60,
      width: 60,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const spacing = 8;

    // top
    (tooltip as any)._positionTooltipElement(reference, content, "top");
    expect(content.style.top).to.equal(`${100 - 20 - spacing}px`);
    expect(content.style.left).to.equal(`${200 + 50 / 2 - 60 / 2}px`);

    // bottom
    (tooltip as any)._positionTooltipElement(reference, content, "bottom");
    expect(content.style.top).to.equal(`${150 + spacing}px`);
    expect(content.style.left).to.equal(`${200 + 50 / 2 - 60 / 2}px`);

    // left
    (tooltip as any)._positionTooltipElement(reference, content, "left");
    expect(content.style.top).to.equal(`${100 + 50 / 2 - 20 / 2}px`);
    expect(content.style.left).to.equal(`${200 - 60 - spacing}px`);

    // right
    (tooltip as any)._positionTooltipElement(reference, content, "right");
    expect(content.style.top).to.equal(`${100 + 50 / 2 - 20 / 2}px`);
    expect(content.style.left).to.equal(`${250 + spacing}px`);

    // default (should behave like top)
    (tooltip as any)._positionTooltipElement(
      reference,
      content,
      "unknown" as any,
    );
    expect(content.style.top).to.equal(`${100 - 20 - spacing}px`);
    expect(content.style.left).to.equal(`${200 + 50 / 2 - 60 / 2}px`);
  });

  it("auto positions the tooltip based on available space", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Auto position test"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    const reference = document.createElement("div");
    const content = document.createElement("div");

    // Mock reference element returned by _getReferenceElement
    (tooltip as any)._getReferenceElement = () => reference;

    // Mock shadowRoot querySelector to return content
    tooltip.shadowRoot!.querySelector = (selector: string) =>
      selector === ".nys-tooltip__content" ? content : null;

    // Manual spy replacements
    let setInternalCalledWith: string | null = null;
    let positionCalledWith: { t: any; e: any; n: string } | null = null;
    let shiftCalledWith: any = null;

    (tooltip as any)._setInternalPosition = (pos: string) => {
      setInternalCalledWith = pos;
    };
    (tooltip as any)._positionTooltipElement = (t: any, e: any, n: string) => {
      positionCalledWith = { t, e, n };
    };
    (tooltip as any)._shiftTooltipIntoViewport = (e: any) => {
      shiftCalledWith = e;
    };

    // Case 1: first position fits
    (tooltip as any)._doesPositionFit = (pos: string) => pos === "top";

    await (tooltip as any)._autoPositionTooltip();

    expect(setInternalCalledWith).to.equal("top");
    expect(positionCalledWith!.n).to.equal("top");
    expect(positionCalledWith!.t).to.equal(reference);
    expect(positionCalledWith!.e).to.equal(content);
    expect(shiftCalledWith).to.equal(content);

    // Reset spy variables
    setInternalCalledWith = null;
    positionCalledWith = null;
    shiftCalledWith = null;

    // Case 2: no position fits -> fallback logic
    (tooltip as any)._doesPositionFit = () => false;

    // Provide mock getBoundingClientRect for reference
    reference.getBoundingClientRect = () => ({
      top: 50,
      bottom: 100,
      left: 60,
      right: 110,
      width: 50,
      height: 50,
      x: 60,
      y: 50,
      toJSON: () => {},
    });

    // Mock window dimensions
    (window as any).innerHeight = 200;
    (window as any).innerWidth = 200;

    await (tooltip as any)._autoPositionTooltip();

    // Fallback should pick one of the sides
    expect(setInternalCalledWith).to.be.a("string");
    expect(positionCalledWith!.t).to.equal(reference);
    expect(positionCalledWith!.e).to.equal(content);
    expect(shiftCalledWith).to.equal(content);
  });

  it("checks if the tooltip fits in the viewport and positions it according to user preference", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Fit test"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    const reference = document.createElement("div");
    const content = document.createElement("div");

    // Mock _getReferenceElement
    (tooltip as any)._getReferenceElement = () => reference;

    // Mock shadowRoot querySelector
    tooltip.shadowRoot!.querySelector = (selector: string) =>
      selector === ".nys-tooltip__content" ? content : null;

    // Mock dimensions for reference and content
    reference.getBoundingClientRect = () => ({
      top: 50,
      bottom: 150,
      left: 100,
      right: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 50,
      toJSON: () => {},
    });

    content.getBoundingClientRect = () => ({
      top: 0,
      bottom: 40,
      left: 0,
      right: 60,
      width: 60,
      height: 40,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    (window as any).innerWidth = 300;
    (window as any).innerHeight = 300;

    // _doesPositionFit
    expect((tooltip as any)._doesPositionFit("top")).to.be.true;
    expect((tooltip as any)._doesPositionFit("bottom")).to.be.true;
    expect((tooltip as any)._doesPositionFit("left")).to.be.true;
    expect((tooltip as any)._doesPositionFit("right")).to.be.true;

    // _userPositionTooltip
    let positioned: { t: any; e: any; n: string } | null = null;
    (tooltip as any)._positionTooltipElement = (t: any, e: any, n: string) => {
      positioned = { t, e, n };
    };
    let shifted: any = null;
    (tooltip as any)._shiftTooltipIntoViewport = (e: any) => {
      shifted = e;
    };

    tooltip.position = "bottom";
    await (tooltip as any)._userPositionTooltip();

    expect(positioned!.t).to.equal(reference);
    expect(positioned!.e).to.equal(content);
    expect(positioned!.n).to.equal("bottom");
    expect(shifted).to.equal(content);
  });

  it("_shiftTooltipIntoViewport shifts tooltip right when overflowing left edge", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Overflow left"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;
    const reference = document.createElement("div");
    const content = document.createElement("div");

    (tooltip as any)._getReferenceElement = () => reference;

    // Reference centered at x=30
    reference.getBoundingClientRect = () => ({
      top: 100,
      bottom: 150,
      left: 5,
      right: 55,
      width: 50,
      height: 50,
      x: 5,
      y: 100,
      toJSON: () => {},
    });

    // Tooltip overflows left (left < 0)
    let contentRect = {
      top: 80,
      bottom: 100,
      left: -20,
      right: 40,
      width: 60,
      height: 20,
      x: -20,
      y: 80,
      toJSON: () => {},
    };
    content.getBoundingClientRect = () => contentRect;

    (tooltip as any)._shiftTooltipIntoViewport(content);

    expect(content.style.left).to.equal("10px");
    expect(content.style.transform).to.equal("none");
    expect(content.style.getPropertyValue("--arrow-offset-x")).to.not.be.empty;
  });

  it("_shiftTooltipIntoViewport shifts tooltip left when overflowing right edge", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Overflow right"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;
    const reference = document.createElement("div");
    const content = document.createElement("div");

    (tooltip as any)._getReferenceElement = () => reference;

    (window as any).innerWidth = 300;

    // Reference centered at x=270
    reference.getBoundingClientRect = () => ({
      top: 100,
      bottom: 150,
      left: 245,
      right: 295,
      width: 50,
      height: 50,
      x: 245,
      y: 100,
      toJSON: () => {},
    });

    // Tooltip overflows right (right > innerWidth)
    let contentRect = {
      top: 80,
      bottom: 100,
      left: 250,
      right: 320,
      width: 70,
      height: 20,
      x: 250,
      y: 80,
      toJSON: () => {},
    };
    content.getBoundingClientRect = () => contentRect;

    (tooltip as any)._shiftTooltipIntoViewport(content);

    expect(content.style.right).to.equal("0px");
    expect(content.style.left).to.equal("auto");
    expect(content.style.transform).to.equal("none");
    expect(content.style.getPropertyValue("--arrow-offset-x")).to.not.be.empty;
  });

  it("_shiftTooltipIntoViewport does not shift when tooltip fits within viewport", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="No overflow"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;
    const reference = document.createElement("div");
    const content = document.createElement("div");

    (tooltip as any)._getReferenceElement = () => reference;

    (window as any).innerWidth = 500;

    reference.getBoundingClientRect = () => ({
      top: 100,
      bottom: 150,
      left: 200,
      right: 250,
      width: 50,
      height: 50,
      x: 200,
      y: 100,
      toJSON: () => {},
    });

    // Tooltip fits within viewport
    content.getBoundingClientRect = () => ({
      top: 80,
      bottom: 100,
      left: 195,
      right: 255,
      width: 60,
      height: 20,
      x: 195,
      y: 80,
      toJSON: () => {},
    });

    (tooltip as any)._shiftTooltipIntoViewport(content);

    // No shift applied
    expect(content.style.left).to.equal("");
    expect(content.style.right).to.equal("");
    expect(content.style.transform).to.equal("");
    // Arrow offset still calculated
    expect(content.style.getPropertyValue("--arrow-offset-x")).to.not.be.empty;
  });

  it("_shiftTooltipIntoViewport clamps arrow offset between 0% and 100%", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Arrow clamp"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;
    const reference = document.createElement("div");
    const content = document.createElement("div");

    (tooltip as any)._getReferenceElement = () => reference;

    // Reference far to the right — refCenter will be way past tooltip width
    reference.getBoundingClientRect = () => ({
      top: 100,
      bottom: 150,
      left: 900,
      right: 950,
      width: 50,
      height: 50,
      x: 900,
      y: 100,
      toJSON: () => {},
    });

    content.getBoundingClientRect = () => ({
      top: 80,
      bottom: 100,
      left: 10,
      right: 70,
      width: 60,
      height: 20,
      x: 10,
      y: 80,
      toJSON: () => {},
    });

    (tooltip as any)._shiftTooltipIntoViewport(content);

    const arrowOffset = content.style.getPropertyValue("--arrow-offset-x");
    const value = parseFloat(arrowOffset);
    expect(value).to.be.at.least(0);
    expect(value).to.be.at.most(100);
  });

  it("_addScrollListeners repositions tooltip on window scroll when active", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Scroll test"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    // Force active and add listeners
    (tooltip as any)._active = true;
    (tooltip as any)._addScrollListeners();

    let showCalled = false;
    (tooltip as any)._showTooltip = () => {
      showCalled = true;
    };

    window.dispatchEvent(new Event("scroll"));
    await tooltip.updateComplete;

    expect(showCalled).to.be.true;

    (tooltip as any)._removeScrollListeners();
  });

  it("_addScrollListeners repositions tooltip on window resize when active", async () => {
    const el = await fixture<NysTooltip>(html`
      <div>
        <button id="btn">Btn</button>
        <nys-tooltip for="btn" text="Resize test"></nys-tooltip>
      </div>
    `);

    const tooltip = el.querySelector("nys-tooltip") as NysTooltip;

    (tooltip as any)._active = true;
    (tooltip as any)._addScrollListeners();

    let showCalled = false;
    (tooltip as any)._showTooltip = () => {
      showCalled = true;
    };

    window.dispatchEvent(new Event("resize"));
    await tooltip.updateComplete;

    expect(showCalled).to.be.true;

    (tooltip as any)._removeScrollListeners();
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-tooltip text="My Text"></nys-tooltip>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
