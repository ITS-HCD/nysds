import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-fileinput.js";
import { NysFileinput } from "./nys-fileinput";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";

// Below are placeholder examples of test cases for a web component. Add your own tests as needed.
describe("nys-fileinput", () => {
  /*** Basic tests ***/
  it("renders the component", async () => {
    const el = await fixture(html`<nys-fileinput></nys-fileinput>`);
    expect(el).to.exist;
  });

  it("reflects attributes to properties", async () => {
    const el = await fixture<NysFileinput>(html`
      <nys-fileinput label="My Label" required optional></nys-fileinput>
    `);
    expect(el.label).to.equal("My Label");
    expect(el.required).to.be.true;
    expect(el.optional).to.be.true;
  });

  it("uses 'full' width by default", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );
    expect(el.width).to.equal("full");
  });

  it("respects accept attribute for input", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput accept="image/*,.pdf"></nys-fileinput>`,
    );

    const input = el.shadowRoot?.querySelector("input");
    expect(input?.getAttribute("accept")).to.equal("image/*,.pdf");
  });

  it("disables file button when disable=true", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput disabled></nys-fileinput>`,
    );

    const button = el.shadowRoot?.querySelector("nys-button");
    expect(button?.hasAttribute("disabled")).to.be.true;
  });

  /*** Functionality tests ***/
  it("opens file dialog when button onClick is called", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );
    const input = el.shadowRoot?.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement;

    // Mock the input click method
    let clicked = false;
    input.click = () => (clicked = true);

    const button = el.shadowRoot?.querySelector("nys-button") as any;
    button.dispatchEvent(
      new CustomEvent("nys-click", {
        bubbles: true,
        composed: true,
      }),
    );

    expect(clicked).to.be.true;
  });

  it("emits 'nys-change' event when files are added", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );
    const input = el.shadowRoot?.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement;

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    input.files = dataTransfer.files;

    setTimeout(() => input.dispatchEvent(new Event("change")));
    const event = await oneEvent(el, "nys-change");

    // Check event emitted and event details
    expect(event).to.exist;
    expect(event.detail.files.length).to.equal(1);
    expect(event.detail.files[0].file.name).to.equal("hello.txt");
  });

  /*** Adding Files tests ***/
  it("adds file to _selectedFiles and updates form value", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    await el["_saveSelectedFiles"](file);

    // Check _selectedFiles has the new file
    expect(el["_selectedFiles"].length).to.equal(1);
    expect(el["_selectedFiles"][0].file.name).to.equal("hello.txt");
  });

  it("prevents adding more than one file when multiple=false", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );
    const file1 = new File(["file1"], "file1.txt", { type: "text/plain" });
    const file2 = new File(["file2"], "file2.txt", { type: "text/plain" });

    await el["_saveSelectedFiles"](file1);
    await el["_saveSelectedFiles"](file2); // should not add second file

    expect(el["_selectedFiles"].length).to.equal(1);
  });

  it("allows multiple files when multiple=true", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput multiple></nys-fileinput>`,
    );
    const file1 = new File(["file1"], "file1.txt", { type: "text/plain" });
    const file2 = new File(["file2"], "file2.txt", { type: "text/plain" });

    await el["_saveSelectedFiles"](file1);
    await el["_saveSelectedFiles"](file2);

    expect(el["_selectedFiles"].length).to.equal(2);
  });

  it("disables button if multiple=false and a file is already selected", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );
    const file = new File(["file1"], "file1.txt", { type: "text/plain" });
    await el["_saveSelectedFiles"](file);
    await el.updateComplete;

    // Wait for all requestUpdate()s from FileReader.onload to finish
    await new Promise((resolve) => setTimeout(resolve, 10));
    await el.updateComplete;

    const button = el.shadowRoot?.querySelector("nys-button");
    expect(el["_selectedFiles"].length).to.equal(1);
    expect(button?.hasAttribute("disabled")).to.be.true;
  });

  /*** Slot tests ***/
  it("renders description slot if provided", async () => {
    const el = await fixture<NysFileinput>(html`
      <nys-fileinput label="Test Label">
        <span slot="description">Custom Description</span>
      </nys-fileinput>
    `);

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.querySelector("slot[name=description]")).to.exist;
  });

  /*** Error tests ***/
  it("shows error when required but no file selected", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput required></nys-fileinput>`,
    );
    el["_validate"]();

    expect(el.showError).to.be.true;
    expect(el["_internals"].validationMessage).to.include(
      "Please upload a file",
    );
  });

  /* Accessibility */
  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<nys-fileinput label="My Label"></nys-fileinput>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
