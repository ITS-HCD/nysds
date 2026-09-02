import { expect, html, fixture } from "@open-wc/testing";
import { findUnregisteredChildren } from "@nysds/internals";
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

  it("disables textinput when 'other' checkbox is checked and disabled", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox other checked disabled></nys-checkbox>
    `);
    await el.updateComplete;

    const textInput = el.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
    expect(textInput!.hasAttribute("disabled")).to.be.true;
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
    (el as any).internals.setValidity(
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

    (el as any).internals.setValidity(
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

  // `required` arriving as a property write after first render (e.g. a
  // framework wrapper setting it post-hydration, the way @lit/react does)
  // used to leave ElementInternals reporting valid forever: the native
  // <input> picked up `required` via the template's declarative binding,
  // but nothing re-ran _manageRequire(), so native form submission never
  // saw this checkbox as invalid.
  it("re-validates when required arrives as a late property, after first render", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Required field"></nys-checkbox>`,
    );
    await el.updateComplete;

    expect(el.checkValidity()).to.be.true;

    // Simulate a late property write (not an attribute) on an already
    // up-and-running element.
    el.required = true;
    await el.updateComplete;

    expect(el.checkValidity()).to.be.false;
    expect((el as any).internals.validity.valueMissing).to.be.true;

    expect(el.showError).to.be.false;
    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.showError).to.be.true;
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

  it("clears showError when a checkbox is selected (not required)", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup
        showError
        errorMessage="Please select at least one landmark"
      >
        <nys-checkbox name="x" value="a" label="A"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;
    expect(el.showError).to.be.true;

    const checkbox = el.querySelector("nys-checkbox") as NysCheckbox;
    (checkbox as any).checked = true;
    await checkbox.updateComplete;
    checkbox.dispatchEvent(
      new CustomEvent("nys-change", {
        bubbles: true,
        composed: true,
        detail: { name: "x" },
      }),
    );
    await el.updateComplete;

    expect(el.showError).to.be.false;
  });

  /*** A11y Test ***/
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-checkbox label="My Label"></nys-checkbox>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  /*** @nysds/internals migration regression tests ***/
  it("names the native checkbox via aria-labelledby to the visible label (no synthetic aria-label)", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="I agree" id="cb"></nys-checkbox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector("input")!;
    // Accessible name comes from the real visible <nys-label>, not a string copy.
    expect(input.getAttribute("aria-labelledby")).to.equal("cb--label");
    expect(input.hasAttribute("aria-label")).to.equal(false);
    const label = el.shadowRoot!.getElementById("cb--label");
    expect(label).to.exist;
    expect(label!.tagName.toLowerCase()).to.equal("nys-label");
  });

  it("preserves aria-checked on the native checkbox", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Pick me" checked></nys-checkbox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-checked")).to.equal("true");
  });

  it("associates the error message with the input via aria-errormessage", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox
        label="Terms"
        id="cberr"
        showError
        errorMessage="Required"
      ></nys-checkbox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-errormessage")).to.equal("cberr--error");
    expect(el.shadowRoot!.getElementById("cberr--error")).to.exist;
  });

  it("self-registers its internal label and error-message elements", () => {
    // The accessible-name/error association depends on these being defined.
    expect(customElements.get("nys-label")).to.exist;
    expect(customElements.get("nys-errormessage")).to.exist;
  });

  it("remains form-associated through the shared mixin (standalone checkbox)", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <nys-checkbox
          name="agree"
          value="yes"
          label="Agree"
          checked
        ></nys-checkbox>
      </form>`,
    );
    const el = form.querySelector<NysCheckbox>("nys-checkbox")!;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.equal("yes");
    expect(Array.from(form.elements)).to.include(el);
  });

  it("group names the fieldset via aria-labelledby to the visible label", async () => {
    const el = await fixture<NysCheckboxgroup>(
      html`<nys-checkboxgroup label="Choose" id="grp">
        <nys-checkbox name="x" value="a" label="A"></nys-checkbox>
      </nys-checkboxgroup>`,
    );
    await el.updateComplete;
    const fieldset = el.shadowRoot!.querySelector("fieldset")!;
    expect(fieldset.getAttribute("aria-labelledby")).to.equal("grp--label");
    expect(fieldset.hasAttribute("aria-label")).to.equal(false);
    expect(fieldset.getAttribute("role")).to.equal("radiogroup");
    const label = el.shadowRoot!.getElementById("grp--label");
    expect(label).to.exist;
    expect(label!.tagName.toLowerCase()).to.equal("nys-label");
  });

  it("group remains form-associated through the shared mixin (FormData round-trip)", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <nys-checkboxgroup label="Pick" name="picks">
          <nys-checkbox name="picks" value="a" label="A" checked></nys-checkbox>
          <nys-checkbox name="picks" value="b" label="B" checked></nys-checkbox>
        </nys-checkboxgroup>
      </form>`,
    );
    const group = form.querySelector<NysCheckboxgroup>("nys-checkboxgroup")!;
    await group.updateComplete;
    const firstCheckbox = group.querySelector<NysCheckbox>("nys-checkbox")!;
    await firstCheckbox.updateComplete;
    // Trigger the group's change aggregation by toggling a child.
    const input = firstCheckbox.shadowRoot!.querySelector("input")!;
    input.click();
    input.click();
    await group.updateComplete;
    expect(Array.from(form.elements)).to.include(group);
    expect(new FormData(form).get("picks")).to.be.a("string");
  });
});

describe("nys-checkbox external labelling", () => {
  it("associates the input with a light-DOM element via labelledby", async () => {
    const wrap = await fixture(html`
      <div>
        <span id="colhead">Select row</span>
        <nys-checkbox labelledby="colhead" hideLabel></nys-checkbox>
      </div>
    `);
    const cb = wrap.querySelector<NysCheckbox>("nys-checkbox")!;
    await cb.updateComplete;
    const input = cb.shadowRoot!.querySelector("input")!;
    const head = wrap.querySelector("#colhead")!;
    expect(
      (input as unknown as { ariaLabelledByElements: Element[] })
        .ariaLabelledByElements,
    ).to.deep.equal([head]);
    expect(input.getAttribute("aria-label")).to.equal("Select row");
  });

  it("hideLabel suppresses the internal nys-label", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Hidden" hideLabel></nys-checkbox>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("nys-label")).to.equal(null);
  });

  it("renders no stray text when the internal label is suppressed", async () => {
    // A `cond && html` guard renders the literal string "false" when cond is a boolean
    // false — lit only treats nullish/empty-string as blank. Assert on the rendered text,
    // not just on nys-label being absent, which is true either way.
    for (const el of [
      await fixture<NysCheckbox>(
        html`<nys-checkbox label="Hidden" hideLabel></nys-checkbox>`,
      ),
      await fixture<NysCheckbox>(
        html`<nys-checkbox labelledby="somewhere" hideLabel></nys-checkbox>`,
      ),
      await fixture<NysCheckbox>(html`<nys-checkbox></nys-checkbox>`),
    ]) {
      await el.updateComplete;
      expect(el.shadowRoot!.textContent).to.not.contain("false");
      expect(el.shadowRoot!.textContent).to.not.contain("true");
    }
  });

  it("still uses the internal label when no external labelledby is set", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Agree"></nys-checkbox>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("nys-label")).to.not.equal(null);
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-labelledby")).to.equal(el.id + "--label");
  });

  it("re-resolves when labelledby changes after the first render", async () => {
    const wrap = await fixture(html`
      <div>
        <span id="first">First header</span>
        <span id="second">Second header</span>
        <nys-checkbox labelledby="first" hideLabel></nys-checkbox>
      </div>
    `);
    const cb = wrap.querySelector<NysCheckbox>("nys-checkbox")!;
    await cb.updateComplete;
    const input = cb.shadowRoot!.querySelector("input")!;

    cb.labelledby = "second";
    await cb.updateComplete;
    expect(
      (input as unknown as { ariaLabelledByElements: Element[] })
        .ariaLabelledByElements,
    ).to.deep.equal([wrap.querySelector("#second")!]);
    expect(input.getAttribute("aria-label")).to.equal("Second header");
  });

  it("restores the internal label when labelledby is removed", async () => {
    const wrap = await fixture(html`
      <div>
        <span id="head">Select row</span>
        <nys-checkbox label="Agree" labelledby="head"></nys-checkbox>
      </div>
    `);
    const cb = wrap.querySelector<NysCheckbox>("nys-checkbox")!;
    await cb.updateComplete;
    expect(cb.shadowRoot!.querySelector("nys-label")).to.equal(null);

    cb.labelledby = "";
    await cb.updateComplete;

    // The external element reference and its string fallback are dropped, and the
    // internal same-root IDREF + visible label come back.
    const input = cb.shadowRoot!.querySelector("input")!;
    expect(input.hasAttribute("aria-label")).to.equal(false);
    expect(cb.shadowRoot!.querySelector("nys-label")).to.not.equal(null);
    expect(input.getAttribute("aria-labelledby")).to.equal(cb.id + "--label");
  });

  it("clears the association when labelledby points at a missing id", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox labelledby="nope" hideLabel></nys-checkbox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.hasAttribute("aria-label")).to.equal(false);
  });
});

describe("nys-checkbox error association", () => {
  // The checkbox previously had no aria-invalid at all (only the "other" text field did),
  // so Blink would not expose an error relation for it under any markup.
  it("marks the input invalid and describes it with the error when showError is set", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox
        id="cb"
        label="Agree"
        showError
        errorMessage="You must agree"
      ></nys-checkbox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-invalid")).to.equal("true");
    expect(input.getAttribute("aria-errormessage")).to.equal("cb--error");
    expect(input.getAttribute("aria-describedby")).to.equal("cb--error");
  });

  it("does not describe the input when there is no error", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox id="cb" label="Agree"></nys-checkbox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-invalid")).to.equal("false");
    expect(input.hasAttribute("aria-describedby")).to.equal(false);
  });
});

describe("nys-checkbox self-registration", () => {
  it("registers every nys-* element it renders", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox label="Test" checked other></nys-checkbox>`,
    );
    expect(findUnregisteredChildren(el)).to.deep.equal([]);
  });
});

describe("nys-checkbox event contract", () => {
  it("nys-focus and nys-blur bubble out of the component (regression)", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div><nys-checkbox label="Bubble test"></nys-checkbox></div>
    `);
    const el = wrapper.querySelector("nys-checkbox") as NysCheckbox;
    const events: Event[] = [];
    wrapper.addEventListener("nys-focus", (e) => events.push(e));
    wrapper.addEventListener("nys-blur", (e) => events.push(e));

    const input = await el.getInputElement();
    input!.dispatchEvent(new FocusEvent("focus"));
    el.dispatchEvent(new FocusEvent("blur"));

    expect(events.map((e) => e.type)).to.deep.equal(["nys-focus", "nys-blur"]);
    events.forEach((e) => {
      expect(e.bubbles).to.be.true;
      expect(e.composed).to.be.true;
    });
  });

  it("nys-change bubbles, composes, and carries {id, checked, name, value}", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <nys-checkbox
          id="cb1"
          name="pets"
          value="dog"
          label="Dog"
        ></nys-checkbox>
      </div>
    `);
    const el = wrapper.querySelector("nys-checkbox") as NysCheckbox;
    const received: CustomEvent[] = [];
    wrapper.addEventListener("nys-change", (e) =>
      received.push(e as CustomEvent),
    );

    const input = await el.getInputElement();
    input!.click();
    await el.updateComplete;

    expect(received).to.have.length(1);
    const event = received[0];
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
    expect(event.detail).to.deep.equal({
      id: "cb1",
      checked: true,
      name: "pets",
      value: "dog",
    });
  });

  it("does not fire nys-change when checked is set programmatically", async () => {
    const el = await fixture<NysCheckbox>(
      html`<nys-checkbox name="pets" value="dog" label="Dog"></nys-checkbox>`,
    );
    let count = 0;
    el.addEventListener("nys-change", () => count++);

    el.checked = true;
    await el.updateComplete;
    el.checked = false;
    await el.updateComplete;

    expect(count).to.equal(0);
  });

  it("updates the form value when checked is set programmatically", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-checkbox name="agree" value="yes" label="Agree"></nys-checkbox>
      </form>
    `);
    const el = form.querySelector("nys-checkbox") as NysCheckbox;
    await el.updateComplete;

    el.checked = true;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.equal("yes");

    el.checked = false;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.equal(null);
  });

  it("keeps a consumer-supplied errorMessage through validation", async () => {
    const el = await fixture<NysCheckbox>(html`
      <nys-checkbox
        required
        errorMessage="Custom message"
        label="Agree"
      ></nys-checkbox>
    `);
    await el.updateComplete;

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await el.updateComplete;

    expect(el.errorMessage).to.equal("Custom message");
    expect(el.showError).to.be.true;
    const errorEl = el.shadowRoot!.querySelector("nys-errormessage") as any;
    expect(errorEl.errorMessage).to.equal("Custom message");
  });
});

describe("nys-checkboxgroup event contract", () => {
  it("derives value from checked children", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup label="Pick">
        <nys-checkbox name="p" value="a" label="A" checked></nys-checkbox>
        <nys-checkbox name="p" value="b" label="B"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0)); // let slotchange run

    expect(el.value).to.deep.equal(["a"]);
  });

  it("fires a group nys-change with a string[] detail when a child changes, alongside the child's event", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <nys-checkboxgroup id="grp" name="p" label="Pick">
          <nys-checkbox name="p" value="a" label="A"></nys-checkbox>
          <nys-checkbox name="p" value="b" label="B" checked></nys-checkbox>
        </nys-checkboxgroup>
      </div>
    `);
    const group = wrapper.querySelector(
      "nys-checkboxgroup",
    ) as NysCheckboxgroup;
    await group.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    const received: CustomEvent[] = [];
    wrapper.addEventListener("nys-change", (e) =>
      received.push(e as CustomEvent),
    );

    const first = group.querySelector("nys-checkbox") as NysCheckbox;
    const input = await first.getInputElement();
    input!.click();
    await group.updateComplete;

    // The child's own event still bubbles past the group.
    const childEvents = received.filter((e) => "checked" in e.detail);
    expect(childEvents).to.have.length(1);

    const groupEvents = received.filter((e) => Array.isArray(e.detail.value));
    expect(groupEvents).to.have.length(1);
    const groupEvent = groupEvents[0];
    expect(groupEvent.target).to.equal(group);
    expect(groupEvent.bubbles).to.be.true;
    expect(groupEvent.composed).to.be.true;
    expect(groupEvent.detail).to.deep.equal({
      id: "grp",
      name: "p",
      value: ["a", "b"],
    });
    expect(group.value).to.deep.equal(["a", "b"]);
  });

  it("does not fire nys-change when value is set programmatically", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup name="p" label="Pick">
        <nys-checkbox name="p" value="a" label="A" checked></nys-checkbox>
        <nys-checkbox name="p" value="b" label="B"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    let count = 0;
    el.addEventListener("nys-change", () => count++);

    el.value = ["b"];
    await el.updateComplete;

    expect(count).to.equal(0);
    const checkboxes = Array.from(
      el.querySelectorAll("nys-checkbox"),
    ) as NysCheckbox[];
    expect(checkboxes[0].checked).to.be.false;
    expect(checkboxes[1].checked).to.be.true;
    expect(el.value).to.deep.equal(["b"]);
  });

  it("updates FormData when value is set programmatically", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-checkboxgroup name="p" label="Pick">
          <nys-checkbox name="p" value="a" label="A"></nys-checkbox>
          <nys-checkbox name="p" value="b" label="B"></nys-checkbox>
        </nys-checkboxgroup>
      </form>
    `);
    const group = form.querySelector("nys-checkboxgroup") as NysCheckboxgroup;
    await group.updateComplete;
    await new Promise((r) => setTimeout(r, 0));

    group.value = ["a", "b"];
    await group.updateComplete;

    expect(new FormData(form).getAll("p")).to.include("a, b");
  });

  it("fires nys-focus when focus enters and nys-blur when it leaves, not when moving between children", async () => {
    const wrapper = await fixture<HTMLDivElement>(html`
      <div>
        <button id="outside">outside</button>
        <nys-checkboxgroup label="Pick">
          <nys-checkbox name="p" value="a" label="A"></nys-checkbox>
          <nys-checkbox name="p" value="b" label="B"></nys-checkbox>
        </nys-checkboxgroup>
      </div>
    `);
    const group = wrapper.querySelector(
      "nys-checkboxgroup",
    ) as NysCheckboxgroup;
    const outside = wrapper.querySelector("#outside") as HTMLButtonElement;
    const checkboxes = Array.from(
      group.querySelectorAll("nys-checkbox"),
    ) as NysCheckbox[];
    const [first, second] = checkboxes;

    const events: string[] = [];
    group.addEventListener("nys-focus", (e) => {
      if (e.target === group) events.push("focus");
    });
    group.addEventListener("nys-blur", (e) => {
      if (e.target === group) events.push("blur");
    });

    // Focus enters the group from outside.
    first.dispatchEvent(
      new FocusEvent("focusin", {
        bubbles: true,
        composed: true,
        relatedTarget: outside,
      }),
    );
    // Focus moves between children: no group events.
    first.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        composed: true,
        relatedTarget: second,
      }),
    );
    second.dispatchEvent(
      new FocusEvent("focusin", {
        bubbles: true,
        composed: true,
        relatedTarget: first,
      }),
    );
    // Focus leaves the group.
    second.dispatchEvent(
      new FocusEvent("focusout", {
        bubbles: true,
        composed: true,
        relatedTarget: outside,
      }),
    );

    expect(events).to.deep.equal(["focus", "blur"]);
  });

  it("keeps a consumer-supplied errorMessage when a validation error renders", async () => {
    const el = await fixture<NysCheckboxgroup>(html`
      <nys-checkboxgroup required errorMessage="Pick at least one" label="Pick">
        <nys-checkbox name="p" value="a" label="A"></nys-checkbox>
      </nys-checkboxgroup>
    `);
    await el.updateComplete;

    el.dispatchEvent(new Event("invalid", { cancelable: true }));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(el.errorMessage).to.equal("Pick at least one");
    expect(el.showError).to.be.true;
    const errorEl = el.shadowRoot!.querySelector("nys-errormessage") as any;
    expect(errorEl.errorMessage).to.equal("Pick at least one");
  });
});
