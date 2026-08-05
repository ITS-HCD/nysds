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
    await new Promise((resolve) => setTimeout(resolve, 200));
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
    expect((el as any).internals.validationMessage).to.include(
      "Please upload a file",
    );
  });

  // Accessibility / shared-mixin regression tests
  // -------------------------------------------------------------------------
  it("associates the native input with the visible label via aria-labelledby (not a synthetic aria-label)", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput label="My Label" id="fi"></nys-fileinput>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;
    // Name comes from the real visible <nys-label>, not a duplicated string.
    expect(input.getAttribute("aria-labelledby")).to.equal("fi--label");
    expect(input.hasAttribute("aria-label")).to.equal(false);
    const label = el.shadowRoot!.getElementById("fi--label");
    expect(label).to.exist;
    expect(label!.tagName.toLowerCase()).to.equal("nys-label");
  });

  it("falls back to aria-label only when no visible label is provided", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput aria-label="Upload"></nys-fileinput>`,
    );
    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-label")).to.equal("Upload");
    expect(input.hasAttribute("aria-labelledby")).to.equal(false);
  });

  it("self-registers its internal label and error-message elements", () => {
    // The accessible-name/error association depends on these being defined.
    expect(customElements.get("nys-label")).to.exist;
    expect(customElements.get("nys-errormessage")).to.exist;
  });

  // Regression: #1763 — the error used to be associated with the hidden,
  // aria-hidden <input type="file">, which is not in the accessibility tree.
  it("does not put the error association on the aria-hidden native input", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput
        label="Doc"
        id="dc"
        showError
        errorMessage="Required"
      ></nys-fileinput>`,
    );
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector("input")!;
    expect(input.getAttribute("aria-hidden")).to.equal("true");
    expect(input.hasAttribute("aria-errormessage")).to.equal(false);
    expect(input.hasAttribute("aria-invalid")).to.equal(false);
    expect(el.shadowRoot!.getElementById("dc--error")).to.exist;
  });

  it("associates the error with the exposed control (the choose-file button)", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput
        label="Doc"
        id="dc2"
        showError
        errorMessage="Required"
      ></nys-fileinput>`,
    );
    await el.updateComplete;
    await el["_syncControlErrorAssociation"]();

    const errorEl = el.shadowRoot!.querySelector("nys-errormessage")!;
    const control = el["_innerNysButton"]!;
    expect(control, "inner <button> should resolve").to.exist;

    expect(control.getAttribute("aria-invalid")).to.equal("true");
    expect(control.getAttribute("aria-description")).to.equal("Required");

    // The message lives in a different shadow root than the control, so the
    // association travels by element reference rather than IDREF.
    const refs = (control as any).ariaDescribedByElements;
    if (refs !== undefined) {
      expect(Array.from(refs ?? [])).to.deep.equal([errorEl]);
    }
  });

  it("clears the error association on the exposed control when the error resolves", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput
        label="Doc"
        id="dc3"
        showError
        errorMessage="Required"
      ></nys-fileinput>`,
    );
    await el.updateComplete;
    await el["_syncControlErrorAssociation"]();

    el.showError = false;
    await el.updateComplete;
    await el["_syncControlErrorAssociation"]();

    const control = el["_innerNysButton"]!;
    expect(control.getAttribute("aria-invalid")).to.equal("false");
    expect(control.hasAttribute("aria-description")).to.equal(false);

    const refs = (control as any).ariaDescribedByElements;
    if (refs !== undefined) {
      expect(refs == null || Array.from(refs).length === 0).to.equal(true);
    }
  });

  it("associates the error with the exposed control in dropzone mode", async () => {
    const el = await fixture<NysFileinput>(
      html`<nys-fileinput
        label="Doc"
        id="dc4"
        dropzone
        showError
        errorMessage="Required"
      ></nys-fileinput>`,
    );
    await el.updateComplete;
    await el["_syncControlErrorAssociation"]();

    const control = el["_innerNysButton"]!;
    expect(control, "inner <button> should resolve").to.exist;
    expect(control.getAttribute("aria-invalid")).to.equal("true");
    expect(control.getAttribute("aria-description")).to.equal("Required");
  });

  it("remains form-associated through the shared mixin (FormData round-trip)", async () => {
    const form = await fixture<HTMLFormElement>(
      html`<form>
        <nys-fileinput name="upload" label="Upload"></nys-fileinput>
      </form>`,
    );
    const el = form.querySelector<NysFileinput>("nys-fileinput")!;

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    await el["_saveSelectedFiles"](file);
    await el.updateComplete;

    const submitted = new FormData(form).get("upload");
    expect(submitted).to.be.instanceOf(File);
    expect((submitted as File).name).to.equal("hello.txt");
    expect(Array.from(form.elements)).to.include(el);
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
      const dropzone = el.shadowRoot?.querySelector(
        ".nys-fileinput__dropzone",
      )!;
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
      const dropzone = el.shadowRoot?.querySelector(
        ".nys-fileinput__dropzone",
      )!;
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
      const dropzone = el.shadowRoot?.querySelector(
        ".nys-fileinput__dropzone",
      )!;

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
      const dropzone = el.shadowRoot?.querySelector(
        ".nys-fileinput__dropzone",
      )!;

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
      const dropzone = el.shadowRoot?.querySelector(
        ".nys-fileinput__dropzone",
      )!;

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

    it("resets selected files when formResetCallback is called", async () => {
      const el = await fixture<NysFileinput>(
        html`<nys-fileinput></nys-fileinput>`,
      );

      // Mock files
      el._selectedFiles = [
        { name: "file1.txt" },
        { name: "file2.png" },
      ] as any[];
      el.showError = true;
      el.errorMessage = "Some error";

      expect(el._selectedFiles.length).to.equal(2);
      expect(el.showError).to.be.true;
      expect(el.errorMessage).to.equal("Some error");

      el.formResetCallback();

      // Expect everything reset
      expect(el._selectedFiles.length).to.equal(0);
      expect(el.showError).to.be.false;
      expect(el.errorMessage).to.equal("");
      expect((el as any).internals.validity.valid).to.be.true;
    });

    it("resets when native form reset is triggered", async () => {
      const el = await fixture<NysFileinput>(
        html`<form><nys-fileinput></nys-fileinput></form>`,
      );

      const fileinput = el.querySelector("nys-fileinput") as NysFileinput;

      // Mock file
      fileinput._selectedFiles = [{ name: "file1.txt" }] as any[];

      (fileinput.closest("form") as HTMLFormElement).reset();

      expect(fileinput._selectedFiles.length).to.equal(0);
    });

    /*** More Event Test ***/
    it("<nys-fileitem> emits nys-fileRemove with filename when remove button is clicked", async () => {
      const el = await fixture<NysFileItem>(html`
        <nys-fileitem filename="report.pdf"></nys-fileitem>
      `);
      await el.updateComplete;

      let eventDetail: any = null;
      el.addEventListener(
        "nys-fileRemove",
        (e: any) => (eventDetail = e.detail),
      );

      const button = el.shadowRoot!.querySelector("nys-button")!;
      button.dispatchEvent(
        new CustomEvent("nys-click", { bubbles: true, composed: true }),
      );
      await el.updateComplete;

      expect(eventDetail).to.exist;
      expect(eventDetail.filename).to.equal("report.pdf");
    });

    /* Accessibility */
    it("passes the a11y audit", async () => {
      const el = await fixture(
        html`<nys-fileinput label="My Label"></nys-fileinput>`,
      );
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  // files / value accessors (external state management)
  describe("nys-fileinput files/value accessors", () => {
    // _saveSelectedFiles -> _processFile -> FileReader is async; flush its
    // requestUpdate()s before asserting (mirrors the pattern used above).
    const flush = async (el: NysFileinput) => {
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 200));
      await el.updateComplete;
    };

    it("files getter returns the current selection", async () => {
      const el = await fixture<NysFileinput>(
        html`<nys-fileinput multiple></nys-fileinput>`,
      );
      await el["_saveSelectedFiles"](
        new File(["a"], "a.txt", { type: "text/plain" }),
      );
      await el["_saveSelectedFiles"](
        new File(["b"], "b.txt", { type: "text/plain" }),
      );
      await flush(el);

      expect(el.files.map((f) => f.name)).to.deep.equal(["a.txt", "b.txt"]);
    });

    it("value getter returns the first file, or null when empty", async () => {
      const el = await fixture<NysFileinput>(
        html`<nys-fileinput></nys-fileinput>`,
      );
      expect(el.value).to.equal(null);

      await el["_saveSelectedFiles"](
        new File(["a"], "a.txt", { type: "text/plain" }),
      );
      await flush(el);
      expect(el.value?.name).to.equal("a.txt");
    });

    it("setting files replaces the selection and updates the form value", async () => {
      const form = await fixture<HTMLFormElement>(
        html`<form><nys-fileinput name="doc"></nys-fileinput></form>`,
      );
      const el = form.querySelector<NysFileinput>("nys-fileinput")!;

      el.files = [new File(["hello"], "hello.txt", { type: "text/plain" })];
      await flush(el);

      expect(el.files.map((f) => f.name)).to.deep.equal(["hello.txt"]);
      const submitted = new FormData(form).get("doc");
      expect(submitted).to.be.instanceOf(File);
      expect((submitted as File).name).to.equal("hello.txt");
    });

    it("setting files does NOT emit nys-change (programmatic set is silent)", async () => {
      const el = await fixture<NysFileinput>(
        html`<nys-fileinput></nys-fileinput>`,
      );
      let emitted = false;
      el.addEventListener("nys-change", () => (emitted = true));

      el.files = [new File(["hello"], "hello.txt", { type: "text/plain" })];
      await flush(el);

      expect(emitted).to.be.false;
    });

    it("setting value populates a single file; null clears it", async () => {
      const form = await fixture<HTMLFormElement>(
        html`<form><nys-fileinput name="doc"></nys-fileinput></form>`,
      );
      const el = form.querySelector<NysFileinput>("nys-fileinput")!;

      el.value = new File(["x"], "x.txt", { type: "text/plain" });
      await flush(el);
      expect(el.value?.name).to.equal("x.txt");

      el.value = null;
      await flush(el);
      expect(el.value).to.equal(null);
      expect(el["_selectedFiles"].length).to.equal(0);
      expect(new FormData(form).get("doc")).to.equal(null);
    });

    it("setting files to [] clears the selection and form value", async () => {
      const form = await fixture<HTMLFormElement>(
        html`<form><nys-fileinput name="doc"></nys-fileinput></form>`,
      );
      const el = form.querySelector<NysFileinput>("nys-fileinput")!;

      el.files = [new File(["x"], "x.txt", { type: "text/plain" })];
      await flush(el);
      expect(el.files.length).to.equal(1);

      el.files = [];
      await flush(el);
      expect(el.files.length).to.equal(0);
      expect(new FormData(form).get("doc")).to.equal(null);
    });

    it("respects multiple=false when setting multiple files", async () => {
      const el = await fixture<NysFileinput>(
        html`<nys-fileinput></nys-fileinput>`,
      );
      el.files = [
        new File(["a"], "a.txt", { type: "text/plain" }),
        new File(["b"], "b.txt", { type: "text/plain" }),
      ];
      await flush(el);
      expect(el.files.map((f) => f.name)).to.deep.equal(["a.txt"]);
    });

    it("rehydrates the selection after a form reset", async () => {
      const form = await fixture<HTMLFormElement>(
        html`<form><nys-fileinput name="doc"></nys-fileinput></form>`,
      );
      const el = form.querySelector<NysFileinput>("nys-fileinput")!;

      el.files = [new File(["hello"], "hello.txt", { type: "text/plain" })];
      await flush(el);
      const saved = el.files; // stash the File objects (e.g. in a form model)

      form.reset();
      await flush(el);
      expect(el.files.length).to.equal(0);

      el.files = saved; // rehydrate on return
      await flush(el);
      expect(el.files.map((f) => f.name)).to.deep.equal(["hello.txt"]);
    });

    it("setFiles awaits async processing before resolving", async () => {
      const el = await fixture<NysFileinput>(
        html`<nys-fileinput multiple></nys-fileinput>`,
      );
      await el.setFiles([
        new File(["a"], "a.txt", { type: "text/plain" }),
        new File(["b"], "b.txt", { type: "text/plain" }),
      ]);
      expect(el.files.map((f) => f.name)).to.deep.equal(["a.txt", "b.txt"]);
    });
  });

  // Regression: #1764 — aria-errormessage used to receive the error TEXT, which
  // is an IDREF attribute, so the relation resolved to nothing.
  describe("nys-fileitem error association", () => {
    it("references the error element by id, not by its text", async () => {
      const el = await fixture(html`
        <nys-fileitem
          filename="report.pdf"
          status="error"
          errorMessage="File type is invalid."
        ></nys-fileitem>
      `);
      await (el as any).updateComplete;

      const item = el.shadowRoot!.querySelector(".file-item")!;
      const errorEl = el.shadowRoot!.querySelector(".file-item__error")!;

      const idref = item.getAttribute("aria-errormessage");
      expect(idref).to.not.equal("File type is invalid.");
      expect(idref).to.equal(errorEl.id);
      expect(errorEl.id).to.not.be.empty;
      expect(errorEl.textContent!.trim()).to.equal("File type is invalid.");

      // The IDREF must resolve inside this same shadow root.
      expect(el.shadowRoot!.getElementById(idref!)).to.equal(errorEl);

      // Chromium does not surface aria-errormessage inside a shadow root, so the
      // relation is duplicated onto aria-describedby.
      expect(item.getAttribute("aria-describedby")).to.equal(errorEl.id);
      expect(item.getAttribute("aria-invalid")).to.equal("true");

      // The error element itself must not claim to be an invalid control.
      expect(errorEl.hasAttribute("aria-invalid")).to.equal(false);
      expect(errorEl.hasAttribute("aria-errormessage")).to.equal(false);
    });

    it("does not announce a healthy file item as invalid", async () => {
      const el = await fixture(html`
        <nys-fileitem filename="report.pdf" status="done"></nys-fileitem>
      `);
      await (el as any).updateComplete;

      const item = el.shadowRoot!.querySelector(".file-item")!;
      expect(item.getAttribute("aria-invalid")).to.equal("false");
      expect(item.hasAttribute("aria-errormessage")).to.equal(false);
      expect(item.hasAttribute("aria-describedby")).to.equal(false);
      expect(el.shadowRoot!.querySelector(".file-item__error")).to.equal(null);
    });

    it("gives each file item a distinct error id", async () => {
      const a = await fixture(html`
        <nys-fileitem
          filename="a.pdf"
          status="error"
          errorMessage="Bad"
        ></nys-fileitem>
      `);
      const b = await fixture(html`
        <nys-fileitem
          filename="b.pdf"
          status="error"
          errorMessage="Bad"
        ></nys-fileitem>
      `);
      await (a as any).updateComplete;
      await (b as any).updateComplete;

      const idA = a.shadowRoot!.querySelector(".file-item__error")!.id;
      const idB = b.shadowRoot!.querySelector(".file-item__error")!.id;
      expect(idA).to.not.equal(idB);
    });
  });
});
