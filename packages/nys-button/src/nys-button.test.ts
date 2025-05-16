import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import { NysButton } from "./nys-button";
import "../dist/nys-button.js";

describe("nys-button", () => {
  it("should have default type as button", async () => {
    const el = await fixture<NysButton>(html`<nys-button></nys-button>`);
    expect(el?.type).to.equal("button");
  });

  it("allows 'type' prop to adjust button behavior and reflect 'label' prop", async () => {
    const el = await fixture<NysButton>(
      html`<nys-button label="Click Me" type="submit"></nys-button>`,
    );
    expect(el?.type).to.equal("submit");

    const label = el.shadowRoot?.querySelector(".nys-button__text");
    expect(label).to.exist;
    expect(label?.textContent).to.equal("Click Me");
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

    // Blur event
    const blurEventPromise = oneEvent(el, "blur");
    button.blur();
    const blurEvent = await blurEventPromise;
    expect(blurEvent).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-avatar></nys-avatar>`);
    await expect(el).shadowDom.to.be.accessible();
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

/*** Accessibility tests ***/
/*
 * ENSURE ARIA LABELS:
 * - Buttons should have a label property to provide accessible text for screen readers (or default fallback text "button")
 * - Buttons should have property "ariaLabel" filled if no label is provided (i.e. icon button). Otherwise, at least a default fallback for aria-label is provided (e.g. "button")
 */

/*
 * ENSURE Disabled STATE:
 * - If the button is disabled, it should not be focusable or operable
 * - Screen readers should announce the button as disabled
 */

/*
 * ENSURE KEYBOARD SUPPORT:
 * - Buttons should be focusable and operable using the keyboard (e.g. Enter, Space, Arrow keys)
 */

/* ACCESSIBILITY INSIGHT TOOL (Feedback) */
/*
 * ENSURE COLOR CONTRAST:
 * - Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds
 */
