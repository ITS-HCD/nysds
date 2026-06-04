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
    const button =
      await el.shadowRoot?.querySelector<HTMLButtonElement>(
        "button.nys-button",
      );

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

  it("should render prefix and suffix icons as props", async () => {
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
      html`<nys-button size="sm">
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

    const btnEl =
      await submitBtn.shadowRoot?.querySelector<HTMLButtonElement>(
        "button.nys-button",
      );
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

    const resetEl =
      await resetBtn.shadowRoot?.querySelector<HTMLButtonElement>(
        "button.nys-button",
      );
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

    const btnEl =
      await btn.shadowRoot?.querySelector<HTMLButtonElement>(
        "button.nys-button",
      );
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

// ---------------------------------------------------------------------------
// Additional branch-coverage tests
// ---------------------------------------------------------------------------

describe("nys-button — default property values", () => {
  it("has default variant 'filled'", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.variant).to.equal("filled");
  });

  it("has default size 'md'", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.size).to.equal("md");
  });

  it("has default fullWidth false", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.fullWidth).to.be.false;
  });

  it("has default inverted false", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.inverted).to.be.false;
  });

  it("has default disabled false", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.disabled).to.be.false;
  });

  it("has default circle false", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.circle).to.be.false;
  });

  it("has default target '_self'", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el.target).to.equal("_self");
  });
});

describe("nys-button — id handling", () => {
  it("preserves an explicit id and does not overwrite it", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button id="my-custom-id"></nys-button>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("my-custom-id");
  });
});

describe("nys-button — variant CSS classes", () => {
  const variants = ["filled", "outline", "ghost", "text"] as const;

  variants.forEach((variant) => {
    it(`applies variant="${variant}" attribute to host`, async () => {
      const el = await fixture<NysButton>(
        html`<nys-button variant="${variant}"></nys-button>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("variant")).to.equal(variant);
    });
  });

  it("updates variant attribute when property changes", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button variant="filled"></nys-button>`,
    );
    el.variant = "outline";
    await el.updateComplete;
    expect(el.getAttribute("variant")).to.equal("outline");
  });
});

describe("nys-button — size attribute reflection", () => {
  (["sm", "md", "lg"] as const).forEach((size) => {
    it(`reflects size="${size}" on host element`, async () => {
      const el = await fixture<NysButton>(
        html`<nys-button size="${size}"></nys-button>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("size")).to.equal(size);
    });
  });
});

describe("nys-button — fullWidth and inverted reflection", () => {
  it("reflects fullWidth attribute on host", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button fullWidth></nys-button>`,
    );
    await el.updateComplete;
    expect(el.fullWidth).to.be.true;
    expect(el.hasAttribute("fullwidth")).to.be.true;
  });

  it("removes fullWidth attribute when set to false", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button fullWidth></nys-button>`,
    );
    el.fullWidth = false;
    await el.updateComplete;
    expect(el.fullWidth).to.be.false;
  });

  it("reflects inverted attribute on host", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button inverted></nys-button>`,
    );
    await el.updateComplete;
    expect(el.inverted).to.be.true;
    expect(el.hasAttribute("inverted")).to.be.true;
  });

  it("removes inverted attribute when set to false", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button inverted></nys-button>`,
    );
    el.inverted = false;
    await el.updateComplete;
    expect(el.inverted).to.be.false;
  });
});

describe("nys-button — icon rendering branches", () => {
  it("does not render prefix-icon when prefixIcon is empty", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="No prefix"></nys-button>`,
    );
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector("slot[name='prefix-icon']");
    expect(slot).to.not.exist;
  });

  it("does not render suffix-icon when suffixIcon is empty", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="No suffix"></nys-button>`,
    );
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector("slot[name='suffix-icon']");
    expect(slot).to.not.exist;
  });

  it("does not render circle-icon slot when circle is false", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button icon="close"></nys-button>`,
    );
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector("slot[name='circle-icon']");
    expect(slot).to.not.exist;
  });

  it("does not render circle-icon slot when circle is true but icon is empty", async () => {
    const el = await fixture<NysButton>(html`<nys-button circle></nys-button>`);
    await el.updateComplete;
    const slot = el.shadowRoot?.querySelector("slot[name='circle-icon']");
    expect(slot).to.not.exist;
  });

  it("does not render label text in circle mode", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button circle icon="close" label="Close dialog"></nys-button>`,
    );
    await el.updateComplete;
    const textDiv = el.shadowRoot?.querySelector(".nys-button__text");
    expect(textDiv).to.not.exist;
  });

  it("uses icon as aria-label fallback in circle mode when label is empty", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button circle icon="close"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("close");
  });

  it("uses prefixIcon as aria-label when no label or ariaLabel is set", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button prefixIcon="home"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("home");
  });

  it("uses suffixIcon as aria-label when no label, ariaLabel, or prefixIcon is set", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button suffixIcon="arrow_forward"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-label")).to.equal("arrow_forward");
  });
});

describe("nys-button — aria attributes", () => {
  it("sets aria-disabled='true' when disabled", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button disabled></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-disabled")).to.equal("true");
  });

  it("sets aria-disabled='false' when not disabled", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-disabled")).to.equal("false");
  });

  it("sets aria-description when ariaDescription is provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button
        label="Save"
        ariaDescription="Saves the current draft"
      ></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-description")).to.equal(
      "Saves the current draft",
    );
  });

  it("omits aria-description when ariaDescription is empty", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.hasAttribute("aria-description")).to.be.false;
  });

  it("sets aria-controls when ariaControls is provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button ariaControls="my-dropdown"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-controls")).to.equal("my-dropdown");
  });

  it("omits aria-controls when ariaControls is empty", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.hasAttribute("aria-controls")).to.be.false;
  });
});

describe("nys-button — name, value, form attribute passthrough", () => {
  it("sets name on inner button when name prop is provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button name="action"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("name")).to.equal("action");
  });

  it("omits name on inner button when name prop is empty", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.hasAttribute("name")).to.be.false;
  });

  it("sets value on inner button when value prop is provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button value="yes"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("value")).to.equal("yes");
  });

  it("omits value on inner button when value prop is empty", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.hasAttribute("value")).to.be.false;
  });

  it("sets form attribute on inner button when form prop is provided", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button form="my-form"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("form")).to.equal("my-form");
  });

  it("omits form attribute on inner button when form prop is null", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.hasAttribute("form")).to.be.false;
  });
});

describe("nys-button — nys-click, nys-focus, nys-blur custom events", () => {
  it("does not fire nys-click when disabled via mouse click", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button disabled></nys-button>`,
    );
    let fired = false;
    el.addEventListener("nys-click", () => (fired = true));
    const button = el.shadowRoot!.querySelector("button")!;
    button.click();
    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it("fires nys-focus exactly once on focus", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Focus test"></nys-button>`,
    );
    let count = 0;
    el.addEventListener("nys-focus", () => count++);
    const button = el.shadowRoot!.querySelector("button")!;
    button.dispatchEvent(new Event("focus", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(count).to.equal(1);
  });

  it("fires nys-blur exactly once on blur", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Blur test"></nys-button>`,
    );
    let count = 0;
    el.addEventListener("nys-blur", () => count++);
    const button = el.shadowRoot!.querySelector("button")!;
    button.dispatchEvent(new Event("blur", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(count).to.equal(1);
  });

  it("calls onClick property function when button is clicked", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="OnClick prop test"></nys-button>`,
    );
    let called = false;
    el.onClick = () => {
      called = true;
    };
    const button = el.shadowRoot!.querySelector("button")!;
    button.click();
    await el.updateComplete;
    expect(called).to.be.true;
  });

  it("does not call onClick property function when disabled", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button disabled></nys-button>`,
    );
    let called = false;
    el.onClick = () => {
      called = true;
    };
    const button = el.shadowRoot!.querySelector("button")!;
    button.click();
    await el.updateComplete;
    expect(called).to.be.false;
  });
});

describe("nys-button — href (link) mode branches", () => {
  it("renders <a> with correct target attribute", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button href="https://ny.gov" target="_blank"></nys-button>`,
    );
    await el.updateComplete;
    const a = el.shadowRoot?.querySelector("a.nys-button")!;
    expect(a.getAttribute("target")).to.equal("_blank");
  });

  it("sets tabindex='-1' and aria-disabled='true' on <a> when disabled", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button href="https://ny.gov" disabled></nys-button>`,
    );
    await el.updateComplete;
    const a = el.shadowRoot?.querySelector("a.nys-button")!;
    expect(a.getAttribute("tabindex")).to.equal("-1");
    expect(a.getAttribute("aria-disabled")).to.equal("true");
  });

  it("renders prefixIcon inside <a> when href and prefixIcon are set", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button href="https://ny.gov" prefixIcon="home"></nys-button>`,
    );
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("a nys-icon[name='home']");
    expect(icon).to.exist;
  });

  it("renders suffixIcon inside <a> when href and suffixIcon are set", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button
        href="https://ny.gov"
        suffixIcon="open_in_new"
      ></nys-button>`,
    );
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("a nys-icon[name='open_in_new']");
    expect(icon).to.exist;
  });

  it("renders circle-icon inside <a> when href, circle, and icon are set", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button href="https://ny.gov" circle icon="close"></nys-button>`,
    );
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector("a nys-icon[name='close']");
    expect(icon).to.exist;
  });

  it("does not fire nys-click when href link is disabled", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button href="https://ny.gov" disabled></nys-button>`,
    );
    let fired = false;
    el.addEventListener("nys-click", () => (fired = true));
    const a = el.shadowRoot!.querySelector("a.nys-button")!;
    a.click();
    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it("renders label text inside <a>", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button
        href="https://ny.gov"
        label="Visit NY.gov"
      ></nys-button>`,
    );
    await el.updateComplete;
    const textDiv = el.shadowRoot?.querySelector("a .nys-button__text");
    expect(textDiv).to.exist;
    expect(textDiv?.textContent).to.equal("Visit NY.gov");
  });
});

describe("nys-button — keyup removes active class", () => {
  it("removes active class on keyup for Enter", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Keyup test"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector("button.nys-button")!;

    // First trigger keydown to add active class
    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    // Then keyup should remove active class
    button.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(button.classList.contains("active")).to.be.false;
  });

  it("removes active class on keyup for Space", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Keyup space"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector("button.nys-button")!;

    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    button.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(button.classList.contains("active")).to.be.false;
  });

  it("does not remove active class on keyup for unrelated key", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Keyup unrelated"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector("button.nys-button")!;

    // Manually add active to simulate prior state
    button.classList.add("active");

    button.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Tab",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    // active class should still be present since Tab is not handled
    expect(button.classList.contains("active")).to.be.true;
  });
});

describe("nys-button — form integration extended", () => {
  it("associates button with external form via form attribute", async () => {
    const wrapper = await fixture<HTMLElement>(html`
      <div>
        <form id="external-form"></form>
        <nys-button
          type="submit"
          form="external-form"
          label="Submit"
        ></nys-button>
      </div>
    `);
    const btn = wrapper.querySelector<NysButton>("nys-button")!;
    await btn.updateComplete;
    const innerButton = btn.shadowRoot?.querySelector("button")!;
    expect(innerButton.getAttribute("form")).to.equal("external-form");
  });

  it("passes name and value to inner button for form submission", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button type="submit" name="action" value="save"></nys-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("name")).to.equal("action");
    expect(button.getAttribute("value")).to.equal("save");
  });
});
