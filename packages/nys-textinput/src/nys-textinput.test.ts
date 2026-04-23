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

  it("should focus on the internal textinput via the delegatesFocus", async () => {
    const el = await fixture<NysTextinput>(html`
      <nys-textinput label="Test Input"></nys-textinput>
    `);

    await el.updateComplete;

    el.focus();
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input");

    // Because delegatesFocus is true, focusing the custom element
    // should automatically focus the internal input
    expect(document.activeElement).to.equal(el);
    expect(el.shadowRoot!.activeElement).to.equal(input);
  });

  it("resets value, validation, and UI when form is reset", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-textinput
          value="Initial"
          showError
          errorMessage="Error"
        ></nys-textinput>
      </form>
    `);

    const el = form.querySelector<NysTextinput>("nys-textinput")!;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;

    (el as any).showPassword = true; // this is private on the textinput, so need to set it directly here
    await el.updateComplete;

    // initial state
    expect(el.value).to.equal("Initial");
    expect(input.value).to.equal("Initial");
    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.equal("Error");
    expect((el as any).showPassword).to.be.true;

    form.reset();
    await el.updateComplete;

    expect(el.value).to.equal("");
    expect(input.value).to.equal("");
    expect(el.showError).to.be.false;
    expect(el.errorMessage).to.equal("");
    expect((el as any).showPassword).to.be.false;
    expect((el as any)._internals.validity.valid).to.be.true;
  });

  // -------------------------------------------------------------------------
  // _handleInvalid
  // -------------------------------------------------------------------------

  it("_handleInvalid prevents default", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput required></nys-textinput>`,
    );
    await el.updateComplete;

    const event = new Event("invalid", { cancelable: true });
    el.dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
  });

  it("_handleInvalid sets showError via _validate()", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput required></nys-textinput>`,
    );
    await el.updateComplete;

    expect(el.showError).to.be.false;
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.showError).to.be.true;
  });

  it("_handleInvalid enables eager validation on subsequent input", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput required></nys-textinput>`,
    );
    await el.updateComplete;

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;

    expect(el.showError).to.be.true;
  });

  it("_handleInvalid focuses the input when not inside a form", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput required></nys-textinput>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(focused).to.be.true;
  });

  it("_handleInvalid focuses the input when it is the first invalid element in a form", async () => {
    const container = await fixture<HTMLElement>(html`
      <form>
        <nys-textinput id="only" required></nys-textinput>
      </form>
    `);
    const el = container.querySelector<NysTextinput>("#only")!;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(focused).to.be.true;
  });

  it("_handleInvalid does not focus when a preceding invalid input exists in the same form", async () => {
    const container = await fixture<HTMLElement>(html`
      <form>
        <nys-textinput id="first" required></nys-textinput>
        <nys-textinput id="second" required></nys-textinput>
      </form>
    `);
    const second = container.querySelector<NysTextinput>("#second")!;
    await second.updateComplete;

    const input = second.shadowRoot!.querySelector("input")!;
    let focused = false;
    input.focus = () => {
      focused = true;
    };

    second.dispatchEvent(new Event("invalid", { cancelable: true }));
    await second.updateComplete;

    expect(focused).to.be.false;
  });

  it("_applyMask generic loop fills digit placeholders with input digits", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    // Inject a custom mask pattern using _ as digit placeholder
    (el as any)._maskPatterns["text"] = "___-___";
    (el as any).type = "text";

    const result = (el as any)._applyMask("123456", "___-___");
    expect(result).to.equal("123-456");
  });

  it("_applyMask generic loop stops when digits run out", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    const result = (el as any)._applyMask("12", "___-___");
    expect(result).to.equal("12");
  });

  it("_applyMask generic loop treats 'd' as a digit placeholder", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    const result = (el as any)._applyMask("42", "d/d");
    expect(result).to.equal("4/2");
  });

  it("_applyMask generic loop treats '9' as a digit placeholder", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    const result = (el as any)._applyMask("99", "9-9");
    expect(result).to.equal("9-9");
  });

  it("_applyMask generic loop passes through literal formatting characters", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    // All characters in mask are literals (no _ or d/9) — they all pass through
    const result = (el as any)._applyMask("", "XX-XX");
    expect(result).to.equal("XX-XX");
  });

  // -------------------------------------------------------------------------
  // More Event Tests
  // -------------------------------------------------------------------------
  it("fires nys-input with correct detail on input", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    await el.updateComplete;

    let eventDetail: any = null;
    el.addEventListener("nys-input", (e: any) => (eventDetail = e.detail));

    const input = el.shadowRoot!.querySelector("input");
    input!.value = "hello";
    input?.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(el.value).to.equal("hello");
    expect(eventDetail).to.exist;
    expect(eventDetail.value).to.equal("hello");
    expect(eventDetail.id).to.equal(el.id);
  });

  it("fires nys-focus when input gains focus", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    let focused = false;
    el.addEventListener("nys-focus", () => (focused = true));

    const input = el.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    await el.updateComplete;

    expect(focused).to.be.true;
  });

  it("fires nys-blur when input loses focus", async () => {
    const el = await fixture<NysTextinput>(
      html`<nys-textinput></nys-textinput>`,
    );
    let blurred = false;
    el.addEventListener("nys-blur", () => (blurred = true));

    const input = el.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    await el.updateComplete;

    expect(blurred).to.be.true;
  });

  // -------------------------------------------------------------------------
  // Regression test: clearing "value" prop must sync setFormValue()
  // -------------------------------------------------------------------------

  it("programmatically setting value to empty string or null updates FormData", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-textinput name="test-field" value="stale-value"></nys-textinput>
      </form>
    `);

    const el = form.querySelector<NysTextinput>("nys-textinput")!;
    await el.updateComplete;

    expect(new FormData(form).get("test-field")).to.equal("stale-value");

    el.value = "";
    await el.updateComplete;
    expect(new FormData(form).get("test-field")).to.equal("");

    el.value = "stale-value";
    await el.updateComplete;

    (el as any).value = null;
    await el.updateComplete;
    expect(new FormData(form).get("test-field")).to.equal(null);
  });

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-textinput label="First Name"></nys-textinput>`,
    );
    await expect(el).shadowDom.to.be.accessible();
    // does label map to aria-label
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    expect(input?.getAttribute("aria-label")).to.equal("First Name");
  });
});
