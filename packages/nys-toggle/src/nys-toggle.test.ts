import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-toggle.js";
import { NysToggle } from "./nys-toggle";

describe("nys-toggle", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-toggle></nys-toggle>`);
    expect(el).to.exist;
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

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-toggle label="My Label"></nys-toggle>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
