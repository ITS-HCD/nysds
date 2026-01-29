import { expect, html, fixture, oneEvent } from "@open-wc/testing";
import "../dist/nys-fileinput.js";
import { NysFileinput } from "./nys-fileinput";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";

describe("nys-fileinput", () => {
  // Basic tests
  it("renders the component", async () => {
    const el = await fixture(html`<nys-fileinput></nys-fileinput>`);
    expect(el).to.exist;
  });

  it("generates an id if not provided", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput></nys-fileinput>`,
    );
    await el.updateComplete;

    expect(el.id).to.not.be.empty;
    expect(el.id).to.match(/^nys-fileinput-\d+-\d+$/);
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

  // Functionality tests
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

  // Adding Files tests
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

  // Slot tests
  it("renders description slot if provided", async () => {
    const el = await fixture<NysFileinput>(html`
      <nys-fileinput label="Test Label">
        <span slot="description">Custom Description</span>
      </nys-fileinput>
    `);

    const label = el.shadowRoot?.querySelector("nys-label");
    expect(label?.querySelector("slot[name=description]")).to.exist;
  });

  // Error tests
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

describe("nys-fileinput dropzone", () => {
  it("renders dropzone when dropzone=true", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone></nys-fileinput>`,
    );
    const dropzone = el.shadowRoot?.querySelector(".nys-fileinput__dropzone");
    expect(dropzone).to.exist;
  });

  it("sets _dragActive to true on dragover", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone></nys-fileinput>`,
    );
    const dropzone = el.shadowRoot?.querySelector(".nys-fileinput__dropzone")!;
    dropzone.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      }),
    );
    await el.updateComplete;

    expect(el["_dragActive"]).to.be.true;
    expect(dropzone.classList.contains("drag-active")).to.be.true;
  });

  it("resets _dragActive to false on dragleave", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone></nys-fileinput>`,
    );
    el["_dragActive"] = true;
    const dropzone = el.shadowRoot?.querySelector(".nys-fileinput__dropzone")!;
    dropzone.dispatchEvent(
      new DragEvent("dragleave", {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      }),
    );
    await el.updateComplete;

    expect(el["_dragActive"]).to.be.false;
    expect(dropzone.classList.contains("drag-active")).to.be.false;
  });

  it("adds files on drop event when multiple=true", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone multiple></nys-fileinput>`,
    );
    const dropzone = el.shadowRoot?.querySelector(".nys-fileinput__dropzone")!;

    const file1 = new File(["file1"], "file1.txt", { type: "text/plain" });
    const file2 = new File(["file2"], "file2.txt", { type: "text/plain" });
    const dt = new DataTransfer();
    dt.items.add(file1);
    dt.items.add(file2);

    dropzone.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      }),
    );
    await el.updateComplete;

    expect(el["_selectedFiles"].length).to.equal(2);
    expect(el["_selectedFiles"][0].file.name).to.equal("file1.txt");
    expect(el["_selectedFiles"][1].file.name).to.equal("file2.txt");
  });

  it("adds only one file on drop when multiple=false", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone></nys-fileinput>`,
    );
    const dropzone = el.shadowRoot?.querySelector(".nys-fileinput__dropzone")!;

    const file1 = new File(["file1"], "file1.txt", { type: "text/plain" });
    const file2 = new File(["file2"], "file2.txt", { type: "text/plain" });
    const dt = new DataTransfer();
    dt.items.add(file1);
    dt.items.add(file2);

    dropzone.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      }),
    );
    await el.updateComplete;

    expect(el["_selectedFiles"].length).to.equal(1);
    expect(el["_selectedFiles"][0].file.name).to.equal("file1.txt");
  });

  it("does not allow drop if disabled", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone disabled multiple></nys-fileinput>`,
    );
    const dropzone = el.shadowRoot?.querySelector(".nys-fileinput__dropzone")!;

    const file = new File(["file1"], "file1.txt", { type: "text/plain" });
    const dt = new DataTransfer();
    dt.items.add(file);

    dropzone.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      }),
    );
    await el.updateComplete;

    expect(el["_selectedFiles"].length).to.equal(0);
  });

  it("opens file dialog when dropzone button clicked", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput dropzone></nys-fileinput>`,
    );
    const dropzoneButton = el.shadowRoot?.querySelector(
      "#choose-files-btn-drag",
    ) as HTMLElement;
    const input = el.shadowRoot?.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement;

    let clicked = false;
    input.click = () => (clicked = true);

    dropzoneButton.dispatchEvent(
      new CustomEvent("nys-click", { bubbles: true, composed: true }),
    );
    expect(clicked).to.be.true;
  });
});
