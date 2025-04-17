import { expect, html, fixture } from "@open-wc/testing";

import { sum } from "./sum";
import "../dist/nys-textinput.js";

/**
 * Test Tips (Official WTR Doc): Defaults, interactivity, customization, and accessibility, form a great baseline for testing most web UI.
 * When testing web UI it is important to think of your test inputs as a future visitor interacting with your web component or a future developer building with your web component.
 * https://open-wc.org/blog/testing-web-components-with-web-test-runner/
 * */

// FOR TESTING as I am trying to solve the issue with:
// ❌ Could not import your test module. Check the browser logs or open the browser in debug mode for more information.
it("should NOT pass this basic test", () => {
  expect(true).to.be.false;
});

// This is a test for the sum function (NOT part of the web component!!!!! JUST A TEST >:9)
it("sums up 2 numbers", () => {
  expect(sum(1, 1)).to.equal(2);
  expect(sum(3, 12)).to.equal(15);
});

// Render the component
describe("nys-textinput", () => {
  it("should render component", async () => {
    const el = await fixture(html`<nys-textinput></nys-textinput>`);
    expect(el).to.exist;
  });

  it("should render with default type as text", async () => {
    const el = await fixture(html`<nys-textinput></nys-textinput>`);
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.type).to.equal("text");
  });

  it("should show required symbol when type is required", async () => {
    const el = await fixture(html`<nys-textinput required></nys-textinput>`);
    const input = el.shadowRoot?.querySelector("input");

    expect(input?.hasAttribute("required")).to.be.true;
    expect(input?.hasAttribute("aria-required")).to.be.true;

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.getAttribute("flag")).to.equal("required");
  });

  it("displays a toggle password icon that changes visilibity when property type is password", async () => {
    const el = await fixture(
      html`<nys-textinput type="password"></nys-textinput>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    const eyeIcon = el.shadowRoot?.querySelector("eye-icon") as HTMLElement;

    expect(input?.type).to.equal("password");
    eyeIcon.click();
    expect(input?.type).to.equal("text");
    eyeIcon.click();
    expect(input?.type).to.equal("password");
  });

  it("displays an error message when required field is empty", async () => {
    const el = await fixture(html`<nys-textinput required></nys-textinput>`);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.value = "";
    input?.dispatchEvent(new Event("blur")); // imitates user clicking in and out of input

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.getAttribute("showError")).to.equal("true");
  });

  it("validates pattern mismatch", async () => {
    const el = await fixture(
      html`<nys-textinput pattern="\\d+">></nys-textinput>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.value = "hello world";
    input?.dispatchEvent(new Event("blur")); // imitates user clicking in and out of input

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.getAttribute("showError")).to.equal("true");
    expect(errorMessage?.getAttribute("errorMessage")).to.equal(
      "Invalid format",
    );
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-textinput></nys-textinput>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});

/*** Test Plan for TDD ***/
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

/*** Accessibility tests ***/
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
