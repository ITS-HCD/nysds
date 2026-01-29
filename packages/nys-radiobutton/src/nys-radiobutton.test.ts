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
