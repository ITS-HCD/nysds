import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-checkbox.js";
import { NysCheckbox } from "./nys-checkbox";
import { NysCheckboxgroup } from "./nys-checkboxgroup";

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
    input?.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    // Simulate tabbing out of the checkbox
    el?.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
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

  it("hides text input when 'other' checkbox is unchecked", async () => {
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

  it("shows error when 'other' checkbox is checked but text input is empty after blur", async () => {
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

  it("clears 'other' validation error when valid text is entered", async () => {
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

  it("checks 'other' produces the textbox with no error", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox label="Option 1"></nys-checkbox>
        <nys-checkbox other></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const checkboxes = Array.from(
      group.querySelectorAll("nys-checkbox"),
    ) as NysCheckbox[];
    const otherCheckbox = checkboxes.find(
      (checkbox) => checkbox.other,
    ) as NysCheckbox;

    // Check the other checkbox
    const input = await otherCheckbox.getInputElement();
    input?.click();
    await otherCheckbox.updateComplete;

    // Textbox should appear
    const textInput = otherCheckbox.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
    expect(otherCheckbox.showOtherError).to.be.false;
  });

  it("clicking off 'other' textbox while still checked produces an error", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox label="Option 1" value="1"></nys-checkbox>
        <nys-checkbox other checked value=""></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const checkboxes = Array.from(
      group.querySelectorAll("nys-checkbox"),
    ) as NysCheckbox[];
    const otherCheckbox = checkboxes.find(
      (checkbox) => checkbox.other,
    ) as NysCheckbox;

    const textInput = otherCheckbox.shadowRoot?.querySelector("nys-textinput");

    expect(otherCheckbox.showOtherError).to.be.false;

    // Trigger blur event (clicking off)
    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await otherCheckbox.updateComplete;

    // Error should be shown
    expect(otherCheckbox.showOtherError).to.be.true;
  });

  it("unchecking 'other' clears any errors for the 'other' field", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox label="Option 1" value="1"></nys-checkbox>
        <nys-checkbox other checked value=""></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const checkboxes = Array.from(
      group.querySelectorAll("nys-checkbox"),
    ) as NysCheckbox[];
    const otherCheckbox = checkboxes.find(
      (checkbox) => checkbox.other,
    ) as NysCheckbox;

    const textInput = otherCheckbox.shadowRoot?.querySelector("nys-textinput");

    // First trigger an error
    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await otherCheckbox.updateComplete;

    expect(otherCheckbox.showOtherError).to.be.true;

    // Unchecking the checkbox
    const input = await otherCheckbox.getInputElement();
    input?.click();
    await otherCheckbox.updateComplete;

    // Error should be cleared
    expect(otherCheckbox.showOtherError).to.be.false;
  });

  it("_handleInvalid always calls preventDefault", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup required>
        <nys-checkbox name="x" value="a" label="A"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;

    const event = new Event("invalid", { cancelable: true, bubbles: false });
    el.dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
  });

  it("_handleInvalid (valueMissing) does not focus when a preceding invalid group exists in the same form", async () => {
    const container = await fixture(html`
      <form>
        <nys-checkboxgroup id="first" required>
          <nys-checkbox name="a" value="1" label="One"></nys-checkbox>
        </nys-checkboxgroup>
        <nys-checkboxgroup id="second" required>
          <nys-checkbox name="b" value="2" label="Two"></nys-checkbox>
        </nys-checkboxgroup>
      </form>
    `);

    const second = container.querySelector<any>("#second")!;
    await second.updateComplete;

    const checkbox = second.querySelector("nys-checkbox") as NysCheckbox;
    const input = await checkbox.getInputElement();
    let focused = false;
    input!.focus = () => {
      focused = true;
    };

    second.dispatchEvent(new Event("invalid", { cancelable: true }));
    await second.updateComplete;

    expect(focused).to.be.false;
  });

  it("_handleInvalid (customError) focuses the other textinput and returns early", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup>
        <nys-checkbox other checked name="x" value=""></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;

    const checkbox = el.querySelector("nys-checkbox") as NysCheckbox;
    await checkbox.updateComplete;

    // Manually set customError on the group's internals to trigger that branch
    const textInput = checkbox.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;

    let focused = false;
    (textInput as HTMLElement).focus = () => {
      focused = true;
    };

    // Set customError validity so the branch fires
    (el as any)._internals.setValidity(
      { customError: true },
      "Please complete this field.",
      textInput,
    );

    const event = new Event("invalid", { cancelable: true });
    el.dispatchEvent(event);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0)); // flush async focus

    expect(focused).to.be.true;
  });

  it("_handleInvalid (customError) falls through to valueMissing when no checked other checkbox exists", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup required>
        <nys-checkbox name="x" value="a" label="A"></nys-checkbox>
        <nys-checkbox other name="x" value="" label="Other"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;

    // Set customError but leave the other checkbox unchecked — customError branch exits without returning,
    // falls through to valueMissing
    const firstCheckbox = el.querySelector("nys-checkbox") as NysCheckbox;
    const input = await firstCheckbox.getInputElement();

    (el as any)._internals.setValidity(
      { valueMissing: true },
      "Required",
      input,
    );

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect((el as any).showError).to.be.true;
  });

  /*** More Event Test ***/
  it("emits nys-other-input with correct detail when text input changes", async () => {
    const group = await fixture(html`
      <nys-checkboxgroup label="Select options">
        <nys-checkbox other checked name="options" value=""></nys-checkbox>
      </nys-checkboxgroup>
    `);

    const el = group.querySelector("nys-checkbox") as NysCheckbox;
    await el.updateComplete;

    let eventDetail: any = null;
    el.addEventListener(
      "nys-other-input",
      (e: any) => (eventDetail = e.detail),
    );

    const textInput = el.shadowRoot?.querySelector("nys-textinput")!;
    const inputEvent = new Event("nys-input", { bubbles: true });
    Object.defineProperty(inputEvent, "target", {
      writable: false,
      value: { value: "Hello" },
    });

    textInput.dispatchEvent(inputEvent);
    await el.updateComplete;

    expect(eventDetail).to.exist;
    expect(eventDetail.name).to.equal("options");
    expect(eventDetail.value).to.equal("Hello");
  });

  it("clicking the label container clicks and focuses the input", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Click label"></nys-checkbox>`,
    );
    await el.updateComplete;

    const container = el.shadowRoot!.querySelector(
      ".nys-checkbox__main-container",
    ) as HTMLElement;

    expect(el.checked).to.be.false;

    container.click();
    await el.updateComplete;

    expect(el.checked).to.be.true;
  });

  it("_handleInvalid on standalone checkbox shows error and focuses input", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox label="Required field" required></nys-checkbox>
    `);
    await el.updateComplete;

    const input = await el.getInputElement();
    let focused = false;
    input!.focus = () => {
      focused = true;
    };

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.showError).to.be.true;
    expect(focused).to.be.true;
  });

  /**+ Form Submission Test ***/
  it("form submit focuses first checkbox of first invalid required group, not subsequent ones", async () => {
    const container = await fixture(html`
      <form>
        <nys-checkboxgroup id="first" required>
          <nys-checkbox
            name="landmarks"
            value="adirondacks"
            label="Adirondacks"
          ></nys-checkbox>
        </nys-checkboxgroup>
        <nys-checkboxgroup id="second" required>
          <nys-checkbox
            name="landmarks"
            value="niagara"
            label="Niagara Falls"
          ></nys-checkbox>
        </nys-checkboxgroup>
      </form>
    `);

    const firstInput = await container
      .querySelector("#first nys-checkbox")
      .getInputElement();
    const secondInput = await container
      .querySelector("#second nys-checkbox")
      .getInputElement();

    const focused = [];
    firstInput.focus = () => focused.push("first");
    secondInput.focus = () => focused.push("second");

    container.requestSubmit();
    await new Promise((r) => setTimeout(r, 0));

    expect(focused).to.include("first");
    expect(focused).to.not.include("second");
  });

  /*** A11y Test ***/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-checkbox label="My Label"></nys-checkbox>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
