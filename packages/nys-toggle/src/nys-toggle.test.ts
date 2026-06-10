import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-toggle.js";
import { NysToggle } from "./nys-toggle";

describe("nys-toggle", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-toggle></nys-toggle>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysToggle>(html`<nys-toggle></nys-toggle>`);
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-toggle-\d+-\d+$/);
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysToggle>(html`
      <nys-toggle label="My Label" checked></nys-toggle>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.checked).to.be.true;
  });

  it("toggles checked state when clicked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Toggle me"></nys-toggle>`,
    );

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );

    expect(input).to.exist;

    expect(el.checked).to.be.false;
    expect(input!.checked).to.be.false;

    input!.click();
    await el.updateComplete;

    expect(el.checked).to.be.true;
    expect(el.hasAttribute("checked")).to.be.true;
    expect(input!.checked).to.be.true;

    input!.click();
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(el.hasAttribute("checked")).to.be.false;
    expect(input!.checked).to.be.false;
  });

  it("emits nys-focus and nys-blur when tabbing to and from the checkbox", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="test"></nys-toggle>`,
    );

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
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

  it("emits nys-change with correct detail when clicked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Toggle me"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    )!;

    let lastDetail: { id: string; checked: boolean } | null = null;
    el.addEventListener(
      "nys-change",
      (e) => (lastDetail = (e as CustomEvent).detail),
    );

    input.click();
    await el.updateComplete;

    expect(lastDetail).to.not.be.null;
    expect(lastDetail!.checked).to.be.true;
    expect(lastDetail!.id).to.equal(el.id);
  });

  it("toggles checked state when the slider span is clicked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Toggle me"></nys-toggle>`,
    );

    const slider = el.shadowRoot!.querySelector<HTMLElement>(".slider")!;
    expect(el.checked).to.be.false;

    slider.click();
    await el.updateComplete;

    expect(el.checked).to.be.true;

    slider.click();
    await el.updateComplete;

    expect(el.checked).to.be.false;
  });

  it("toggles checked and emits nys-change on Space and Enter keydown", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Toggle me"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    )!;

    let eventDetail: any = null;
    el.addEventListener("nys-change", (e: any) => (eventDetail = e.detail));

    // Space key
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.checked).to.equal(true);

    eventDetail = null; // reset

    // Enter key
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );

    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(eventDetail).to.exist;
    expect(eventDetail.checked).to.equal(false);
  });

  it("resets checked state when form is reset", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-toggle checked value="on"></nys-toggle>
      </form>
    `);

    const toggle = form.querySelector<NysToggle>("nys-toggle")!;
    const input = toggle.shadowRoot!.querySelector<HTMLInputElement>("input")!;

    // Initial state
    expect(toggle.checked).to.be.true;
    expect(input.checked).to.be.true;

    form.reset();
    await toggle.updateComplete;

    // Confirm reset
    expect(toggle.checked).to.be.false;
    expect(input.checked).to.be.false;
    expect((toggle as any)._internals.formValue).to.be.undefined;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-toggle label="My Label"></nys-toggle>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  // --- Property defaults ---

  it("has correct default property values", async () => {
    const el = await fixture<NysToggle>(html`<nys-toggle></nys-toggle>`);
    await el.updateComplete;

    expect(el.name).to.equal("");
    expect(el.value).to.equal("");
    expect(el.label).to.equal("");
    expect(el.description).to.equal("");
    expect(el.checked).to.be.false;
    expect(el.disabled).to.be.false;
    expect(el.noIcon).to.be.false;
    expect(el.inverted).to.be.false;
    expect(el.size).to.equal("md");
  });

  // --- Explicit id preserved ---

  it("preserves an explicitly provided id", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle id="my-toggle"></nys-toggle>`,
    );
    await el.updateComplete;

    expect(el.id).to.equal("my-toggle");
  });

  // --- Rendering branches: label present vs absent ---

  it("renders nys-label when label is provided", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Dark mode"></nys-toggle>`,
    );
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector("nys-label");
    expect(label).to.exist;
    expect(label!.getAttribute("label")).to.equal("Dark mode");
  });

  it("does not render nys-label when label is empty", async () => {
    const el = await fixture<NysToggle>(html`<nys-toggle></nys-toggle>`);
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector("nys-label");
    expect(label).to.not.exist;
  });

  it("passes description to nys-label when provided", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle
        label="Wi-Fi"
        description="Enable wireless"
      ></nys-toggle>`,
    );
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector("nys-label");
    expect(label).to.exist;
    expect(label!.getAttribute("description")).to.equal("Enable wireless");
  });

  // --- noIcon branch ---

  it("renders nys-icon inside knob by default", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    const icon = el.shadowRoot!.querySelector("nys-icon");
    expect(icon).to.exist;
  });

  it("hides nys-icon when noIcon is set", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" noIcon></nys-toggle>`,
    );
    await el.updateComplete;

    const icon = el.shadowRoot!.querySelector("nys-icon");
    expect(icon).to.not.exist;
  });

  it("shows check icon when checked and close icon when unchecked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    const icon = el.shadowRoot!.querySelector("nys-icon")!;
    expect(icon.getAttribute("name")).to.equal("close");

    el.checked = true;
    await el.updateComplete;

    expect(icon.getAttribute("name")).to.equal("check");
  });

  // --- inverted reflects ---

  it("reflects inverted attribute", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" inverted></nys-toggle>`,
    );
    await el.updateComplete;

    expect(el.inverted).to.be.true;
    expect(el.hasAttribute("inverted")).to.be.true;
  });

  it("passes inverted to nys-label", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" inverted></nys-toggle>`,
    );
    await el.updateComplete;

    const label = el.shadowRoot!.querySelector("nys-label");
    expect(label).to.exist;
    expect(label!.hasAttribute("inverted")).to.be.true;
  });

  // --- size reflects ---

  it("reflects size attribute", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle size="sm"></nys-toggle>`,
    );
    await el.updateComplete;

    expect(el.size).to.equal("sm");
    expect(el.getAttribute("size")).to.equal("sm");
  });

  // --- aria attributes ---

  it("sets role=switch on the input", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("role")).to.equal("switch");
  });

  it("sets aria-checked=false when unchecked and aria-checked=true when checked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-checked")).to.equal("false");

    el.checked = true;
    await el.updateComplete;

    expect(input.getAttribute("aria-checked")).to.equal("true");
  });

  it("sets aria-disabled=false when enabled and aria-disabled=true when disabled", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-disabled")).to.equal("false");

    el.disabled = true;
    await el.updateComplete;

    expect(input.getAttribute("aria-disabled")).to.equal("true");
  });

  it("sets aria-label to label text when label is provided", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Notifications"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-label")).to.equal("Notifications");
  });

  it("falls back aria-label to 'Toggle switch' when label is empty", async () => {
    const el = await fixture<NysToggle>(html`<nys-toggle></nys-toggle>`);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-label")).to.equal("Toggle switch");
  });

  // --- disabled state ---

  it("marks the input as disabled when disabled attribute is set", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" disabled></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    expect(input.disabled).to.be.true;
  });

  it("does not toggle or emit nys-change when disabled and input is clicked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" disabled></nys-toggle>`,
    );
    await el.updateComplete;

    let fired = false;
    el.addEventListener("nys-change", () => (fired = true));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.click();
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(fired).to.be.false;
  });

  it("does not toggle or emit nys-change when disabled and slider is clicked", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" disabled></nys-toggle>`,
    );
    await el.updateComplete;

    let fired = false;
    el.addEventListener("nys-change", () => (fired = true));

    const slider = el.shadowRoot!.querySelector<HTMLElement>(".slider")!;
    slider.click();
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(fired).to.be.false;
  });

  it("does not toggle or emit nys-change when disabled and Space is pressed", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" disabled></nys-toggle>`,
    );
    await el.updateComplete;

    let fired = false;
    el.addEventListener("nys-change", () => (fired = true));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        code: "Space",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(fired).to.be.false;
  });

  it("does not toggle or emit nys-change when disabled and Enter is pressed", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test" disabled></nys-toggle>`,
    );
    await el.updateComplete;

    let fired = false;
    el.addEventListener("nys-change", () => (fired = true));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(fired).to.be.false;
  });

  // --- nys-change fires exactly once ---

  it("fires nys-change exactly once per click", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-change", () => count++);

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.click();
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  it("fires nys-change exactly once per slider click", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-change", () => count++);

    const slider = el.shadowRoot!.querySelector<HTMLElement>(".slider")!;
    slider.click();
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  // --- nys-focus / nys-blur fire exactly once ---

  it("fires nys-focus exactly once on input focus", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-focus", () => count++);

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  it("fires nys-blur exactly once on input blur", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    let count = 0;
    el.addEventListener("nys-blur", () => count++);

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await el.updateComplete;

    expect(count).to.equal(1);
  });

  // --- nys-label click triggers toggle ---

  it("toggles checked and emits nys-change when nys-label-click event fires", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    let detail: any = null;
    el.addEventListener(
      "nys-change",
      (e) => (detail = (e as CustomEvent).detail),
    );

    const label = el.shadowRoot!.querySelector("nys-label")!;
    label.dispatchEvent(new CustomEvent("nys-label-click", { bubbles: true }));
    await el.updateComplete;

    expect(el.checked).to.be.true;
    expect(detail).to.exist;
    expect(detail.checked).to.be.true;
  });

  // --- name attribute uses ifDefined (omitted when empty) ---

  it("omits name attribute on input when name is empty", async () => {
    const el = await fixture<NysToggle>(html`<nys-toggle></nys-toggle>`);
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.hasAttribute("name")).to.be.false;
  });

  it("sets name attribute on input when name is provided", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle name="notifications"></nys-toggle>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("name")).to.equal("notifications");
  });

  // --- form value via FormData ---

  it("sets form value to the value string when checked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-toggle name="notifications" value="on" checked></nys-toggle>
      </form>
    `);
    const el = form.querySelector<NysToggle>("nys-toggle")!;
    await el.updateComplete;

    expect(new FormData(form).get("notifications")).to.equal("on");
  });

  it("omits form value when unchecked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-toggle name="notifications" value="on"></nys-toggle>
      </form>
    `);
    const el = form.querySelector<NysToggle>("nys-toggle")!;
    await el.updateComplete;

    expect(new FormData(form).get("notifications")).to.be.null;
  });

  it("updates form value reactively when checked changes", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <nys-toggle name="feature" value="enabled"></nys-toggle>
      </form>
    `);
    const el = form.querySelector<NysToggle>("nys-toggle")!;
    await el.updateComplete;

    expect(new FormData(form).get("feature")).to.be.null;

    el.checked = true;
    await el.updateComplete;

    expect(new FormData(form).get("feature")).to.equal("enabled");

    el.checked = false;
    await el.updateComplete;

    expect(new FormData(form).get("feature")).to.be.null;
  });

  // --- Other keyboard keys are ignored ---

  it("does not toggle on non-Space/Enter keydown", async () => {
    const el = await fixture<NysToggle>(
      html`<nys-toggle label="Test"></nys-toggle>`,
    );
    await el.updateComplete;

    let fired = false;
    el.addEventListener("nys-change", () => (fired = true));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        code: "Tab",
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.checked).to.be.false;
    expect(fired).to.be.false;
  });
});
