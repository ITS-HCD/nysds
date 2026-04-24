import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-label.js";
import { NysLabel } from "./nys-label.js";

describe("nys-label", () => {
  it("renders the component", async () => {
    const el = await fixture(html`<nys-label></nys-label>`);
    expect(el).to.exist;
  });

  it("has correct default values", async () => {
    const el = await fixture<NysLabel>(html`<nys-label></nys-label>`);
    expect(el.label).to.equal("");
    expect(el.description).to.equal("");
    expect(el.flag).to.equal("");
    expect(el.inverted).to.equal(false);
    expect(el.tooltip).to.equal("");
  });

  it("renders passed-in label text", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="First name"></nys-label>`,
    );
    const labelEl = el.shadowRoot!.querySelector("label");
    expect(labelEl!.textContent).to.include("First name");
  });

  it("renders passed-in description text", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label description="Helper text"></nys-label>`,
    );
    const p = el.shadowRoot!.querySelector("p.nys-label__description");
    expect(p!.textContent).to.include("Helper text");
  });

  it("shows asterisk when flag is 'required'", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Email" flag="required"></nys-label>`,
    );
    const required = el.shadowRoot!.querySelector(".nys-label__required");
    expect(required).to.exist;
    expect(required!.textContent).to.include("*");
  });

  it("does not show asterisk when flag is not 'required'", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Email"></nys-label>`,
    );
    expect(el.shadowRoot!.querySelector(".nys-label__required")).to.not.exist;
  });

  it("shows '(Optional)' when flag is 'optional'", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Phone" flag="optional"></nys-label>`,
    );
    const optional = el.shadowRoot!.querySelector(".nys-label__optional");
    expect(optional).to.exist;
    expect(optional!.textContent).to.include("(Optional)");
  });

  it("does not show '(Optional)' when flag is not 'optional'", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Phone"></nys-label>`,
    );
    expect(el.shadowRoot!.querySelector(".nys-label__optional")).to.not.exist;
  });

  it("shows neither required nor optional flag when flag is an unrecognised value", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name" flag="other"></nys-label>`,
    );
    expect(el.shadowRoot!.querySelector(".nys-label__required")).to.not.exist;
    expect(el.shadowRoot!.querySelector(".nys-label__optional")).to.not.exist;
  });

  it("applies 'invert' class to wrapper when inverted is true", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name" inverted></nys-label>`,
    );
    const wrapper = el.shadowRoot!.querySelector(".nys-label");
    expect(wrapper!.classList.contains("invert")).to.be.true;
  });

  it("does not apply 'invert' class when inverted is false", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name"></nys-label>`,
    );
    const wrapper = el.shadowRoot!.querySelector(".nys-label");
    expect(wrapper!.classList.contains("invert")).to.be.false;
  });

  it("reflects inverted as an attribute", async () => {
    const el = await fixture<NysLabel>(html`<nys-label inverted></nys-label>`);
    expect(el).to.have.attribute("inverted");
  });

  it("renders nys-tooltip and nys-icon when tooltip is provided", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name" tooltip="More info"></nys-label>`,
    );
    expect(el.shadowRoot!.querySelector("nys-tooltip")).to.exist;
    expect(el.shadowRoot!.querySelector("nys-icon")).to.exist;
  });

  it("does not render nys-tooltip when tooltip is empty", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name"></nys-label>`,
    );
    expect(el.shadowRoot!.querySelector("nys-tooltip")).to.not.exist;
    expect(el.shadowRoot!.querySelector("nys-icon")).to.not.exist;
  });

  it("passes tooltip text to nys-tooltip", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name" tooltip="Helpful hint"></nys-label>`,
    );
    const tooltipEl = el.shadowRoot!.querySelector("nys-tooltip");
    expect(tooltipEl!.getAttribute("text")).to.equal("Helpful hint");
  });

  it("scopes tooltip icon id to the 'for' value", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name" tooltip="hint" id="my-field"></nys-label>`,
    );
    const icon = el.shadowRoot!.querySelector("nys-icon");
    expect(icon!.getAttribute("id")).to.equal("tooltip-icon-my-field");
  });

  it("passes inverted to nys-tooltip", async () => {
    const el = await fixture<NysLabel>(
      html`<nys-label label="Name" tooltip="hint" inverted></nys-label>`,
    );
    const tooltipEl = el.shadowRoot!.querySelector("nys-tooltip");
    expect(tooltipEl).to.have.attribute("inverted");
  });

  it("renders slotted description content", async () => {
    const el = await fixture<NysLabel>(html`
      <nys-label label="Name">
        <span slot="description">Custom <strong>HTML</strong> description</span>
      </nys-label>
    `);
    const slot = el.shadowRoot!.querySelector(
      'slot[name="description"]',
    ) as HTMLSlotElement;
    expect(slot).to.exist;
    const assigned = slot.assignedElements();
    expect(assigned.length).to.equal(1);
    expect(assigned[0].textContent).to.include("Custom");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<nys-label label="Full name"></nys-label>`);
    await expect(el).shadowDom.to.be.accessible();
  });
});
