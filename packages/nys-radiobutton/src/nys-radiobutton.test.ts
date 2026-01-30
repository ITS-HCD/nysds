import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-radiobutton.js";
import { NysRadiogroup } from "./nys-radiogroup";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-radiobutton", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-radiobutton></nys-radiobutton>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysRadiogroup>(
      html`<nys-radiogroup></nys-radiogroup>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-radiogroup-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysRadiogroup>(html`
      <nys-radiogroup
        label="What is your primary work location?"
        description="This is the location you use for your in office days."
        required
      >
        <nys-radiobutton
          name="office"
          label="Albany"
          description="Upstate New York"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          description="New York City"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    expect(el.label).to.equal("What is your primary work location?");
    expect(el.required).to.be.true;
  });

  it("tile prop render", async () => {
    const el = await fixture(html`
      <nys-radiogroup label="What is your primary work location?" tile>
        <nys-radiobutton
          name="office"
          label="Albany"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    expect(el.hasAttribute("tile")).to.be.true;
  });

  it("resets selected radio when formResetCallback is called", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup name="choices">
        <nys-radiobutton name="choices" value="a" checked></nys-radiobutton>
        <nys-radiobutton name="choices" value="b"></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    expect(radios[0].checked).to.be.true;
    expect(radios[1].checked).to.be.false;
    expect(group.selectedValue).to.equal("a");

    group.formResetCallback();

    // Expect all radios reset
    radios.forEach((radio) => {
      expect(radio.checked).to.be.false;
      expect(radio.getAttribute("aria-checked")).to.equal("false");
    });

    // Group state reset
    expect(group.selectedValue).to.be.null;
    expect(group.showError).to.be.false;
    expect(group.errorMessage).to.equal("");
    expect(group._internals.validity.valid).to.be.true;
  });

  it("resets radios when native form reset is triggered", async () => {
    const el = await fixture<HTMLFormElement>(html`
      <form>
        <nys-radiogroup name="choices">
          <nys-radiobutton name="choices" value="a" checked></nys-radiobutton>
          <nys-radiobutton name="choices" value="b"></nys-radiobutton>
        </nys-radiogroup>
      </form>
    `);

    const group = el.querySelector<NysRadiogroup>("nys-radiogroup");
    const radios = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    expect(radios[0].checked).to.be.true;
    expect(radios[1].checked).to.be.false;

    (group.closest("form") as HTMLFormElement).reset();

    // Expect all radios reset
    radios.forEach((radio) => {
      expect(radio.checked).to.be.false;
      expect(radio.getAttribute("aria-checked")).to.equal("false");
    });

    expect(group.selectedValue).to.be.null;
  });

  it("resets selected radio when formResetCallback is called", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup name="choices">
        <nys-radiobutton name="choices" value="a" checked></nys-radiobutton>
        <nys-radiobutton name="choices" value="b"></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    expect(radios[0].checked).to.be.true;
    expect(radios[1].checked).to.be.false;
    expect(group.selectedValue).to.equal("a");

    group.formResetCallback();

    // Expect all radios reset
    radios.forEach((radio) => {
      expect(radio.checked).to.be.false;
      expect(radio.getAttribute("aria-checked")).to.equal("false");
    });

    // Group state reset
    expect(group.selectedValue).to.be.null;
    expect(group.showError).to.be.false;
    expect(group.errorMessage).to.equal("");
    expect(group._internals.validity.valid).to.be.true;
  });

  it("resets radios when native form reset is triggered", async () => {
    const el = await fixture<HTMLFormElement>(html`
      <form>
        <nys-radiogroup name="choices">
          <nys-radiobutton name="choices" value="a" checked></nys-radiobutton>
          <nys-radiobutton name="choices" value="b"></nys-radiobutton>
        </nys-radiogroup>
      </form>
    `);

    const group = el.querySelector<NysRadiogroup>("nys-radiogroup");
    const radios = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    expect(radios[0].checked).to.be.true;
    expect(radios[1].checked).to.be.false;

    (group.closest("form") as HTMLFormElement).reset();

    // Expect all radios reset
    radios.forEach((radio) => {
      expect(radio.checked).to.be.false;
      expect(radio.getAttribute("aria-checked")).to.equal("false");
    });

    expect(group.selectedValue).to.be.null;
  });

  /*** Other test ***/
  it("renders with 'other' property set in radiogroup", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;

    expect(otherRadio).to.exist;
    expect(otherRadio.other).to.be.true;
    expect(otherRadio?.hasAttribute("other")).to.be.true;
  });

  it("shows 'Other' label when 'other' is true and label is empty", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;

    const nysLabel = otherRadio.shadowRoot?.querySelector("nys-label");
    expect(nysLabel).to.exist;
    expect(nysLabel?.getAttribute("label")).to.equal("Other");
  });

  it("uses custom label when provided with 'other' property", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other label="Custom Other Label"></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;

    const nysLabel = otherRadio.shadowRoot!.querySelector("nys-label");
    expect(nysLabel?.getAttribute("label")).to.equal("Custom Other Label");
  });

  it("shows text input when 'other' radiobutton is selected", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;

    // Initially no text input should be visible
    let textInput = otherRadio.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.not.exist;

    const input = await otherRadio.getInputElement();
    input?.click();
    await otherRadio.updateComplete;

    // Text input should now be visible
    textInput = otherRadio.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
  });

  it("hides text input when different radiobutton is selected", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;
    const regularRadio = radios.find((radio) => !radio.other) as NysRadiobutton;

    // Text input should be visible initially since "other" radiobutton is checked
    let textInput = otherRadio.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;

    // Select different radio
    const input = await regularRadio.getInputElement();
    input?.click();
    await otherRadio.updateComplete;
    await regularRadio.updateComplete;

    // Text input should now be hidden
    textInput = otherRadio.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.not.exist;
  });

  it("shows error when 'other' radio is selected but text input is empty after blur", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;
    const textInput = otherRadio.shadowRoot?.querySelector("nys-textinput");

    expect(otherRadio.showOtherError).to.be.false;

    // Trigger blur event
    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await otherRadio.updateComplete;

    expect(otherRadio.showOtherError).to.be.true;
  });

  it("clears 'other' validation error when valid text is entered", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find((radio) => radio.other) as NysRadiobutton;

    const textInput = otherRadio.shadowRoot!.querySelector("nys-textinput");

    // First trigger error by blurring with empty value
    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await otherRadio.updateComplete;

    expect(otherRadio.showOtherError).to.be.true;

    // Now enter valid text
    const inputEvent = new Event("nys-input", { bubbles: true });
    Object.defineProperty(inputEvent, "target", {
      writable: false,
      value: { value: "Valid input" },
    });

    textInput?.dispatchEvent(inputEvent);
    textInput?.dispatchEvent(blurEvent);
    await otherRadio.updateComplete;

    expect(otherRadio.showOtherError).to.be.false;
  });

  /*** A11y Test ***/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html` <nys-radiogroup label="What is your primary work location?">
        <nys-radiobutton
          name="office"
          label="Albany"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="office"
          label="Manhattan"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  // Other test to consider:
  // - Test for default values
  // - Test for different attributes
  // - Test for events
  // - Test for methods
  // - Test for accessibility
  // - Test for slot content
  // - Test for lifecycle methods
});
