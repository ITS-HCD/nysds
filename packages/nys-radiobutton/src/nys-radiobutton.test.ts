import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-radiobutton.js";
import { NysRadiogroup } from "./nys-radiogroup";
import { NysRadiobutton } from "./nys-radiobutton";

describe("nys-radiobutton", () => {
  // -------------------------------------------------------------------------
  // Render & ID
  // -------------------------------------------------------------------------

  it("renders the component", async () => {
    const el = await fixture(html`<nys-radiobutton></nys-radiobutton>`);
    expect(el).to.exist;
  });

  it("generates an id on nys-radiobutton if not provided", async () => {
    const el = await fixture<NysRadiobutton>(
      html`<nys-radiobutton></nys-radiobutton>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-radiobutton-\d+-\d+$/);
  });

  it("generates an id on nys-radiogroup if not provided", async () => {
    const el = await fixture<NysRadiogroup>(
      html`<nys-radiogroup></nys-radiogroup>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-radiogroup-\d+-\d+$/);
  });

  // -------------------------------------------------------------------------
  // Attribute / property reflection
  // -------------------------------------------------------------------------

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

  it("tile prop reflects on radiogroup", async () => {
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

  it("radiogroup propagates size to all child radiobuttons", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Size test" size="sm">
        <nys-radiobutton name="s" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton name="s" label="B" value="b"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const radios = group.querySelectorAll("nys-radiobutton");
    radios.forEach((r) => {
      expect(r.getAttribute("size")).to.equal("sm");
    });
  });

  it("optional flag renders on radiogroup", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Optional test" optional>
        <nys-radiobutton name="o" label="A" value="a"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    expect(group.optional).to.be.true;
    const label = group.shadowRoot!.querySelector("nys-label");
    expect(label?.getAttribute("flag")).to.equal("optional");
  });

  // -------------------------------------------------------------------------
  // Disabled
  // -------------------------------------------------------------------------

  it("clicking a disabled radio does not check it or fire nys-change", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Disabled test">
        <nys-radiobutton
          name="d"
          label="A"
          value="a"
          disabled
        ></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radio = group.querySelector<NysRadiobutton>("nys-radiobutton")!;
    let changed = false;
    group.addEventListener("nys-change", () => {
      changed = true;
    });

    const input = group.shadowRoot?.querySelector<HTMLInputElement>(
      `#input-${radio.id}`,
    );
    input?.click();
    await radio.updateComplete;

    expect(radio.checked).to.be.false;
    expect(changed).to.be.false;
  });

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------

  it("nys-change fires with correct detail on selection", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Change event test">
        <nys-radiobutton
          name="c"
          label="Albany"
          value="albany"
        ></nys-radiobutton>
        <nys-radiobutton
          name="c"
          label="Manhattan"
          value="manhattan"
        ></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radio = group.querySelectorAll<NysRadiobutton>("nys-radiobutton")[0];
    const eventPromise = oneEvent(group, "nys-change");

    group.shadowRoot
      ?.querySelector<HTMLInputElement>(`#input-${radio.id}`)
      ?.click();
    await radio.updateComplete;

    const event = await eventPromise;
    expect((event as CustomEvent).detail.value).to.equal("albany");
    expect((event as CustomEvent).detail.checked).to.be.true;
    expect((event as CustomEvent).detail.name).to.equal("c");
  });

  it("nys-focus fires when radio gains focus", async () => {
    const el = await fixture<NysRadiobutton>(
      html`<nys-radiobutton name="f" label="A" value="a"></nys-radiobutton>`,
    );

    const eventPromise = oneEvent(el, "nys-focus");
    el.dispatchEvent(new Event("focus"));
    const event = await eventPromise;
    expect(event).to.exist;
  });

  it("nys-blur fires when radio loses focus", async () => {
    const el = await fixture<NysRadiobutton>(
      html`<nys-radiobutton name="b" label="A" value="a"></nys-radiobutton>`,
    );

    const eventPromise = oneEvent(el, "nys-blur");
    el.dispatchEvent(new Event("blur"));
    const event = await eventPromise;
    expect(event).to.exist;
  });

  it("nys-other-input fires with correct detail when other text input changes", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Other input event">
        <nys-radiobutton name="oi" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton name="oi" other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const otherRadio = group.querySelector<NysRadiobutton>(
      "nys-radiobutton[other]",
    )!;
    await otherRadio.updateComplete;

    const textInput = group.shadowRoot!.querySelector("nys-textinput")!;
    const eventPromise = oneEvent(group, "nys-other-input");

    const inputEvent = new Event("nys-input", { bubbles: true });
    Object.defineProperty(inputEvent, "target", {
      writable: false,
      value: { value: "typed text" },
    });
    textInput.dispatchEvent(inputEvent);

    const event = await eventPromise;
    expect((event as CustomEvent).detail.name).to.equal("oi");
  });

  it("nys-error fires when other is checked but value is empty after blur", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Error event">
        <nys-radiobutton name="err" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton name="err" other checked value=""></nys-radiobutton>
      </nys-radiogroup>
    `);

    const otherRadio = group.querySelector<NysRadiobutton>(
      "nys-radiobutton[other]",
    )!;
    await otherRadio.updateComplete;

    const textInput = group.shadowRoot!.querySelector("nys-textinput")!;
    textInput.dispatchEvent(new Event("nys-blur", { bubbles: true }));
    await otherRadio.updateComplete;

    expect((group as any)._showOtherError).to.be.true;
    expect(group.showError).to.be.true;
  });

  it("nys-error-clear fires when other state is cleared by unchecking", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Error clear event">
        <nys-radiobutton name="ec" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton name="ec" other checked value=""></nys-radiobutton>
      </nys-radiogroup>
    `);

    const otherRadio = group.querySelector<NysRadiobutton>(
      "nys-radiobutton[other]",
    )!;
    const regularRadio =
      group.querySelectorAll<NysRadiobutton>("nys-radiobutton")[0];

    // Trigger an error first
    const textInput = group.shadowRoot?.querySelector("nys-textinput");
    textInput!.dispatchEvent(new Event("nys-blur", { bubbles: true }));
    await otherRadio.updateComplete;
    expect((group as any)._showOtherError).to.be.true;

    const input = group.shadowRoot?.querySelector<HTMLInputElement>(
      `#input-${regularRadio.id}`,
    );
    input?.click();
    await group.updateComplete;
    expect((group as any)._showOtherError).to.be.false;
  });

  // -------------------------------------------------------------------------
  // formResetCallback (group)
  // -------------------------------------------------------------------------

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
    expect((group as any).selectedValue).to.equal("a");

    group.formResetCallback();

    radios.forEach((radio) => {
      expect(radio.checked).to.be.false;
    });

    expect((group as any).selectedValue).to.be.null;
    expect(group.showError).to.be.false;
    expect(group.errorMessage).to.equal("");
    expect((group as any)._internals.validity.valid).to.be.true;
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

    const group = el.querySelector<NysRadiogroup>("nys-radiogroup")!;
    const radios = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    expect(radios[0].checked).to.be.true;
    expect(radios[1].checked).to.be.false;

    (group.closest("form") as HTMLFormElement).reset();

    radios.forEach((radio) => {
      expect(radio.checked).to.be.false;
    });

    expect((group as any).selectedValue).to.be.null;
  });

  // -------------------------------------------------------------------------
  // Mutual exclusivity
  // -------------------------------------------------------------------------

  it("checking one radio unchecks others with the same name", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Mutual exclusivity">
        <nys-radiobutton
          name="me"
          label="A"
          value="a"
          checked
        ></nys-radiobutton>
        <nys-radiobutton name="me" label="B" value="b"></nys-radiobutton>
        <nys-radiobutton name="me" label="C" value="c"></nys-radiobutton>
      </nys-radiogroup>
    `);

    const [radioA, radioB, radioC] =
      group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    expect(radioA.checked).to.be.true;

    group.shadowRoot
      ?.querySelector<HTMLInputElement>(`#input-${radioB.id}`)
      ?.click();
    await group.updateComplete;

    expect(radioB.checked).to.be.true;
    expect(radioA.checked).to.be.false;
    expect(radioC.checked).to.be.false;
  });

  // -------------------------------------------------------------------------
  // checkValidity()
  // -------------------------------------------------------------------------

  it("checkValidity() returns false when required and nothing selected", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Validity" required>
        <nys-radiobutton name="v" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton name="v" label="B" value="b"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    expect(group.checkValidity()).to.be.false;
  });

  it("checkValidity() returns true when required and one radio is selected", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Validity" required>
        <nys-radiobutton
          name="v2"
          label="A"
          value="a"
          checked
        ></nys-radiobutton>
        <nys-radiobutton name="v2" label="B" value="b"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    expect(group.checkValidity()).to.be.true;
  });

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------

  it("ArrowDown moves focus and selects next radio", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Keyboard nav">
        <nys-radiobutton name="k" label="A" value="a" checked></nys-radiobutton>
        <nys-radiobutton name="k" label="B" value="b"></nys-radiobutton>
        <nys-radiobutton name="k" label="C" value="c"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const [radioA, radioB] =
      group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    const content = group.shadowRoot!.querySelector(
      ".nys-radiogroup__content",
    )!;
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await group.updateComplete;
    await radioB.updateComplete;

    expect(radioB.checked).to.be.true;
    expect(radioA.checked).to.be.false;
  });

  it("ArrowUp moves focus and selects previous radio", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Keyboard nav up">
        <nys-radiobutton name="ku" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton
          name="ku"
          label="B"
          value="b"
          checked
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const [radioA, radioB] =
      group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    const content = group.shadowRoot!.querySelector(
      ".nys-radiogroup__content",
    )!;
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );
    await group.updateComplete;
    await radioA.updateComplete;

    expect(radioA.checked).to.be.true;
    expect(radioB.checked).to.be.false;
  });

  it("ArrowDown wraps from last radio to first", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Wrap down">
        <nys-radiobutton name="wd" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton
          name="wd"
          label="B"
          value="b"
          checked
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const [radioA] = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    const content = group.shadowRoot!.querySelector(
      ".nys-radiogroup__content",
    )!;
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await group.updateComplete;
    await radioA.updateComplete;

    expect(radioA.checked).to.be.true;
  });

  it("ArrowUp wraps from first radio to last", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Wrap up">
        <nys-radiobutton
          name="wu"
          label="A"
          value="a"
          checked
        ></nys-radiobutton>
        <nys-radiobutton name="wu" label="B" value="b"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const radios = group.querySelectorAll<NysRadiobutton>("nys-radiobutton");
    const radioB = radios[1];

    const content = group.shadowRoot!.querySelector(
      ".nys-radiogroup__content",
    )!;
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }),
    );
    await group.updateComplete;
    await radioB.updateComplete;

    expect(radioB.checked).to.be.true;
  });

  it("disabled radios are skipped during ArrowDown keyboard navigation", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Skip disabled">
        <nys-radiobutton
          name="sd"
          label="A"
          value="a"
          checked
        ></nys-radiobutton>
        <nys-radiobutton
          name="sd"
          label="B"
          value="b"
          disabled
        ></nys-radiobutton>
        <nys-radiobutton name="sd" label="C" value="c"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const [, , radioC] =
      group.querySelectorAll<NysRadiobutton>("nys-radiobutton");

    const content = group.shadowRoot!.querySelector(
      ".nys-radiogroup__content",
    )!;
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
    await group.updateComplete;
    await radioC.updateComplete;

    expect(radioC.checked).to.be.true;
  });

  // -------------------------------------------------------------------------
  // _handleOtherKeydown — Space does not propagate
  // -------------------------------------------------------------------------

  it("Space key inside other text input does not propagate to radiogroup", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Space keydown">
        <nys-radiobutton name="sk" label="A" value="a"></nys-radiobutton>
        <nys-radiobutton name="sk" other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const otherRadio = group.querySelector<NysRadiobutton>(
      "nys-radiobutton[other]",
    )!;
    await otherRadio.updateComplete;

    const textInput = group.shadowRoot!.querySelector("nys-textinput")!;
    await group.updateComplete;

    let propagated = false;
    group.addEventListener("keydown", () => {
      propagated = true;
    });

    textInput.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );

    expect(propagated).to.be.false;
  });

  // -------------------------------------------------------------------------
  // _handleInvalid on radiogroup
  // -------------------------------------------------------------------------

  it("_handleInvalid prevents default", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Invalid" required>
        <nys-radiobutton name="hi" label="A" value="a"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const event = new Event("invalid", { cancelable: true });
    group.dispatchEvent(event);

    expect(event.defaultPrevented).to.be.true;
  });

  it("_handleInvalid sets showError when valueMissing and not in a form", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Invalid no form" required>
        <nys-radiobutton name="inf" label="A" value="a"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    expect(group.showError).to.be.false;
    group.dispatchEvent(new Event("invalid", { cancelable: true }));
    await group.updateComplete;

    expect(group.showError).to.be.true;
  });

  it("_handleInvalid focuses first radio when not in a form", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Focus no form" required>
        <nys-radiobutton name="fnf" label="A" value="a"></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const firstRadio = group.querySelector<NysRadiobutton>("nys-radiobutton")!;
    const shadowInput = group.shadowRoot?.querySelector<HTMLElement>(
      `#input-${firstRadio.id}`,
    )!;
    let focused = false;
    shadowInput.focus = () => {
      focused = true;
    };

    group.dispatchEvent(new Event("invalid", { cancelable: true }));
    await new Promise((radio) => setTimeout(radio, 0));
    expect(focused).to.be.true;
  });

  it("_handleInvalid focuses first radio when it is the first invalid element in a form", async () => {
    const container = await fixture<HTMLElement>(html`
      <form>
        <nys-radiogroup id="only-group" label="First invalid" required>
          <nys-radiobutton name="fi" label="A" value="a"></nys-radiobutton>
        </nys-radiogroup>
      </form>
    `);

    const group = container.querySelector<NysRadiogroup>("#only-group")!;
    await group.updateComplete;
    const firstRadio = group.querySelector<NysRadiobutton>("nys-radiobutton")!;
    const shadowInput = group.shadowRoot?.querySelector<HTMLElement>(
      `#input-${firstRadio.id}`,
    )!;
    let focused = false;
    shadowInput.focus = () => {
      focused = true;
    };
    group.dispatchEvent(new Event("invalid", { cancelable: true }));
    await new Promise((r) => setTimeout(r, 0));
    expect(focused).to.be.true;
  });

  it("_handleInvalid does not focus when a preceding invalid group exists in the same form", async () => {
    const container = await fixture<HTMLElement>(html`
      <form>
        <nys-radiogroup id="first-group" label="First" required>
          <nys-radiobutton name="pg1" label="A" value="a"></nys-radiobutton>
        </nys-radiogroup>
        <nys-radiogroup id="second-group" label="Second" required>
          <nys-radiobutton name="pg2" label="B" value="b"></nys-radiobutton>
        </nys-radiogroup>
      </form>
    `);

    const second = container.querySelector<NysRadiogroup>("#second-group")!;
    await second.updateComplete;

    const firstRadio = second.querySelector<NysRadiobutton>("nys-radiobutton")!;
    let focused = false;
    firstRadio.focus = () => {
      focused = true;
    };

    second.dispatchEvent(new Event("invalid", { cancelable: true }));
    await second.updateComplete;

    expect(focused).to.be.false;
  });

  // -------------------------------------------------------------------------
  // Other tests
  // -------------------------------------------------------------------------

  it("renders with 'other' property set in radiogroup", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find(
      (radio) => (radio as any).other,
    ) as NysRadiobutton;

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
    const otherRadio = radios.find(
      (radio) => (radio as any).other,
    ) as NysRadiobutton;

    const nysLabel = group.shadowRoot?.querySelector(`#${otherRadio.id}-label`);
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
    const otherRadio = radios.find(
      (radio) => (radio as any).other,
    ) as NysRadiobutton;

    const nysLabel = group.shadowRoot?.querySelector(`#${otherRadio.id}-label`);
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
    const otherRadio = radios.find(
      (radio) => (radio as any).other,
    ) as NysRadiobutton;

    let textInput = group.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.not.exist;

    group.shadowRoot
      ?.querySelector<HTMLInputElement>(`#input-${otherRadio.id}`)
      ?.click();
    await (group as NysRadiogroup).updateComplete;
    textInput = group.shadowRoot?.querySelector("nys-textinput");
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
    const regularRadio = radios.find(
      (radio) => !(radio as any).other,
    ) as NysRadiobutton;

    let textInput = group.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
    group.shadowRoot
      ?.querySelector<HTMLInputElement>(`#input-${regularRadio.id}`)
      ?.click();

    await (group as NysRadiogroup).updateComplete;
    textInput = group.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.not.exist;
  });

  it("shows error when 'other' radio is selected but text input is empty after blur", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const textInput = group.shadowRoot?.querySelector("nys-textinput");
    expect(group._showOtherError).to.be.false;
    textInput?.dispatchEvent(new Event("nys-blur", { bubbles: true }));
    await group.updateComplete;
    expect(group._showOtherError).to.be.true;
  });

  it("clears 'other' validation error when valid text is entered", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other checked></nys-radiobutton>
      </nys-radiogroup>
    `);

    const textInput = group.shadowRoot!.querySelector("nys-textinput");

    const blurEvent = new Event("nys-blur", { bubbles: true });
    textInput?.dispatchEvent(blurEvent);
    await group.updateComplete;

    expect(group._showOtherError).to.be.true;

    const inputEvent = new Event("nys-input", { bubbles: true });
    Object.defineProperty(inputEvent, "target", {
      writable: false,
      value: { value: "Valid input" },
    });

    textInput?.dispatchEvent(inputEvent);
    textInput?.dispatchEvent(blurEvent);
    await group.updateComplete;

    expect(group._showOtherError).to.be.false;
  });

  it("clicking 'other' produces the textbox with no error", async () => {
    const group = await fixture(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1"></nys-radiobutton>
        <nys-radiobutton other></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const otherRadio = radios.find(
      (radio) => (radio as any).other,
    ) as NysRadiobutton;

    group.shadowRoot
      ?.querySelector<HTMLInputElement>(`#input-${otherRadio.id}`)
      ?.click();
    await (group as NysRadiogroup).updateComplete;
    const textInput = group.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
    expect((group as any)._showOtherError).to.be.false;
  });

  it("clicking off 'other' textbox while still selected produces an error", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton label="Option 1" value="1"></nys-radiobutton>
        <nys-radiobutton other checked value=""></nys-radiobutton>
      </nys-radiogroup>
    `);
    const textInput = group.shadowRoot?.querySelector("nys-textinput");

    expect(group._showOtherError).to.be.false;

    textInput?.dispatchEvent(new Event("nys-blur", { bubbles: true }));
    await group.updateComplete;

    expect(group._showOtherError).to.be.true;
  });

  it("unselecting 'other' clears any errors for the 'other' field", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Select option">
        <nys-radiobutton
          name="choice"
          label="Option 1"
          value="1"
        ></nys-radiobutton>
        <nys-radiobutton name="choice" other checked value=""></nys-radiobutton>
      </nys-radiogroup>
    `);

    const radios = Array.from(group.querySelectorAll("nys-radiobutton"));
    const regularRadio = radios.find(
      (radio) => !(radio as any).other,
    ) as NysRadiobutton;

    const textInput = group.shadowRoot?.querySelector("nys-textinput");

    textInput?.dispatchEvent(new Event("nys-blur", { bubbles: true }));
    await group.updateComplete;

    expect((group as any)._showOtherError).to.be.true;

    group.shadowRoot
      ?.querySelector<HTMLInputElement>(`#input-${regularRadio.id}`)
      ?.click();
    await group.updateComplete;

    expect((group as any)._showOtherError).to.be.false;
  });

  it("disables textinput when 'other' checkbox is checked and disabled", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup>
        <nys-radiobutton other checked disabled></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;
    const textInput = group.shadowRoot?.querySelector("nys-textinput");
    expect(textInput).to.exist;
    expect(textInput!.hasAttribute("disabled")).to.be.true;
  });

  // -------------------------------------------------------------------------
  // More Event Tests
  // -------------------------------------------------------------------------
  it("Space and Enter keys select the focused radio and fire nys-change", async () => {
    const group = await fixture<NysRadiogroup>(html`
      <nys-radiogroup label="Space/Enter nav">
        <nys-radiobutton
          name="radioChoice"
          label="radio1"
          value="radio1"
        ></nys-radiobutton>
        <nys-radiobutton
          name="radioChoice"
          label="radio2"
          value="radio2"
        ></nys-radiobutton>
      </nys-radiogroup>
    `);
    await group.updateComplete;

    const radio1 = group.querySelectorAll<NysRadiobutton>("nys-radiobutton")[0];
    const content = group.shadowRoot!.querySelector(
      ".nys-radiogroup__content",
    )!;

    let changeDetail: any = null;
    group.addEventListener("nys-change", (e: any) => (changeDetail = e.detail));

    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
    await group.updateComplete;
    await radio1.updateComplete;

    expect(radio1.checked).to.be.true;
    expect(changeDetail).to.exist;
    expect(changeDetail.value).to.equal("radio1");
  });

  // -------------------------------------------------------------------------
  // Form Submission Test
  // -------------------------------------------------------------------------
  it("form submit focuses first radio of first invalid required group, not subsequent ones", async () => {
    const container = await fixture(html`
      <form>
        <nys-radiogroup id="first" required>
          <nys-radiobutton
            name="borough"
            value="bronx"
            label="The Bronx"
          ></nys-radiobutton>
        </nys-radiogroup>
        <nys-radiogroup id="second" required>
          <nys-radiobutton
            name="borough"
            value="brooklyn"
            label="Brooklyn"
          ></nys-radiobutton>
        </nys-radiogroup>
      </form>
    `);

    const firstGroup = container.querySelector<NysRadiogroup>("#first")!;
    const secondGroup = container.querySelector<NysRadiogroup>("#second")!;
    await firstGroup.updateComplete;
    await secondGroup.updateComplete;

    const firstRadio =
      firstGroup.querySelector<NysRadiobutton>("nys-radiobutton")!;
    const secondRadio =
      secondGroup.querySelector<NysRadiobutton>("nys-radiobutton")!;

    const focused: string[] = [];

    const firstShadowInput = firstGroup.shadowRoot?.querySelector<HTMLElement>(
      `#input-${firstRadio.id}`,
    );
    const secondShadowInput =
      secondGroup.shadowRoot?.querySelector<HTMLElement>(
        `#input-${secondRadio.id}`,
      );
    if (firstShadowInput) firstShadowInput.focus = () => focused.push("first");
    if (secondShadowInput)
      secondShadowInput.focus = () => focused.push("second");

    container.requestSubmit();
    await new Promise((r) => setTimeout(r, 0));

    expect(focused).to.include("first");
    expect(focused).to.not.include("second");
  });

  it("form submit focuses the other textinput when it is checked but empty", async () => {
    const container = await fixture(html`
      <form>
        <nys-radiogroup label="Select borough">
          <nys-radiobutton
            name="borough"
            other
            checked
            value=""
          ></nys-radiobutton>
        </nys-radiogroup>
      </form>
    `);

    const group = container.querySelector<NysRadiogroup>("nys-radiogroup")!;
    await group.updateComplete;
    const textInput =
      group.shadowRoot!.querySelector<HTMLElement>("nys-textinput")!;
    let focused = false;
    textInput.focus = () => {
      focused = true;
    };

    container.requestSubmit();
    await new Promise((r) => setTimeout(r, 0));

    expect(focused).to.be.true;
  });

  // -------------------------------------------------------------------------
  // A11y
  // -------------------------------------------------------------------------

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-radiogroup label="What is your primary work location?">
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
});
