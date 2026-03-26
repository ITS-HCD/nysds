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
});
