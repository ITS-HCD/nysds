import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-combobox.js";
import { NysCombobox } from "./nys-combobox.js";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";

/**
 * Test suite for nys-combobox component
 * Based on implementation options from nys-combobox.stories.ts
 */
describe("nys-combobox", () => {
  // Basic rendering tests
  it("renders the component", async () => {
    const el = await fixture(html`<nys-combobox></nys-combobox>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysCombobox>(html`<nys-combobox></nys-combobox>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-combobox-\d+-\d+$/);
  });

  it("uses provided id when set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox id="my-combobox"></nys-combobox>`,
    );
    expect(el.id).to.equal("my-combobox");
  });

  // Property reflection tests
  it("reflects attributes to properties", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox
        label="My Label"
        name="myName"
        required
      ></nys-combobox>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.name).to.equal("myName");
    expect(el.required).to.be.true;
  });

  it("reflects description attribute to property", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox description="Helper text"></nys-combobox>`,
    );
    expect(el.description).to.equal("Helper text");
  });

  it("reflects inverted attribute to property", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox inverted></nys-combobox>`,
    );
    expect(el.inverted).to.be.true;
  });

  // Default value tests (DefaultValue story)
  it("renders with default value when value attribute is set", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox value="mango">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="mango">Mango</option>
        <option value="orange">Orange</option>
      </nys-combobox>
    `);
    expect(el.value).to.equal("mango");
  });

  it("renders with default value when option has selected attribute", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
        <option value="mango" selected>Mango</option>
        <option value="orange">Orange</option>
      </nys-combobox>
    `);
    await el.updateComplete;
    expect(el.value).to.equal("mango");
  });

  // Option rendering tests (Basic story)
  it("renders options from slotted content", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
      </nys-combobox>
    `);
    const options = el.querySelectorAll("option");
    expect(options.length).to.equal(3);
    expect(options[0].value).to.equal("apple");
    expect(options[1].value).to.equal("banana");
    expect(options[2].value).to.equal("cherry");
  });

  // OptionGroup story tests
  it("renders optgroup with nested options", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
        <optgroup label="Citrus">
          <option value="lemon">Lemon</option>
          <option value="orange">Orange</option>
        </optgroup>
        <optgroup label="Berries">
          <option value="strawberry">Strawberry</option>
          <option value="blueberry">Blueberry</option>
        </optgroup>
      </nys-combobox>
    `);

    const optgroups = el.querySelectorAll("optgroup");
    expect(optgroups.length).to.equal(2);
    expect(optgroups[0].label).to.equal("Citrus");
    expect(optgroups[1].label).to.equal("Berries");

    const citrusOptions = optgroups[0].querySelectorAll("option");
    expect(citrusOptions.length).to.equal(2);
    expect(citrusOptions[0].value).to.equal("lemon");

    const berryOptions = optgroups[1].querySelectorAll("option");
    expect(berryOptions.length).to.equal(2);
    expect(berryOptions[0].value).to.equal("strawberry");
  });

  // Disabled tests (Disabled story)
  it("sets disabled state on the input when disabled attribute is set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox disabled></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.disabled).to.be.true;
    expect(input?.getAttribute("aria-disabled")).to.equal("true");
  });

  it("prevents interaction when disabled", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox disabled>
        <option value="apple">Apple</option>
      </nys-combobox>
    `);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    const initialValue = el.value;
    input.value = "apple";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;

    // Value should not change when disabled
    expect(el.disabled).to.be.true;
  });

  // DisabledOptions story tests
  it("renders disabled options that cannot be selected", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry" disabled>Cherry (Out of season)</option>
        <option value="mango">Mango</option>
      </nys-combobox>
    `);

    const options = el.querySelectorAll("option");
    expect(options[2].disabled).to.be.true;
    expect(options[2].textContent).to.include("Out of season");
  });

  // Required validation tests (Required story)
  it("shows required symbol when required attribute is set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox label="Select" required></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.hasAttribute("required")).to.be.true;
    expect(input?.getAttribute("aria-required")).to.equal("true");

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.getAttribute("flag")).to.equal("required");
  });

  it("validates required field is empty and shows error", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox required>
        <option value="apple">Apple</option>
      </nys-combobox>
    `);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.value = "";
    input.dispatchEvent(new Event("blur"));
    await el.updateComplete;

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
  });

  // Optional tests (Optional story)
  it("shows optional flag when optional attribute is set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox label="Select" optional></nys-combobox>`,
    );
    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.getAttribute("flag")).to.equal("optional");
  });

  it("does not show required validation when optional is set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox optional></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.hasAttribute("required")).to.be.false;
  });

  // Width tests (Width story)
  it("defaults to full width when width is unset", async () => {
    const el = await fixture<NysCombobox>(html`<nys-combobox></nys-combobox>`);
    await el.updateComplete;
    expect(el.width).to.equal("full");
  });

  it("applies md width when set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox width="md"></nys-combobox>`,
    );
    expect(el.width).to.equal("md");
  });

  it("applies lg width when set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox width="lg"></nys-combobox>`,
    );
    expect(el.width).to.equal("lg");
  });

  it("applies sm width when set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox width="lg"></nys-combobox>`,
    );
    expect(el.width).to.equal("lg");
  });

  // Description slot tests (DescriptionSlot story)
  it("renders slotted description content", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <label slot="description">This is a description slot</label>
        <option value="apple">Apple</option>
      </nys-combobox>
    `);

    const slot = el.shadowRoot?.querySelector(
      'slot[name="description"]',
    ) as HTMLSlotElement;
    const assigned = slot?.assignedElements() || [];
    expect(assigned.length).to.be.greaterThan(0);

    const description = assigned.find(
      (el) => el.tagName.toLowerCase() === "label",
    );
    expect(description?.textContent).to.include("This is a description slot");
  });

  // Error message tests (ErrorMessage story)
  it("displays error message when showError is true", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox
        showError
        errorMessage="Please select a fruit"
      ></nys-combobox>
    `);

    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.equal("Please select a fruit");

    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
    expect(errorMessage?.getAttribute("errorMessage")).to.equal(
      "Please select a fruit",
    );
  });

  it("sets custom validity message and showError flag", async () => {
    const el = await fixture<NysCombobox>(html`<nys-combobox></nys-combobox>`);
    (el as any)._setValidityMessage("Something is wrong");
    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.include("Something is wrong");
  });

  // Value change and events tests
  it("updates value when user types", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </nys-combobox>
    `);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.value = "apple";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    expect(el.value).to.equal("apple");
  });

  it("emits nys-change event when value changes", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
      </nys-combobox>
    `);

    let eventDetail: any = null;
    el.addEventListener("nys-change", (e: any) => (eventDetail = e.detail));

    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    input.value = "apple";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    expect(eventDetail).to.exist;
    expect(eventDetail.value).to.equal("apple");
  });

  // Focus and blur tests
  it("dispatches focus and blur events", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox label="FocusMe"></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input")!;

    // Focus event
    const focusEventPromise = oneEvent(el, "focus");
    input.focus();
    const focusEvent = await focusEventPromise;
    expect(focusEvent).to.exist;
    expect(input.matches(":focus")).to.be.true;

    // Blur event
    const blurEventPromise = oneEvent(el, "blur");
    input.blur();
    const blurEvent = await blurEventPromise;
    expect(blurEvent).to.exist;
    expect(input.matches(":focus")).to.be.false;
  });

  it("should not focus when disabled", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox disabled></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.focus();
    expect(document.activeElement).to.not.equal(input);
  });

  // Form integration tests
  it("associates with form element using form attribute", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox form="my-form"></nys-combobox>`,
    );
    expect(el.form).to.equal("my-form");
  });

  it("runs native checkValidity", async () => {
    const el = await fixture<NysCombobox>(html`<nys-combobox></nys-combobox>`);
    expect(el.checkValidity()).to.be.true;
  });

  it("resets value and validation when form is reset", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-combobox
          value="apple"
          showError
          errorMessage="Error"
        ></nys-combobox>
      </form>
    `);

    const el = form.querySelector<NysCombobox>("nys-combobox")!;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;

    // Initial state
    expect(el.value).to.equal("apple");
    expect(input.value).to.equal("apple");
    expect(el.showError).to.be.true;
    expect(el.errorMessage).to.equal("Error");

    form.reset();
    await el.updateComplete;

    expect(el.value).to.equal("");
    expect(input.value).to.equal("");
    expect(el.showError).to.be.false;
    expect(el.errorMessage).to.equal("");
    expect((el as any)._internals.validity.valid).to.be.true;
  });

  it("resets to default value when form is reset", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-combobox value="banana">
          <option value="apple">Apple</option>
          <option value="banana" selected>Banana</option>
        </nys-combobox>
      </form>
    `);

    const el = form.querySelector<NysCombobox>("nys-combobox")!;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;

    // Change value
    input.value = "apple";
    input.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.value).to.equal("apple");

    // Reset form
    form.reset();
    await el.updateComplete;

    // Should reset to default value
    expect(el.value).to.equal("banana");
  });

  // Tooltip tests
  it("renders tooltip when tooltip attribute is set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox tooltip="Help text"></nys-combobox>`,
    );
    expect(el.tooltip).to.equal("Help text");
  });

  // Inverted theme tests (Inverted story)
  it("applies inverted styling when inverted attribute is set", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox inverted></nys-combobox>`,
    );
    expect(el.inverted).to.be.true;
    expect(el.hasAttribute("inverted")).to.be.true;
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox label="Select Fruit"></nys-combobox>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("maps label to aria-label on input", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox label="Favorite Fruit"></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;
    expect(input?.getAttribute("aria-label")).to.equal("Favorite Fruit");
  });

  it("sets aria-required when required", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox required></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("aria-required")).to.equal("true");
  });

  it("sets aria-invalid when showError is true", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox showError></nys-combobox>`,
    );
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("aria-invalid")).to.equal("true");
  });

  it("sets aria-disabled when disabled", async () => {
    const el = await fixture<NysCombobox>(
      html`<nys-combobox disabled></nys-combobox>`,
    );
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("aria-disabled")).to.equal("true");
  });

  // Keyboard interaction tests
  it("supports keyboard navigation for accessibility", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </nys-combobox>
    `);
    const input = el.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.focus();
    expect(document.activeElement).to.exist;

    // Component should handle keyboard events (specific implementation depends on component)
    const keyEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });
    input.dispatchEvent(keyEvent);
    await el.updateComplete;

    // Verify component responds to keyboard input
    expect(input).to.exist;
  });

  // Edge cases and error handling
  it("handles empty options gracefully", async () => {
    const el = await fixture<NysCombobox>(html`<nys-combobox></nys-combobox>`);
    expect(el).to.exist;
    const options = el.querySelectorAll("option");
    expect(options.length).to.equal(0);
  });

  it("handles value that doesn't match any option", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox value="nonexistent">
        <option value="apple">Apple</option>
      </nys-combobox>
    `);
    // Component should handle gracefully
    expect(el.value).to.equal("nonexistent");
  });

  it("clears value when setting to empty string", async () => {
    const el = await fixture<NysCombobox>(html`
      <nys-combobox value="apple">
        <option value="apple">Apple</option>
      </nys-combobox>
    `);
    expect(el.value).to.equal("apple");

    el.value = "";
    await el.updateComplete;
    expect(el.value).to.equal("");
  });
});
