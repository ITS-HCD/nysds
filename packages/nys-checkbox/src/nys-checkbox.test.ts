import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-checkbox.js";
import { NysCheckbox } from "./nys-checkbox";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-checkbox", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-checkbox></nys-checkbox>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox label="My Label" required></nys-checkbox>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
  });

  it("tile prop render", async () => {
    const el = await fixture(html`
      <nys-checkboxgroup tile>
        <nys-checkbox label="My Label"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    expect(el.hasAttribute("tile")).to.be.true;
  });

  it("toggles checked state when clicked", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Toggle me"></nys-checkbox>`,
    );

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(input).to.exist;

    expect(el.checked).to.be.false;
    expect(input!.checked).to.be.false;

    // click to check
    input!.click();
    await el.updateComplete;

    expect(el.checked).to.be.true;
    expect(el.hasAttribute("checked")).to.be.true;
    expect(input!.checked).to.be.true;

    // click to uncheck
    input!.click();
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(el.hasAttribute("checked")).to.be.false;
    expect(input!.checked).to.be.false;
  });

  it("toggles checked state when Space key is pressed on input", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Toggle me"></nys-checkbox>`,
    );

    const input = await el.getInputElement();
    expect(el.checked).to.be.false;

    input!.dispatchEvent(
      new KeyboardEvent("keydown", { code: "Space", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.true;

    input!.dispatchEvent(
      new KeyboardEvent("keydown", { code: "Space", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.false;
  });

  it("does not toggle when disabled and Space is pressed", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox disabled></nys-checkbox>`,
    );

    const input = await el.getInputElement();

    input!.dispatchEvent(
      new KeyboardEvent("keydown", { code: "Space", bubbles: true }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.false;
  });

  it("emits nys-focus and nys-blur when tabbing to and from the checkbox", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="test"></nys-checkbox>`,
    );

    const input = await el.getInputElement();
    const events: string[] = [];

    el.addEventListener("nys-focus", () => events.push("focus"));
    el.addEventListener("nys-blur", () => events.push("blur"));

    // Simulate tabbing into the checkbox
    input!.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    // Simulate tabbing out of the checkbox
    input!.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await el.updateComplete;

    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("uses slotted description text for accessibility", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox label="My Label">
        <label slot="description">Extra details</label>
      </nys-checkbox>
    `);

    await el.updateComplete;

    expect(el.label).to.equal("My Label");

    const nysLabel = el.shadowRoot!.querySelector("nys-label");
    expect(nysLabel).to.exist;

    const slot = nysLabel!.querySelector(
      'slot[name="description"]',
    ) as HTMLSlotElement;

    expect(slot).to.exist;

    const assignedText = slot
      .assignedNodes({ flatten: true })
      .map((n) => n.textContent?.trim())
      .join("");

    expect(assignedText).to.equal("Extra details");
  });

  /*** Other test ***/
  it("renders with other property set", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox other label="My Checkbox"></nys-checkbox>
    `);

    expect(el.other).to.be.true;
    expect(el.hasAttribute("other")).to.be.true;
  });

  it("shows 'Other' label when other is true and label is empty", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;
    const nysLabel = el.shadowRoot!.querySelector("nys-label");
    expect(nysLabel).to.exist;
    expect(nysLabel?.getAttribute("label")).to.equal("Other");
  });

  it("uses custom label when provided with other property", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other label="Custom Other Label"></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;
    const nysLabel = el.shadowRoot!.querySelector("nys-label");
    expect(nysLabel!.getAttribute("label")).to.equal("Custom Other Label");
  });

  it("shows textinput when 'other' checkbox is checked", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other name="options"></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;

    // Initially no text input should be visible
    let textInput = el.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.not.exist;

    const input = await el.getInputElement();
    input?.click();
    await el.updateComplete;

    // Text input should now be visible
    textInput = el.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
  });

  it("hides text input when other checkbox is unchecked", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other checked></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;

    // Text input should be visible initially
    let textInput = el.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;

    const input = await el.getInputElement();
    input?.click();
    await el.updateComplete;

    // Text input should now be hidden after unchecking
    textInput = el.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.not.exist;
  });

  it("shows error when other checkbox is checked but text input is empty after blur", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other checked value=""></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;
    const textInput = el.shadowRoot?.querySelector("nys-textinput");
    expect(el.showOtherError).to.be.false;

    // Trigger blur event
    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await el.updateComplete;

    expect(el.showOtherError).to.be.true;
  });

  it("clears error when valid text is entered", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other checked value=""></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;
    const textInput = el.shadowRoot?.querySelector("nys-textinput");

    // First trigger error by blurring with empty value
    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await el.updateComplete;

    expect(el.showOtherError).to.be.true;

    // Now enter valid text
    const inputEvent = new Event("nys-input", { bubbles: true });
    Object.defineProperty(inputEvent, "target", {
      writable: false,
      value: { value: "Valid input" },
    });

    textInput?.dispatchEvent(inputEvent);
    textInput?.dispatchEvent(blurEvent);
    await el.updateComplete;

    expect(el.showOtherError).to.be.false;
  });

  /*** A11y Test ***/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-checkbox label="My Label"></nys-checkbox>`,
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
