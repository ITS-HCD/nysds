import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
import { NysButton } from "./nys-button";
// nys-button.ts imports nys-icon itself as a side effect (rendered as the
// default prefix/suffix/circle icon content) — do not re-import it here. A
// test-file-only import would mask a regression where that self-import is
// removed from the component (see #1819 / findUnregisteredChildren below).
import "../dist/nys-button.js";

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

  it("exposes button semantics to screen readers without a redundant role", async () => {
    // WCAG fix: the native <button> carries its implicit role; an explicit
    // role="button" was removed as redundant. The element must still be a
    // <button> (implicit role) and must not re-declare the role.
    const el = await fixture<NysButton>(
      html`<nys-button label="Accessible Button"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button, a")!;

    expect(button.tagName.toLowerCase()).to.equal("button");
    expect(button.hasAttribute("role")).to.be.false;
  });

  it("should reflect 'label' prop", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Click Me"></nys-button>`,
    );

    const label = el.shadowRoot?.querySelector(".nys-button__text");
    expect(label).to.exist;
    expect(label?.textContent).to.equal("Click Me");
  });

  it("sets aria-describedby when ariaDescribedBy is provided", async () => {
    const el = await fixture(
      html`<nys-button label="Save" ariaDescribedBy="help-text"></nys-button>`,
    );
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.getAttribute("aria-describedby")).to.equal("help-text");
  });

  it("does not set aria-label or aria-describedby by default", async () => {
    const el = await fixture(html`<nys-button label="Save"></nys-button>`);
    const button = el.shadowRoot?.querySelector("button")!;
    expect(button.hasAttribute("aria-label")).to.be.false;
    expect(button.hasAttribute("aria-describedby")).to.be.false;
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

  it("renders the label as visually hidden text when circle is true", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button circle icon="close" label="Close"></nys-button>`,
    );
    const text = el.shadowRoot?.querySelector(".nys-button__text")!;
    expect(text).to.exist;
    expect(text.classList.contains("sr-only")).to.be.true;
    expect(text.textContent?.trim()).to.equal("Close");
  });

  it("should render prefix and suffix icons as props", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button
        label="With Icons"
        prefixIcon="arrow_back"
        suffixIcon="arrow_forward"
      ></nys-button>`,
    );

    const prefixIcon = el.shadowRoot?.querySelector(
      "nys-icon[name='arrow_back']",
    );
    const suffixIcon = el.shadowRoot?.querySelector(
      "nys-icon[name='arrow_forward']",
    );
    expect(prefixIcon).to.exist;
    expect(prefixIcon!.getAttribute("name")).to.equal("arrow_back");
    expect(prefixIcon!.getAttribute("size")).to.equal("16");

    expect(suffixIcon).to.exist;
    expect(suffixIcon!.getAttribute("name")).to.equal("arrow_forward");
    expect(suffixIcon!.getAttribute("size")).to.equal("16");
  });

  it(" should allow for the prefix icon to be slotted in", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button size="sm">
        <nys-icon slot="prefix-icon" size="2xl" name="visibility"></nys-icon>
      </nys-button>`,
    );
    const prefixIcon = el.querySelector("nys-icon[name='visibility']");

    expect(el.prefixIcon).to.exist;
    expect(prefixIcon).to.exist;
  });

  it(" should allow for the suffix icon to be slotted in", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button size="sm">
        <nys-icon slot="suffix-icon" size="2xl" name="visibility"></nys-icon>
      </nys-button>`,
    );
    const suffixIcon = el.querySelector("nys-icon[name='visibility']");

    expect(el.suffixIcon).to.exist;
    expect(suffixIcon).to.exist;
  });

  it(" should allow for the circle icon to be slotted in", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button size="sm" circle>
        <nys-icon slot="circle-icon" size="2xl" name="visibility"></nys-icon>
      </nys-button>`,
    );
    const circleIcon = el.querySelector("nys-icon[name='visibility']");

    expect(el.icon).to.exist;
    expect(circleIcon).to.exist;
  });

  it("should render text content via default slot", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button>Click Me</nys-button>`,
    );
    await el.updateComplete;

    const textContent = el.textContent?.trim();
    expect(textContent).to.include("Click Me");
  });

  it("should prefer label prop over default slot", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="From Prop">From Slot</nys-button>`,
    );
    await el.updateComplete;

    const labelEl = el.shadowRoot?.querySelector(".nys-button__text");
    expect(labelEl?.textContent).to.equal("From Prop");
  });

  it("renders correct icon sizes for regular and circle buttons", async () => {
    // Regular button with prefix icon
    const regularEl = await fixture<NysButton>(
      html`<nys-button
        label="Regular"
        prefixIcon="arrow_back"
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

  it("derives its accessible name from the rendered label text", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Label Only"></nys-button>`,
    );
    const button = el.shadowRoot!.querySelector("button")!;
    expect(button.hasAttribute("aria-label")).to.be.false;
    expect(button.textContent).to.include("Label Only");
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
  it("executes onclick attribute via keyboard Enter", async () => {
    (window as any).__testClicked = false;

    const el = await fixture<NysButton>(html`
      <nys-button
        label="Attr Test"
        onclick="window.__testClicked = true"
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

    expect((window as any).__testClicked).to.be.true;

    delete (window as any).__testClicked;
  });

  it("executes onclick attribute via keyboard Space", async () => {
    (window as any).__testClicked = false;

    const el = await fixture<NysButton>(html`
      <nys-button
        label="Attr Test"
        onclick="window.__testClicked = true"
      ></nys-button>
    `);
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector("button")!;

    button.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;

    expect((window as any).__testClicked).to.be.true;

    delete (window as any).__testClicked;
  });
});

// Regression tests for the @nysds/internals migration + seeded WCAG fixes.
describe("nys-button internals migration", () => {
  it("native button derives its accessible name from label (no redundant role)", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Save Changes"></nys-button>`,
    );
    const button = el.shadowRoot!.querySelector("button.nys-button")!;

    // Accessible name comes from the rendered label text, not a synthetic
    // aria-label duplicating it.
    expect(button.hasAttribute("aria-label")).to.be.false;
    expect(button.textContent).to.include("Save Changes");
    // Implicit <button> role only; the redundant explicit role was removed.
    expect(button.hasAttribute("role")).to.be.false;
  });

  it("relies on native disabled, not a redundant aria-disabled, on the button", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Disabled" disabled></nys-button>`,
    );
    const button =
      el.shadowRoot!.querySelector<HTMLButtonElement>("button.nys-button")!;

    expect(button.disabled).to.be.true;
    // Native disabled conveys the state; aria-disabled was removed as redundant.
    expect(button.hasAttribute("aria-disabled")).to.be.false;
  });

  it("exposes ElementInternals via the mixin (internals, not _internals)", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Btn"></nys-button>`,
    );
    expect((el as any).internals).to.exist;
    expect((el.constructor as typeof NysButton).formAssociated).to.be.true;
  });

  it("participates in a <form> and routes submit through internals.form", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);

    const submitBtn = await fixture<NysButton>(
      html`<nys-button type="submit" label="Submit"></nys-button>`,
    );
    form.appendChild(submitBtn);

    // The mixin's ElementInternals must resolve the owning form.
    expect((submitBtn as any).internals.form).to.equal(form);

    let submitted = false;
    form.requestSubmit = () => {
      submitted = true;
    };

    const btnEl =
      submitBtn.shadowRoot!.querySelector<HTMLButtonElement>(
        "button.nys-button",
      )!;
    btnEl.click();
    await submitBtn.updateComplete;

    expect(submitted).to.be.true;

    document.body.removeChild(form);
  });

  // Regression: #1794 — a custom element with no role does not map its ARIA
  // into the accessibility tree, and host ARIA does not cross the shadow
  // boundary. Disclosure state has to be forwarded to the real <button>/<a>.
  describe("aria-expanded forwarding", () => {
    it("forwards ariaExpanded to the internal <button>", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button
          label="Here's how you know"
          ariaExpanded="false"
          ariaControls="trust-bar"
        ></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("button.nys-button")!;
      expect(inner.getAttribute("aria-expanded")).to.equal("false");
      expect(inner.getAttribute("aria-controls")).to.equal("trust-bar");
    });

    it("propagates state changes to the internal <button>", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button label="Toggle" ariaExpanded="false"></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("button.nys-button")!;
      expect(inner.getAttribute("aria-expanded")).to.equal("false");

      el.ariaExpanded = "true";
      await el.updateComplete;
      expect(inner.getAttribute("aria-expanded")).to.equal("true");
    });

    it("omits aria-expanded entirely when unset", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button label="Plain"></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("button.nys-button")!;
      expect(inner.hasAttribute("aria-expanded")).to.equal(false);
    });

    it("forwards ariaExpanded to the internal <a> when href is set", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button
          label="Menu"
          href="#menu"
          ariaExpanded="true"
        ></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("a.nys-button")!;
      expect(inner.getAttribute("aria-expanded")).to.equal("true");
    });
  });

  // Regression: #1104 — same shape as the disclosure state above. A pagination
  // control marks its current page on the host; that never reaches the <button>
  // assistive tech actually interacts with unless the component forwards it.
  describe("aria-current forwarding", () => {
    it("forwards ariaCurrent to the internal <button>", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button label="3" ariaCurrent="page"></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("button.nys-button")!;
      expect(inner.getAttribute("aria-current")).to.equal("page");
    });

    it("drops aria-current from the internal <button> when cleared", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button label="3" ariaCurrent="page"></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("button.nys-button")!;
      expect(inner.getAttribute("aria-current")).to.equal("page");

      el.ariaCurrent = "";
      await el.updateComplete;
      expect(inner.hasAttribute("aria-current")).to.equal(false);
    });

    it("omits aria-current entirely when unset", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button label="Plain"></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("button.nys-button")!;
      expect(inner.hasAttribute("aria-current")).to.equal(false);
    });

    it("forwards ariaCurrent to the internal <a> when href is set", async () => {
      const el = await fixture<NysButton>(
        html`<nys-button
          label="Help"
          href="/help"
          ariaCurrent="page"
        ></nys-button>`,
      );
      await el.updateComplete;

      const inner = el.shadowRoot!.querySelector("a.nys-button")!;
      expect(inner.getAttribute("aria-current")).to.equal("page");
    });
  });
});

describe("nys-button self-registration", () => {
  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Test" prefixIcon="check"></nys-button>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});
