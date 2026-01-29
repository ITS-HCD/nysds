import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import { NysTextinput } from "./nys-textinput";
import "../dist/nys-textinput.js";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";
import "@nysds/nys-icon";
/**
 * Test Tips (Official WTR Doc): Defaults, interactivity, customization, and accessibility, form a great baseline for testing most web UI.
 * When testing web UI it is important to think of your test inputs as a future visitor interacting with your web component or a future developer building with your web component.
 * https://open-wc.org/blog/testing-web-components-with-web-test-runner/
 * */

describe("nys-textinput", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-textinput></nys-textinput>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-textinput-\d+-\d+$/);
  });

  it("renders with default type as text", async () => {
    const el = await fixture(html`<nys-textinput></nys-textinput>`);
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.type).to.equal("text");
  });

  it("reflects attributes to properties", async () => {
    const el: any = await fixture(
      html`<nys-textinput label="My Label" required optional></nys-textinput>`,
    );

    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
  });

  it("show required symbol when type is required", async () => {
    const el = await fixture(html`<nys-textinput required></nys-textinput>`);
    const input = el.shadowRoot?.querySelector("input");

    expect(input?.hasAttribute("required")).to.be.true;
    expect(input?.hasAttribute("aria-required")).to.be.true;

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.getAttribute("flag")).to.equal("required");
  });

  it("ignores required if readonly is also set", async () => {
    const el = await fixture(
      html`<nys-textinput required readonly></nys-textinput>`,
    );

    const textinput = el.shadowRoot?.querySelector("input");

    expect(textinput?.hasAttribute("readonly")).to.be.true;
    expect(textinput?.hasAttribute("required")).to.be.false;
  });

  it("displays a toggle password icon that changes visibility when property type is password", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput type="password"></nys-textinput>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    const eyeButton = el.shadowRoot?.querySelector(
      "#password-toggle",
    ) as HTMLElement;
    const nativeButton = eyeButton.shadowRoot?.querySelector(
      "button",
    ) as HTMLButtonElement;
    nativeButton.click();
    await el.updateComplete;
    expect(input?.type).to.equal("text");
    nativeButton.click();
    await el.updateComplete;
    expect(input?.type).to.equal("password");
  });

  it("displays an error message when required field is empty", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput required></nys-textinput>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.value = "";
    input.dispatchEvent(new Event("input")); // simulate typing
    input.dispatchEvent(new Event("blur")); // simulate losing focus
    await el.updateComplete;

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
  });

  it("validates pattern mismatch", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput pattern="\\d+"></nys-textinput>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.value = "hello world";
    input?.dispatchEvent(new Event("blur")); // imitates user clicking in and out of input
    await el.updateComplete;

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
    expect(errorMessage?.getAttribute("errorMessage")).to.equal(
      "Invalid format",
    );
  });

  it("falls back to type text type is unset", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    expect(el.type).to.equal("text");
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.type).to.equal("text");
  });

  it("falls back to width full if width is unset", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;
    expect(el.width).to.equal("full");
  });

  it("runs native checkValidity", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    expect(el.checkValidity()).to.be.true;
  });

  it("validates startButton slot and removes extra non-nys-button nodes", async () => {
    // Temporarily silence console.warn for this test
    const originalWarn = console.warn;
    console.warn = () => {}; // no-op

    const el = await fixture<NysTextinput>(html`
      <nys-textinput>
        <div slot="startButton">invalid</div>
        <nys-button slot="startButton" label="MyBtn"></nys-button>
        <div slot="startButton">also invalid</div>
      </nys-textinput>
    `);

    const slot = el.shadowRoot?.querySelector('slot[name="startButton"]');
    slot?.dispatchEvent(new Event("slotchange"));
    await el.updateComplete;

    const container = el.shadowRoot?.querySelector(
      ".nys-textinput__buttoncontainer",
    );
    expect(container?.classList.contains("has-start-button")).to.be.true;

    // Restore console.warn after the test
    console.warn = originalWarn;
  });

  it("sets custom validity message and showError flag", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    (el as any)._setValidityMessage("Something is wrong");
    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.include("Something is wrong");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-textinput label="First Name"></nys-textinput>`,
    );
    await expect(el).shadowDom.to.be.accessible();
    // does label map to aria-label
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    expect(input?.getAttribute("aria-label")).to.equal("First Name");
  });

  it("renders a button in the slot", async () => {
    const el = await fixture(
      html`<nys-textinput name="searchInput" type="search" placeholder="Search">
        <nys-button
          slot="endButton"
          type="submit"
          label="Search"
          prefixIcon="search"
        ></nys-button>
      </nys-textinput>`,
    );
    const slot = el.shadowRoot?.querySelector(
      'slot[name="endButton"]',
    ) as HTMLSlotElement;
    const assigned = slot?.assignedElements() || [];
    const button = assigned.find(
      (el) => el.tagName.toLowerCase() === "nys-button",
    );
    expect(button).to.exist;
  });

  it("should not leave trailing dash or formatting characters when backspacing in masked input", async () => {
    const el = await fixture<NysTextinput>(html`
      <nys-textinput type="tel"></nys-textinput>
    `);

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;

    input.value = "1234567";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(input.value).to.equal("(123) 456-7");

    // Backspace
    input.setSelectionRange(input.value.length, input.value.length);
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }),
    );
    input.value = input.value.slice(0, -1);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(input.value).to.equal("(123) 456");
  });

  it("should dispatch focus and blur events", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput label="FocusMe"></nys-textinput>`,
    );
    const textinput = el.shadowRoot?.querySelector("input")!;

    // Focus event
    const focusEventPromise = oneEvent(el, "focus");
    textinput.focus();
    const focusEvent = await focusEventPromise;
    expect(focusEvent).to.exist;
    expect(textinput.matches(":focus-visible")).to.be.true;

    // Blur event
    const blurEventPromise = oneEvent(el, "blur");
    textinput.blur();
    const blurEvent = await blurEventPromise;
    expect(blurEvent).to.exist;
    expect(textinput.matches(":focus-visible")).to.be.false;

    // Should not focus when disabled
    textinput.disabled = true;
    textinput.focus();
    expect(document.activeElement).to.not.equal(textinput);
  });
});

// Test Plan for TDD
/*
 * NOTE TO SELF: Need further input from Mo on the idea of building out components
 * and best practice to develop tests as we go (from his experience working with TDD).
 * */
// To Mo: "When looking at something like the nys-textinput, what are your thoughts that we should have been thinking or making a plan during TDD to build this component up?"

// Renders component ✅
// Check if the component type is correctly rendered as "text" by default ✅
// Check required props ✅
// Toggle password visibility (show/hide) ✅
// Check error message display if required prop is not passed ✅
// Check error message display if invalid prop is passed ✅
// Passes a11y audit ✅

// Accessibility Tests
/*
 * Ensure that the <textinput> element is correctly associated with a label:
 * - Verify that the label is properly read by screen readers when the <textarea> is focused.
 */

/*
 * Ensure textinput is focusable and keyboard accessibility.
 */

/*
 * Placeholder is readable for screen readers.
 */

/*
 * Test for required attribute:
 * - If the textinput is required, ensure that the required message is readable for screen readers.
 */

/*
 * Test for disabled attribute:
 * - If the textinput is disabled, ensure that the disabled state is readable for screen readers. ❌ (we currently do not)
 */
