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

  it("should apply correct size or fallback", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button size="lg" label="Large Button"></nys-button>`,
    );

    expect(el.size).to.equal("lg");

    // Checking fallback size in case of invalid input
    el.size = "invalid";
    await el.updateComplete;
    expect(el.size).to.equal("md");
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
    button.addEventListener("click", (e) => e.preventDefault());

    const linkEnterPromise = oneEvent(el, "click");
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

    const buttonClickPromise = oneEvent(el, "click");
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    await buttonClickPromise;

    const buttonSpacePromise = oneEvent(el, "click");
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    await buttonSpacePromise;
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

  it("renders label and respects 'type' prop", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Click Me" type="submit"></nys-button>`,
    );

    expect(el.type).to.equal("submit");
    const button = el.shadowRoot?.querySelector("button");
    expect(button?.getAttribute("type")).to.equal("submit");
  });

  it("triggers form submission when type='submit'", async () => {
    const formSubmit = new Promise<Event>((resolve) => {
      const submitHandler = (e: Event) => {
        e.preventDefault(); // prevent actual navigation
        resolve(e);
      };

      document.body.addEventListener("submit", submitHandler);
    });

    const el = await fixture(html`
      <form id="test-form">
        <nys-button label="Submit" type="submit"></nys-button>
      </form>
    `);

    const button = el.querySelector("nys-button")!;
    const innerButton = button.shadowRoot?.querySelector("button")!;
    innerButton.click();

    const event = await formSubmit;
    expect(event).to.exist;
    expect(event.type).to.equal("submit");
  });

  it("triggers form reset when type='reset'", async () => {
    const resetHandler = oneEvent(document, "reset");

    const el = await fixture(html`
      <form id="test-form">
        <input name="field" value="original" />
        <nys-button label="Reset" type="reset"></nys-button>
      </form>
    `);

    const form = el as HTMLFormElement;
    const input = form.querySelector("input")!;
    input.value = "changed";

    const button = form
      .querySelector("nys-button")!
      .shadowRoot!.querySelector("button")!;
    button.click();

    const event = await resetHandler;
    expect(event).to.exist;
    expect(event.type).to.equal("reset");

    // The form resets the input
    expect(input.value).to.equal("original");
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
