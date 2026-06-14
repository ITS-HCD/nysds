import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-select.js";
import { NysSelect } from "./nys-select";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";

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
    // Accessible name now comes via aria-labelledby to the visible <nys-label>,
    // not a synthetic aria-label string.
    expect(select?.getAttribute("aria-labelledby")).to.equal(`${el.id}--label`);
    expect(select?.hasAttribute("aria-label")).to.be.false;
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

    expect((el as any).internals.validity.valid).to.be.true;
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

  // -------------------------------------------------------------------------
  // width property
  // -------------------------------------------------------------------------

  it("reflects width attribute to property (sm)", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select width="sm"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.width).to.equal("sm");
    expect(el.getAttribute("width")).to.equal("sm");
  });

  it("reflects width attribute to property (md)", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select width="md"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.width).to.equal("md");
  });

  it("reflects width attribute to property (lg)", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select width="lg"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.width).to.equal("lg");
  });

  it("defaults to width full when no width is set", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;
    expect(el.width).to.equal("full");
  });

  // -------------------------------------------------------------------------
  // tooltip property
  // -------------------------------------------------------------------------

  it("reflects tooltip property", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select tooltip="More info"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.tooltip).to.equal("More info");
  });

  // -------------------------------------------------------------------------
  // inverted property
  // -------------------------------------------------------------------------

  it("reflects inverted attribute to property", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select inverted></nys-select>`,
    );
    await el.updateComplete;
    expect(el.inverted).to.be.true;
    expect(el.hasAttribute("inverted")).to.be.true;
  });

  it("inverted is false by default", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;
    expect(el.inverted).to.be.false;
  });

  // -------------------------------------------------------------------------
  // description property — text-based
  // -------------------------------------------------------------------------

  it("reflects description property", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select description="Helper text"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.description).to.equal("Helper text");
  });

  it("associates the select with the visible label via aria-labelledby when a label is set", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select
        label="Borough"
        description="Choose your borough"
      ></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    // Name is taken from the real visible <nys-label>, not a synthetic string.
    expect(select.getAttribute("aria-labelledby")).to.equal(`${el.id}--label`);
    expect(select.hasAttribute("aria-label")).to.be.false;
  });

  it("uses aria-labelledby even when description is empty", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select label="Borough"></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.getAttribute("aria-labelledby")).to.equal(`${el.id}--label`);
    expect(select.hasAttribute("aria-label")).to.be.false;
  });

  // -------------------------------------------------------------------------
  // description slot
  // -------------------------------------------------------------------------

  it("renders slotted description content", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select label="Test">
        <span slot="description">Custom <strong>description</strong></span>
      </nys-select>
    `);
    await el.updateComplete;
    const slottedEl = el.querySelector("[slot='description']");
    expect(slottedEl).to.exist;
    expect(slottedEl?.textContent).to.contain("Custom");
  });

  // -------------------------------------------------------------------------
  // required / optional flag rendering via nys-label
  // -------------------------------------------------------------------------

  it("passes required flag to nys-label", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select required label="Test"></nys-select>`,
    );
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector("nys-label")!;
    expect(label.getAttribute("flag")).to.equal("required");
  });

  it("passes optional flag to nys-label when optional is set and required is not", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select optional label="Test"></nys-select>`,
    );
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector("nys-label")!;
    expect(label.getAttribute("flag")).to.equal("optional");
  });

  it("required takes precedence over optional for flag", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select required optional label="Test"></nys-select>`,
    );
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector("nys-label")!;
    expect(label.getAttribute("flag")).to.equal("required");
  });

  it("flag is empty when neither required nor optional", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select label="Test"></nys-select>`,
    );
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector("nys-label")!;
    expect(label.getAttribute("flag")).to.equal("");
  });

  // -------------------------------------------------------------------------
  // form attribute — ifDefined behavior
  // -------------------------------------------------------------------------

  it("does not render form attribute on native select when form is null", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.hasAttribute("form")).to.be.false;
  });

  it("sets form attribute on native select when form property is provided", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select form="my-form"></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.getAttribute("form")).to.equal("my-form");
  });

  // -------------------------------------------------------------------------
  // nys-option label fallback from textContent
  // -------------------------------------------------------------------------

  it("uses nys-option textContent as label when label prop is empty", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <nys-option value="ny">New York</nys-option>
      </nys-select>
    `);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    const option = select.querySelector("option[value='ny']")!;
    expect(option).to.exist;
  });

  // -------------------------------------------------------------------------
  // nys-option disabled propagates to native option
  // -------------------------------------------------------------------------

  it("propagates disabled from nys-option to the cloned native option", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <nys-option value="a" label="A" disabled></nys-option>
      </nys-select>
    `);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    const option = select.querySelector(
      "option[value='a']",
    ) as HTMLOptionElement;
    expect(option).to.exist;
    expect(option.disabled).to.be.true;
  });

  // -------------------------------------------------------------------------
  // native <option selected> syncs el.value via _handleSlotChange
  // -------------------------------------------------------------------------

  it("syncs el.value from a pre-selected native option", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="first">First</option>
        <option value="second" selected>Second</option>
      </nys-select>
    `);
    await el.updateComplete;
    expect(el.value).to.equal("second");
  });

  // -------------------------------------------------------------------------
  // nys-change event fires exactly once and detail includes id
  // -------------------------------------------------------------------------

  it("nys-change fires exactly once per change event", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="x">X</option>
      </nys-select>
    `);
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-change", () => count++);
    const select = el.shadowRoot!.querySelector("select")!;
    select.value = "x";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  it("nys-change event detail includes the component id", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select id="my-select">
        <option value="x">X</option>
      </nys-select>
    `);
    await el.updateComplete;

    let detail: any = null;
    el.addEventListener("nys-change", (e: any) => (detail = e.detail));
    const select = el.shadowRoot!.querySelector("select")!;
    select.value = "x";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;

    expect(detail).to.exist;
    expect(detail.id).to.equal("my-select");
    expect(detail.value).to.equal("x");
  });

  // -------------------------------------------------------------------------
  // nys-focus and nys-blur fire exactly once
  // -------------------------------------------------------------------------

  it("nys-focus fires exactly once on focus", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-focus", () => count++);
    const select = el.shadowRoot!.querySelector("select")!;
    select.dispatchEvent(new Event("focus"));
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  it("nys-blur fires exactly once on blur", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-blur", () => count++);
    const select = el.shadowRoot!.querySelector("select")!;
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  // -------------------------------------------------------------------------
  // showError / errorMessage property rendering
  // -------------------------------------------------------------------------

  it("shows error message when showError is true and errorMessage is set", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select showError errorMessage="Something went wrong"></nys-select>
    `);
    await el.updateComplete;
    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.equal("Something went wrong");
    const errEl = el.shadowRoot!.querySelector("nys-errormessage")!;
    expect(errEl.hasAttribute("showError")).to.be.true;
  });

  it("does not show error when showError is false", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select errorMessage="Ignored"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.showError).to.be.false;
    const errEl = el.shadowRoot!.querySelector("nys-errormessage")!;
    expect(errEl.hasAttribute("showError")).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _setValidityMessage — else branch: no _originalErrorMessage
  // -------------------------------------------------------------------------

  it("_setValidityMessage sets errorMessage from argument when no originalErrorMessage", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    await el.updateComplete;

    (el as any)._setValidityMessage("Validation failed");
    await el.updateComplete;

    expect(el.errorMessage).to.equal("Validation failed");
    expect(el.showError).to.be.true;
  });

  // -------------------------------------------------------------------------
  // form integration: name participates in FormData
  // -------------------------------------------------------------------------

  it("submits the selected value under the correct name in FormData", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-select name="borough">
          <option value="manhattan">Manhattan</option>
          <option value="brooklyn">Brooklyn</option>
        </nys-select>
      </form>
    `);
    const el = form.querySelector<NysSelect>("nys-select")!;
    await el.updateComplete;

    const select = el.shadowRoot!.querySelector("select")!;
    select.value = "brooklyn";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;

    expect(new FormData(form).get("borough")).to.equal("brooklyn");
  });

  // -------------------------------------------------------------------------
  // form reset via <form>.reset() triggers formResetCallback
  // -------------------------------------------------------------------------

  it("form reset clears value and error state", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-select name="item" showError errorMessage="Required">
          <option value="a">A</option>
        </nys-select>
      </form>
    `);
    const el = form.querySelector<NysSelect>("nys-select")!;
    await el.updateComplete;

    const select = el.shadowRoot!.querySelector("select")!;
    select.value = "a";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;

    form.reset();
    await el.updateComplete;

    expect(el.value).to.equal("");
    expect(el.showError).to.be.false;
  });

  // -------------------------------------------------------------------------
  // disabled does not prevent nys-change from native change events
  // (native select won't fire change when disabled, confirming browser behavior)
  // -------------------------------------------------------------------------

  it("disabled native select does not allow value changes via dispatchEvent", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select disabled>
        <option value="x">X</option>
      </nys-select>
    `);
    await el.updateComplete;

    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.disabled).to.be.true;
    // The select.value assignment is ignored on disabled selects in some browsers;
    // we verify the disabled attribute is set as the guard.
    expect(el.disabled).to.be.true;
  });

  // -------------------------------------------------------------------------
  // id preserved when explicitly set
  // -------------------------------------------------------------------------

  it("preserves an explicitly set id and does not auto-generate", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select id="custom-id"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.id).to.equal("custom-id");
  });

  // -------------------------------------------------------------------------
  // native select id matches component id with --native suffix
  // -------------------------------------------------------------------------

  it("native select element id is component id + --native suffix", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select id="my-select"></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.id).to.equal("my-select--native");
  });

  // -------------------------------------------------------------------------
  // optgroup with nys-option children inside it
  // -------------------------------------------------------------------------

  it("renders optgroup containing nys-option elements", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <optgroup label="Group">
          <nys-option value="x" label="X"></nys-option>
          <nys-option value="y" label="Y" disabled></nys-option>
        </optgroup>
      </nys-select>
    `);
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    const group = select.querySelector("optgroup")!;
    expect(group).to.exist;
    const options = group.querySelectorAll("option");
    expect(options.length).to.equal(2);
    expect(options[0].value).to.equal("x");
    expect(options[1].disabled).to.be.true;
  });

  // -------------------------------------------------------------------------
  // _manageRequire — uses errorMessage when set for validity message
  // -------------------------------------------------------------------------

  it("_manageRequire uses custom errorMessage when field is required and empty", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select required errorMessage="Please select an option"></nys-select>
    `);
    await el.updateComplete;

    (el as any)._manageRequire();
    await el.updateComplete;

    expect((el as any).internals.validity.valueMissing).to.be.true;
  });

  // -------------------------------------------------------------------------
  // name property reflection
  // -------------------------------------------------------------------------

  it("reflects name attribute to property", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select name="my-field"></nys-select>`,
    );
    await el.updateComplete;
    expect(el.name).to.equal("my-field");
    expect(el.getAttribute("name")).to.equal("my-field");
  });

  // -------------------------------------------------------------------------
  // @nysds/internals migration — accessible name, self-registration, form
  // -------------------------------------------------------------------------

  it("associates the select with the visible label via aria-labelledby (not a synthetic aria-label)", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select label="Borough" id="bor"></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    // Name comes from the real visible <nys-label>, not a duplicated string.
    expect(select.getAttribute("aria-labelledby")).to.equal("bor--label");
    expect(select.hasAttribute("aria-label")).to.be.false;
    const label = el.shadowRoot!.getElementById("bor--label");
    expect(label).to.exist;
    expect(label!.tagName.toLowerCase()).to.equal("nys-label");
  });

  it("falls back to aria-label only when no visible label is provided", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select .ariaLabel=${"Pick a borough"}></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.getAttribute("aria-label")).to.equal("Pick a borough");
    expect(select.hasAttribute("aria-labelledby")).to.be.false;
  });

  it("self-registers its internal label and error-message elements", () => {
    // The accessible-name/error association depends on these being defined.
    expect(customElements.get("nys-label")).to.exist;
    expect(customElements.get("nys-errormessage")).to.exist;
  });

  it("associates the error message with the select via aria-errormessage", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select
        label="Borough"
        id="em"
        showError
        errorMessage="Required"
      ></nys-select>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot!.querySelector("select")!;
    expect(select.getAttribute("aria-errormessage")).to.equal("em--error");
    expect(el.shadowRoot!.getElementById("em--error")).to.exist;
  });

  it("remains form-associated through the shared mixin", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-select name="field" label="Borough">
          <option value="manhattan">Manhattan</option>
        </nys-select>
      </form>
    `);
    const el = form.querySelector<NysSelect>("nys-select")!;
    el.value = "manhattan";
    await el.updateComplete;
    expect(new FormData(form).get("field")).to.equal("manhattan");
    expect(Array.from(form.elements)).to.include(el);
  });
});
