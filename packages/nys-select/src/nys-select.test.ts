import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-select.js";
import { NysSelect } from "./nys-select";

describe("nys-select", () => {
  it("renders the component", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-select-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select label="My Label" required optional disabled></nys-select>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
    expect(el.disabled).to.be.true;
  });

  it("generates a unique id if none is provided", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    expect(el.id).to.match(/^nys-select-\d+-\d+$/);
  });

  it("renders nys-option as native option", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <nys-option value="1" label="Option 1"></nys-option>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    const option = select.querySelector("option[value='1']");
    expect(option).to.exist;
    expect(option?.textContent).to.equal("Option 1");
  });

  it("renders native option passed in slot", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="2">Native Option</option>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    const option = select.querySelector("option[value='2']");
    expect(option).to.exist;
    expect(option?.textContent).to.equal("Native Option");
  });

  it("renders optgroup with nested options", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <optgroup label="Group 1">
          <option value="a">A</option>
          <option value="b">B</option>
          <nys-option value="c" label="C"></nys-option>
        </optgroup>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    const group = select.querySelector("optgroup")!;
    expect(group).to.exist;
    expect(group.label).to.equal("Group 1");

    const options = group.querySelectorAll("option");
    expect(options.length).to.equal(3);
    expect(options[0].value).to.equal("a");
    expect(options[1].value).to.equal("b");
    expect(options[2].value).to.equal("c");
  });

  it("handles required validation and displays error", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select required></nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    select.value = "";
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;
    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
  });

  it("updates value and emits nys-change", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="x">X</option>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    let eventDetail: any = null;
    el.addEventListener("nys-change", (e: any) => (eventDetail = e.detail));
    select.value = "x";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.value).to.equal("x");
    expect(eventDetail.value).to.equal("x");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select label="Select Something"></nys-select>
    `);
    await expect(el).shadowDom.to.be.accessible();
    const select = el.shadowRoot?.querySelector("select")!;
    expect(select?.getAttribute("aria-label")).to.equal("Select Something");
  });

  it("supports disabled attribute", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select disabled></nys-select>`,
    );
    const select = el.shadowRoot?.querySelector("select")!;
    expect(select?.disabled).to.be.true;
    expect(select?.getAttribute("aria-disabled")).to.equal("true");
  });

  it("supports focus and blur events", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    let focused = false;
    let blurred = false;
    el.addEventListener("nys-focus", () => (focused = true));
    el.addEventListener("nys-blur", () => (blurred = true));
    const select = el.shadowRoot?.querySelector("select")!;
    select.focus();
    select.dispatchEvent(new Event("focus"));
    select.blur();
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;
    expect(focused).to.be.true;
    expect(blurred).to.be.true;
  });

  it("runs native checkValidity", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    expect(el.checkValidity()).to.be.true;
  });

  it("resets value when formResetCallback is called", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select value="foo"></nys-select>`,
    );
    expect(el.value).to.equal("foo");
    el.formResetCallback();
    expect(el.value).to.equal("");
  });

  it("always calls event.preventDefault() on invalid", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select required></nys-select>`,
    );
    await el.updateComplete;

    const event = new Event("invalid", { cancelable: true });
    el.dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
  });

  // -------------------------------------------------------------------------
  // _handleSlotChange — nys-option with selected syncs el.value
  // -------------------------------------------------------------------------

  it("syncs el.value from a pre-selected nys-option", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <nys-option value="a" label="A"></nys-option>
        <nys-option value="b" label="B" selected></nys-option>
      </nys-select>
    `);
    await el.updateComplete;

    expect(el.value).to.equal("b");
  });

  it("renders a disabled optgroup correctly", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <optgroup label="Disabled Group" disabled>
          <option value="x">X</option>
        </optgroup>
      </nys-select>
    `);
    await el.updateComplete;

    const select = el.shadowRoot!.querySelector("select")!;
    const group = select.querySelector("optgroup")!;
    expect(group.disabled).to.be.true;
  });

  // -------------------------------------------------------------------------
  // _handleChange — required field clears showError on valid selection
  // -------------------------------------------------------------------------

  it("_handleChange clears showError when a required field gets a valid value", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select required>
        <option value="a">A</option>
      </nys-select>
    `);
    await el.updateComplete;

    // First trigger an error
    const select = el.shadowRoot!.querySelector("select")!;
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;
    expect(el.showError).to.be.true;

    // Now select a valid value
    select.value = "a";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;

    expect(el.showError).to.be.false;
    expect(el.errorMessage).to.equal("");
  });

  it("_handleChange re-validates eagerly when _hasUserInteracted is true", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select required>
        <option value="a">A</option>
      </nys-select>
    `);
    await el.updateComplete;

    // Trigger interaction via blur
    const select = el.shadowRoot!.querySelector("select")!;
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;
    expect(el.showError).to.be.true;

    // Change to valid value — eager validation should clear error
    select.value = "a";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;

    expect(el.showError).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _setValidityMessage — empty string clears error state
  // -------------------------------------------------------------------------

  it("_setValidityMessage with empty string clears showError and errorMessage", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;

    // Set an error first
    (el as any)._setValidityMessage("Something went wrong");
    await el.updateComplete;
    expect(el.showError).to.be.true;

    // Clear it
    (el as any)._setValidityMessage("");
    await el.updateComplete;

    expect(el.showError).to.be.false;
    expect(el.errorMessage).to.equal("");
  });

  it("_setValidityMessage uses _originalErrorMessage when set", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select errorMessage="Custom error"></nys-select>
    `);
    await el.updateComplete;

    // _originalErrorMessage is captured in connectedCallback
    (el as any)._setValidityMessage("Native validation message");
    await el.updateComplete;

    expect(el.errorMessage).to.equal("Custom error");
  });

  // -------------------------------------------------------------------------
  // _manageRequire — valid state resets ariaRequired and _hasUserInteracted
  // -------------------------------------------------------------------------

  it("_manageRequire resets validity and _hasUserInteracted when required field has a value", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select required>
        <option value="a">A</option>
      </nys-select>
    `);
    await el.updateComplete;

    (el as any)._hasUserInteracted = true;
    el.value = "a";
    (el as any)._manageRequire();
    await el.updateComplete;

    expect((el as any)._internals.validity.valid).to.be.true;
    expect((el as any)._hasUserInteracted).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _handleInvalid — sets showError explicitly
  // -------------------------------------------------------------------------

  it("_handleInvalid sets showError to true", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select required></nys-select>`,
    );
    await el.updateComplete;

    expect(el.showError).to.be.false;
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.showError).to.be.true;
  });

  // -------------------------------------------------------------------------
  // formResetCallback — full state reset
  // -------------------------------------------------------------------------

  it("formResetCallback resets native select options and clears showError and errorMessage", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select showError errorMessage="Pick one" required>
        <option value="a">A</option>
        <option value="b" selected>B</option>
      </nys-select>
    `);
    await el.updateComplete;

    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.equal("Pick one");

    el.formResetCallback();
    await el.updateComplete;

    expect(el.value).to.equal("");
    expect(el.showError).to.be.false;
    expect(el.errorMessage).to.equal("");

    const select = el.shadowRoot!.querySelector("select")!;
    const anySelected = Array.from(select.options).some(
      (o) => o.selected && o.value !== "",
    );
    expect(anySelected).to.be.false;
  });

  // -------------------------------------------------------------------------
  // checkValidity() — false path
  // -------------------------------------------------------------------------

  it("checkValidity() returns false when required and no value selected", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select required></nys-select>`,
    );
    await el.updateComplete;

    expect(el.checkValidity()).to.be.false;
  });

  // -------------------------------------------------------------------------
  // updated() — programmatic value change syncs to native select
  // -------------------------------------------------------------------------

  it("setting value programmatically after render syncs to native select element", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="a">A</option>
        <option value="b">B</option>
      </nys-select>
    `);
    await el.updateComplete;

    el.value = "b";
    await el.updateComplete;

    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.value).to.equal("b");
  });
  // -------------------------------------------------------------------------
  // Regression test: clearing "value" prop must sync setFormValue()
  // -------------------------------------------------------------------------
  it("programmatically setting value to empty string or null updates FormData", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-select name="test-field">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
        </nys-select>
      </form>
    `);

    const el = form.querySelector<NysSelect>("nys-select")!;
    await el.updateComplete;

    el.value = "apple";
    await el.updateComplete;
    expect(new FormData(form).get("test-field")).to.equal("apple");

    el.value = "";
    await el.updateComplete;
    expect(new FormData(form).get("test-field")).to.not.equal("apple");

    el.value = "banana";
    await el.updateComplete;

    (el as any).value = null;
    await el.updateComplete;
    expect(new FormData(form).get("test-field")).to.not.equal("banana");
  });
});
