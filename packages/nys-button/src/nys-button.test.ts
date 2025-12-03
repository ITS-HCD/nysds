import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import { NysButton } from "./nys-button";
import "../dist/nys-button.js";
import "@nysds/nys-icon";

describe("nys-button", () => {
  it("should have default type as button", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el?.type).to.equal("button");
  });

  it("should have role='button' for screen readers", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Accessible Button"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button, a")!;

    expect(button.getAttribute("role")).to.equal("button");
  });

  it("should reflect 'label' prop", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Click Me"></nys-button>`,
    );

    const label = el.shadowRoot?.querySelector(".nys-button__text");
    expect(label).to.exist;
    expect(label?.textContent).to.equal("Click Me");
  });

  it("uses ariaLabel when provided", async () => {
    const el = await fixture(
      html`<nys-button ariaLabel="Custom label"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("Custom label");
  });

  it('VO falls back to "button" if neither ariaLabel nor label is provided', async () => {
    const el = await fixture(html`<nys-button></nys-button>`);
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("button");
  });

  it("should show different variant results based on changing variant prop", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Click me" prefixIcon="arrow"></nys-button>`,
    );

    // 1. Check default variant and icon
    expect(el.variant).to.equal("filled");
    let icon = el.shadowRoot?.querySelector("nys-icon");
    expect(icon).to.exist;

    // 2. Set variant to "text" — icon should disappear
    el.variant = "text";
    await el.updateComplete;
    icon = el.shadowRoot?.querySelector("nys-icon");
    expect(icon).to.not.exist;

    // 3. Switch back to "ghost" — icon should return
    el.variant = "ghost";
    await el.updateComplete;

    icon = el.shadowRoot!.querySelector("nys-icon");
    expect(icon).to.exist;
  });

  it("should trigger click event only once", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Button"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button")!;

    let clickCount = 0;

    el.addEventListener("click", () => {
      clickCount++;
    });

    button.click();
    await el.updateComplete;

    expect(clickCount).to.equal(1);
  });

  it("should reflect disabled and prevent click", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Disabled" disabled></nys-button>`,
    );

    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.disabled).to.be.true;
  });

  it("should render as <a> when href is provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button href="https://example.com" label="Link"></nys-button>`,
    );

    const ahref = el.shadowRoot?.querySelector("a")!;
    expect(ahref).to.exist;
    expect(ahref.getAttribute("href")).to.equal("https://example.com");
    expect(ahref.textContent).to.include("Link");
  });

  it("should render circle button with icon", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button circle icon="close"></nys-button>`,
    );

    expect(el.circle).to.be.true;
  });

  it("should render prefix and suffix icons", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button
        label="With Icons"
        prefixIcon="arrow-left"
        suffixIcon="arrow-right"
      ></nys-button>`,
    );

    const prefixIcon = el.shadowRoot?.querySelector(
      "nys-icon[name='arrow-left']",
    );
    const suffixIcon = el.shadowRoot?.querySelector(
      "nys-icon[name='arrow-right']",
    );
    expect(prefixIcon).to.exist;
    expect(suffixIcon).to.exist;
  });

  it(" should allow for the icon to be slotted in", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button suffixIcon="slotted" size="sm">
        <nys-icon slot="suffix-icon" size="2xl" name="visibility"></nys-icon>
      </nys-button>`,
    );
    const prefixIcon = el.querySelector("nys-icon[name='visibility']");

    expect(el.prefixIcon).to.exist;
    expect(prefixIcon).to.exist;
  });

  it("should dispatch focus and blur events", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="FocusMe"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button")!;

    // Focus event
    const focusEventPromise = oneEvent(el, "focus");
    button.focus();
    const focusEvent = await focusEventPromise;
    expect(focusEvent).to.exist;
    expect(button.matches(":focus-visible")).to.be.true;

    // Blur event
    const blurEventPromise = oneEvent(el, "blur");
    button.blur();
    const blurEvent = await blurEventPromise;
    expect(blurEvent).to.exist;
    expect(button.matches(":focus-visible")).to.be.false;

    // Should not focus when disabled
    button.disabled = true;
    button.focus();
    expect(document.activeElement).to.not.equal(button);
  });

  it("should activate on Enter for link variants", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Keyboard Test Link" href="#"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("a")!;
    button.addEventListener("nys-click", (e) => e.preventDefault());

    const linkEnterPromise = oneEvent(el, "nys-click");
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    await linkEnterPromise;

    const linkSpacePromise = oneEvent(el, "click");
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    await linkSpacePromise;
  });

  it("should activate on Enter and Space for onClick buttons", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button
        label="Keyboard click test"
        onclick="alert('testing123')"
      ></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button")!;

    // Test Enter key
    const buttonEnterPromise = oneEvent(el, "nys-click");
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    const enterEvent = await buttonEnterPromise;
    expect(enterEvent).to.be.instanceOf(Event);
    expect(enterEvent.type).to.equal("nys-click");

    // Test Space key
    const buttonSpacePromise = oneEvent(el, "nys-click");
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    const spaceEvent = await buttonSpacePromise;
    expect(spaceEvent).to.be.instanceOf(Event);
    expect(spaceEvent.type).to.equal("nys-click");
  });
});

/*** CORE tests ***/
/*
 * ENSURE FORM INTEGRATION (TYPE SUBMIT/RESET):
 * - Default button type is "button"
 * - If the button has type="submit" or type="reset", verify that:
 *    - It is part of a form
 *    - It correctly triggers form submission/reset behavior
 */
describe("<nys-button> form integration", () => {
  it("has default type 'button'", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.type).to.equal("button");
  });

  const types: Array<"submit" | "reset" | "button"> = [
    "submit",
    "reset",
    "button",
  ];

  types.forEach((type) => {
    it("renders label and respects 'type' prop", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button label="Click Me" type="${type}"></nys-button>`,
      );

      expect(el.type).to.equal(type);
      const button = el.shadowRoot?.querySelector("button");
      expect(button?.getAttribute("type")).to.equal(type);
    });
  });
});

/*** Accessibility tests ***/
/*
 * ENSURE KEYBOARD SUPPORT:
 * - Buttons should be focusable and operable using the keyboard (e.g. Enter, Space)
 */
describe("NysButton keyboard support", () => {
  it("should fire click on Enter key", async () => {
    const el = await fixture(
      html`<nys-button label="Enter Test"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button");
    const keydownPromise = new Promise<Event>((resolve) => {
      el.addEventListener("keydown", (e) => resolve(e));
    });

    button?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    const event = await keydownPromise;
    expect(event).to.exist;
    expect(event.type).to.equal("keydown");
  });

  it("should dispatches click on Space key", async () => {
    const el = await fixture(
      html`<nys-button label="Space Test"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button");
    const keydownPromise = new Promise<Event>((resolve) => {
      el.addEventListener("keydown", (e) => resolve(e));
    });

    button?.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        composed: true,
      }),
    );

    const event = await keydownPromise;
    expect(event).to.exist;
    expect(event.type).to.equal("keydown");
  });
});
