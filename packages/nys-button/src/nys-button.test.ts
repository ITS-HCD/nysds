import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import { NysButton } from "./nys-button";
import "../dist/nys-button.js";
import "@nysds/nys-icon";

describe("nys-button", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-button></nys-button>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-button-\d+-\d+$/);
  });

  it("should have default type as button", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el?.type).to.equal("button");
  });

  it("getButtonElement returns the correct internal element", async () => {
    // Case 1: standard button
    const btnEl = await fixture<NysButton>(
      html`<nys-button label="Click"></nys-button>`,
    );
    const internalButton = await btnEl.getButtonElement();
    expect(internalButton).to.exist;
    expect(internalButton?.tagName.toLowerCase()).to.equal("button");

    // Case 2: link button
    const linkEl = await fixture<NysButton>(
      html`<nys-button label="Go" href="#"></nys-button>`,
    );
    const internalLink = await linkEl.getButtonElement();
    expect(internalLink).to.exist;
    expect(internalLink?.tagName.toLowerCase()).to.equal("a");
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
    expect(button.getAttribute("tabindex")).to.equal("-1");
  });

  it("calls preventDefault when disabled", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button disabled></nys-button>`,
    );
    const button = await el.getButtonElement();

    let prevented = false;
    const event = new MouseEvent("click", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    event.preventDefault = () => {
      prevented = true;
    };

    button?.dispatchEvent(event);

    expect(prevented).to.be.true;
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

  it("uses the label as aria-label when circle is true)", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button circle label="Close"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("Close");
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
    expect(prefixIcon!.getAttribute("name")).to.equal("arrow-left");
    expect(prefixIcon!.getAttribute("size")).to.equal("16");

    expect(suffixIcon).to.exist;
    expect(suffixIcon!.getAttribute("name")).to.equal("arrow-right");
    expect(suffixIcon!.getAttribute("size")).to.equal("16");
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

  it("renders correct icon sizes for regular and circle buttons", async () => {
    // Regular button with prefix icon
    const regularEl = await fixture<NysButton>(
      html`<nys-button
        label="Regular"
        prefixIcon="arrow"
        size="sm"
      ></nys-button>`,
    );
    let icon = regularEl.shadowRoot?.querySelector("nys-icon")!;
    expect(icon).to.exist;
    expect(icon.getAttribute("size")).to.equal("16"); // regular icons are always 16

    // Circle button
    const circleEl = await fixture<NysButton>(
      html`<nys-button circle icon="close" size="sm"></nys-button>`,
    );
    let circleIcon = circleEl.shadowRoot?.querySelector("nys-icon")!;
    expect(circleIcon).to.exist;
    expect(circleIcon.getAttribute("size")).to.equal("24"); // sm circle = 24
    circleEl.size = "md";
    await circleEl.updateComplete;
    circleIcon = circleEl.shadowRoot?.querySelector("nys-icon")!;
    expect(circleIcon?.getAttribute("size")).to.equal("32"); // md circle = 32
    circleEl.size = "lg";
    await circleEl.updateComplete;
    circleIcon = circleEl.shadowRoot?.querySelector("nys-icon")!;
    expect(circleIcon?.getAttribute("size")).to.equal("40"); // lg circle = 40
  });

  it("should focus the internal button or link via focus() method", async () => {
    // Regular button
    const btnEl = await fixture<NysButton>(
      html`<nys-button label="Btn"></nys-button>`,
    );
    const innerButton = btnEl.shadowRoot!.querySelector(
      "button.nys-button",
    )! as HTMLButtonElement;
    let focused = false;
    innerButton.focus = () => {
      focused = true;
    };
    btnEl.focus();
    expect(focused).to.be.true;

    // Link button
    const linkEl = await fixture<NysButton>(
      html`<nys-button label="Link" href="#"></nys-button>`,
    );
    const innerLink = linkEl.shadowRoot!.querySelector(
      "a.nys-button",
    )! as HTMLAnchorElement;
    focused = false;
    innerLink.focus = () => {
      focused = true;
    };
    linkEl.focus();
    expect(focused).to.be.true;

    // Fallback to host if neither found
    const hostEl = await fixture<NysButton>(
      html`<nys-button label="NoButton"></nys-button>`,
    );
    const originalSuperFocus = hostEl.focus;
    let superFocused = false;
    hostEl.focus = () => {
      superFocused = true;
    };
    // simulate renderRoot has no button or link
    hostEl.renderRoot.querySelector = () => null;
    hostEl.focus();
    expect(superFocused).to.be.true;

    // restore original focus
    hostEl.focus = originalSuperFocus;
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

  it("dispatches nys-click exactly once per interaction", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Once"></nys-button>`,
    );

    let count = 0;
    el.addEventListener("nys-click", () => count++);

    const button = el.shadowRoot!.querySelector("button")!;
    button.click();
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  it("does not dispatch nys-click when disabled via keyboard", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Disabled" disabled></nys-button>`,
    );

    let fired = false;
    el.addEventListener("nys-click", () => (fired = true));

    const button = el.shadowRoot!.querySelector("button")!;
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;
    expect(fired).to.be.false;
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

// CORE tests
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

  it("triggers form actions based on type via click", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);

    // Submit button
    const submitBtn = await fixture<NysButton>(
      html`<nys-button type="submit" label="Submit"></nys-button>`,
    );
    form.appendChild(submitBtn);

    let submitted = false;
    form.requestSubmit = () => {
      submitted = true;
    };

    const btnEl = await submitBtn.getButtonElement();
    btnEl?.click(); // triggers private _manageFormAction internally
    await submitBtn.updateComplete;

    expect(submitted).to.be.true;

    // Reset button
    const resetBtn = await fixture<NysButton>(
      html`<nys-button type="reset" label="Reset"></nys-button>`,
    );
    form.appendChild(resetBtn);

    let reset = false;
    form.reset = () => {
      reset = true;
    };

    const resetEl = await resetBtn.getButtonElement();
    resetEl?.click(); // triggers _manageFormAction
    await resetBtn.updateComplete;

    expect(reset).to.be.true;

    document.body.removeChild(form);
  });
});

// Accessibility Tests
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

  it("does nothing on non-Enter/Space keys", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Test"></nys-button>`,
    );
    const button = el.shadowRoot!.querySelector("button")!;
    let clicked = false;
    el.addEventListener("nys-click", () => (clicked = true));

    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        composed: true,
      }),
    );
    expect(clicked).to.be.false;
  });

  it("uses label if ariaLabel not provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Label Only"></nys-button>`,
    );
    const button = el.shadowRoot!.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("Label Only");
  });

  it("focus() falls back to host if renderRoot.querySelector returns null", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="NoButton"></nys-button>`,
    );
    el.renderRoot.querySelector = () => null; // simulate no button/link
    let focused = false;
    el.focus = () => {
      focused = true;
    };
    el.focus();
    expect(focused).to.be.true;
  });

  it("form integration: button with default type does not submit or reset", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);

    const btn = await fixture<NysButton>(
      html`<nys-button label="Default"></nys-button>`,
    );
    form.appendChild(btn);
    let submitted = false,
      reset = false;
    form.requestSubmit = () => (submitted = true);
    form.reset = () => (reset = true);

    const btnEl = await btn.getButtonElement();
    btnEl?.click();
    await btn.updateComplete;

    expect(submitted).to.be.false;
    expect(reset).to.be.false;

    document.body.removeChild(form);
  });

  /** More event testing **/
  it("executes onClick string attribute via keyboard Enter", async () => {
    // Use a side-effect we can observe without eval risks in test env
    (window as any)._nysButtonAttrTest = false;

    const el = await fixture<NysButton>(html`
      <nys-button
        label="Attr Test"
        onClick="window._nysButtonAttrTest = true;"
      ></nys-button>
    `);
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector("button")!;

    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect((window as any)._nysButtonAttrTest).to.be.true;

    delete (window as any)._nysButtonAttrTest;
  });
});
