import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-checkbox.js";
import { NysCheckbox } from "./nys-checkbox";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-checkbox", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-checkbox></nys-checkbox>`);
    expect(el).to.exist;
  });

  it("generates a checkbox id if not provided", async () => {
    const el = await fixture<NysCheckbox>(html`<nys-checkbox></nys-checkbox>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-checkbox-\d+-\d+$/);
  });

  it("generates a checkboxgroup id if not provided", async () => {
    const el = await fixture(html`<nys-checkboxgroup></nys-checkboxgroup>`);

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-checkboxgroup-\d+-\d+$/);
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

    expect(nysLabel!.hasAttribute("description")).to.be.true;

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

  it("resets checked state when the form is reset", async () => {
    const el = await fixture<NysCheckbox>(
      html`<form>
        <nys-checkbox checked></nys-checkbox>
      </form>`,
    );

    const checkbox = el.querySelector("nys-checkbox") as NysCheckbox;

    expect(checkbox.checked).to.be.true;

    // Trigger native form reset
    (checkbox.closest("form") as HTMLFormElement).reset();

    expect(checkbox.checked).to.be.false;
  });

  it("resets checked states of all checkboxes when the form is reset", async () => {
    const el = await fixture<NysCheckboxgroup>(
      html`<form>
        <nys-checkboxgroup>
          <nys-checkbox checked></nys-checkbox>
          <nys-checkbox checked></nys-checkbox>
          <nys-checkbox></nys-checkbox>
        </nys-checkboxgroup>
      </form>`,
    );

    const checkboxes = Array.from(
      el.querySelectorAll("nys-checkbox"),
    ) as NysCheckbox[];

    // Confirm initial state
    expect(checkboxes[0].checked).to.be.true;
    expect(checkboxes[1].checked).to.be.true;
    expect(checkboxes[2].checked).to.be.false;

    // Trigger native form reset
    (el.closest("form") as HTMLFormElement).reset();

    // After reset, all checkboxes should revert to their initial default state
    expect(checkboxes[0].checked).to.be.false;
    expect(checkboxes[1].checked).to.be.false;
    expect(checkboxes[2].checked).to.be.false;
  });

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
