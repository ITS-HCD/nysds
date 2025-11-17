import { expect, html, fixture } from "@open-wc/testing";
import "../dist/nys-select.js";
import { NysSelect } from "./nys-select";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-icon";

describe("nys-select", () => {
  it("renders the component", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select label="My Label" required optional disabled></nys-select>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
    expect(el.disabled).to.be.true;
  });

  it("generates a unique id if none is provided", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    expect(el.id).to.match(/^nys-select-\d+-\d+$/);
  });

  it("renders nys-option as native option", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <nys-option value="1" label="Option 1"></nys-option>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    const option = select.querySelector("option[value='1']");
    expect(option).to.exist;
    expect(option?.textContent).to.equal("Option 1");
  });

  it("renders native option passed in slot", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="2">Native Option</option>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    const option = select.querySelector("option[value='2']");
    expect(option).to.exist;
    expect(option?.textContent).to.equal("Native Option");
  });

  it("renders optgroup with nested options", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <optgroup label="Group 1">
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c" label="C"></option>
        </optgroup>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    const group = select.querySelector("optgroup")!;
    expect(group).to.exist;
    expect(group.label).to.equal("Group 1");

    const options = group.querySelectorAll("option");
    expect(options.length).to.equal(3);
    expect(options[0].value).to.equal("a");
    expect(options[1].value).to.equal("b");
    expect(options[2].value).to.equal("c");
  });

  it("handles required validation and displays error", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select required></nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    select.value = "";
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;
    const errorMessage = el.shadowRoot?.querySelector("nys-errormessage");
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
  });

  it("shows error message when required select is submitted without a value", async () => {
    const el = await fixture<HTMLFormElement>(html`
      <form>
        <nys-select required>
          <option value="">Select an option</option>
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
        </nys-select>
      </form>
    `);

    const select = el.querySelector<NysSelect>("nys-select")!;
    const errorMessage = select.shadowRoot?.querySelector("nys-errormessage");

    expect(errorMessage?.hasAttribute("showError")).to.be.false; //before submit

    select.dispatchEvent(new Event("blur"));
    await select.updateComplete;
    // prevent actual navigation
    el.addEventListener("submit", (e) => e.preventDefault());

    // submit the form
    el.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await select.updateComplete;

    // check if error message appears after submit
    expect(errorMessage?.hasAttribute("showError")).to.be.true;
  });

  it("updates value and emits nys-change", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select>
        <option value="x">X</option>
      </nys-select>
    `);
    const select = el.shadowRoot?.querySelector("select")!;
    let eventDetail: any = null;
    el.addEventListener("nys-change", (e: any) => (eventDetail = e.detail));
    select.value = "x";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(el.value).to.equal("x");
    expect(eventDetail.value).to.equal("x");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture<NysSelect>(html`
      <nys-select label="Select Something"></nys-select>
    `);
    await expect(el).shadowDom.to.be.accessible();
    const select = el.shadowRoot?.querySelector("select")!;
    expect(select?.getAttribute("aria-label")).to.equal("Select Something");
  });

  it("supports disabled attribute", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select disabled></nys-select>`,
    );
    const select = el.shadowRoot?.querySelector("select")!;
    expect(select?.disabled).to.be.true;
    expect(select?.getAttribute("aria-disabled")).to.equal("true");
  });

  it("supports focus and blur events", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    let focused = false;
    let blurred = false;
    el.addEventListener("nys-focus", () => (focused = true));
    el.addEventListener("nys-blur", () => (blurred = true));
    const select = el.shadowRoot?.querySelector("select")!;
    select.focus();
    select.dispatchEvent(new Event("focus"));
    select.blur();
    select.dispatchEvent(new Event("blur"));
    await el.updateComplete;
    expect(focused).to.be.true;
    expect(blurred).to.be.true;
  });

  it("runs native checkValidity", async () => {
    const el = await fixture<NysSelect>(html`<nys-select></nys-select>`);
    expect(el.checkValidity()).to.be.true;
  });

  it("resets value when formResetCallback is called", async () => {
    const el = await fixture<NysSelect>(
      html`<nys-select value="foo"></nys-select>`,
    );
    expect(el.value).to.equal("foo");
    el.formResetCallback();
    expect(el.value).to.equal("");
  });
});
