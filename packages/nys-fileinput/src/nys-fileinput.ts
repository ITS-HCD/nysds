import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { validateFileHeader } from "./validateFileHeader";
import styles from "./nys-fileinput.styles";
import "./nys-filelistitem";

let fileinputIdCounter = 0; // Counter for generating unique IDs

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "processing" | "done" | "error";
  errorMsg?: string;
}

export class NysFileinput extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: String }) accept = ""; // e.g. "image/*,.pdf"
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean }) dropzone = false;
  @property({ type: String, reflect: true }) width: "lg" | "full" = "full";

  static styles = styles;

  private _selectedFiles: FileWithProgress[] = [];
  private _dragActive = false;
  private get _isDropDisabled(): boolean {
    return this.disabled || (!this.multiple && this._selectedFiles.length > 0);
  }

  private _internals: ElementInternals;

  /********************** Lifecycle updates **********************/
  static formAssociated = true; // allows use of elementInternals' API

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${fileinputIdCounter++}`;
    }

    this.addEventListener("invalid", this._handleInvalid);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
  }

  firstUpdated() {
    // This ensures our element always participates in the form
    this._setValue();
  }

  /********************** Form Integration **********************/
  private _setValue() {
    // for multiple file uploads, we upload File object as an array
    if (this.multiple) {
      const files = this._selectedFiles.map((entry) => entry.file);

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(this.name, file);
        });
        this._internals.setFormValue(formData);
      } else {
        this._internals.setFormValue(null);
      }
    } else {
      const singleFile = this._selectedFiles[0]?.file || null;
      this._internals.setFormValue(singleFile);
    }

    this._manageRequire(); // Check validation when value is set
  }

  // Called to internally set the initial internalElement required flag.
  private _manageRequire() {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    const message = this.errorMessage || "Please upload a file.";
    const isInvalid = this.required && this._selectedFiles.length == 0;

    if (isInvalid) {
      this._internals.ariaRequired = "true"; // Screen readers should announce error
      this._internals.setValidity({ valueMissing: true }, message, input);
    } else {
      this._internals.ariaRequired = "false"; // Reset when valid
      this._internals.setValidity({});
    }
  }

  private _setValidityMessage(message: string = "") {
    const input = this.shadowRoot?.querySelector("input");
    if (!input) return;

    // Toggle the HTML <div> tag error message
    this.showError = message === (this.errorMessage || "Please upload a file.");
    // If user sets errorMessage, this will always override the native validation message
    if (this.errorMessage?.trim() && message !== "") {
      message = this.errorMessage;
    }

    this._internals.setValidity(
      message ? { customError: true } : {},
      message,
      input,
    );
  }

  private _validate() {
    const hasCorruptedFiles = this._selectedFiles.some(
      (entry) => entry.status === "error",
    );
    const isEmpty = this.required && this._selectedFiles.length === 0;

    let message = "";
    if (isEmpty) {
      message = this.errorMessage || "Please upload a file.";
    } else if (hasCorruptedFiles) {
      message = "One or more files are invalid.";
    }

    this._setValidityMessage(message);
  }

  /******************** Functions ********************/
  // Store the files to be displayed
  private async _saveSelectedFiles(file: File) {
    const isDuplicate = this._selectedFiles.some(
      (existingFile) => existingFile.file.name == file.name,
    );
    if (isDuplicate) return;

    if (!this.multiple && this._selectedFiles.length >= 1) return;

    const entry: FileWithProgress = {
      file,
      progress: 0,
      status: "pending",
    };

    this._selectedFiles.push(entry);
    await this._processFile(entry);

    // Now that the file is added, update form value and validation
    this._setValue();
    this._validate();
  }

  // Read the contents of stored files, this will indicate loading progress of the uploaded files
  private async _processFile(entry: FileWithProgress) {
    entry.status = "processing";

    try {
      const isValid = await validateFileHeader(entry.file, this.accept);
      if (!isValid) {
        entry.status = "error";
        entry.errorMsg = "File format does not match expected type.";
        this.requestUpdate();
        return;
      }

      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          entry.progress = percentage;
          this.requestUpdate();
        }
      };

      reader.onload = () => {
        entry.progress = 100;
        entry.status = "done";
        this.requestUpdate();
      };

      reader.onerror = () => {
        entry.status = "error";
        entry.errorMsg = "Failed to load file.";
        this.requestUpdate();
      };

      reader.readAsArrayBuffer(entry.file);
    } catch {
      entry.status = "error";
      entry.errorMsg = "Error validating file.";
      this.requestUpdate();
    }
  }

  private _dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { files: this._selectedFiles },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _openFileDialog() {
    const input = this.renderRoot.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement;

    input?.click();
  }

  /******************** Event Handlers ********************/
  // Access the selected files & add new files to the internal list via the hidden <input type="file">
  private _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    const newFiles = files ? Array.from(files) : []; // changes FileList to array

    // Store the uploaded files
    newFiles.map((file) => {
      this._saveSelectedFiles(file);
    });

    input.value = "";

    this.requestUpdate();
    this._dispatchChangeEvent();
  }

  private _handleFileRemove(e: CustomEvent) {
    const filenameToRemove = e.detail.filename;

    // Remove selected files
    this._selectedFiles = this._selectedFiles.filter(
      (existingFile) => existingFile.file.name !== filenameToRemove,
    );
    this._setValue();
    this._validate();

    this.requestUpdate();
    this._dispatchChangeEvent();
  }

  private _onDragOver(e: DragEvent) {
    if (this.disabled) return;

    e.stopPropagation();
    e.preventDefault();
    if (!this._dragActive) {
      this._dragActive = true; // For styling purpose
      this.requestUpdate();
    }
  }

  // Mostly used for styling purpose
  private _onDragLeave(e: DragEvent) {
    if (this.disabled) return;

    e.stopPropagation();
    e.preventDefault();
    // Only reset if leaving the dropzone itself (not children)
    if (e.currentTarget === e.target) {
      this._dragActive = false; // For styling purpose
      this.requestUpdate();
    }
  }

  private _onDrop(e: DragEvent) {
    if (this.disabled) return;

    e.preventDefault();
    this._dragActive = false; // For styling purpose
    this.requestUpdate();

    const files = e.dataTransfer?.files;
    if (!files) return;

    const newFiles = Array.from(files);

    if (this.multiple) {
      newFiles.forEach((file) => {
        this._saveSelectedFiles(file);
      });
    } else {
      this._saveSelectedFiles(newFiles[0]);
    }

    this.requestUpdate();
    this._dispatchChangeEvent();
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._validate();

    const input = this.shadowRoot?.querySelector("input");
    if (input) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        // Find the first element in the form that is invalid
        const firstInvalidElement = elements.find(
          (element) =>
            typeof element.checkValidity === "function" &&
            !element.checkValidity(),
        );
        if (firstInvalidElement === this) {
          input.focus();
        }
      } else {
        // If not part of a form, simply focus.
        input.focus();
      }
    }
  }

  render() {
    return html`<div
      class="nys-fileinput"
      @nys-fileRemove=${this._handleFileRemove}
    >
      <nys-label
        id=${this.id}
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>

      <input
        id=${this.id}
        class="hidden-file-input"
        type="file"
        name=${this.name}
        ?multiple=${this.multiple}
        accept=${this.accept}
        ?required=${this.required}
        ?disabled=${this.disabled ||
        (!this.multiple && this._selectedFiles.length > 0)}
        aria-disabled="${this.disabled}"
        aria-label="Drag files here or choose from folder"
        aria-describedby="file-input-specific-hint"
        style="position: absolute; width: 1px; height: 1px; opacity: 0;"
        @change=${this._handleFileChange}
      />

      ${!this.dropzone
        ? html`<nys-button
            id="file-btn"
            name="file-btn"
            label=${this.multiple ? "Choose files" : "Choose file"}
            variant="outline"
            ?disabled=${this.disabled ||
            (!this.multiple && this._selectedFiles.length > 0)}
            .onClick=${() => this._openFileDialog()}
          ></nys-button>`
        : html`<div
            class="nys-fileinput__dropzone
              ${this._dragActive ? "drag-active" : ""}
              ${this._isDropDisabled ? "disabled" : ""}
              ${this.showError && !this._isDropDisabled ? "error" : ""}"
            @click=${this._isDropDisabled ? null : this._openFileDialog}
            @keydown=${(e: KeyboardEvent) =>
              !this._isDropDisabled &&
              (e.key === "Enter" || e.key === " ") &&
              this._openFileDialog()}
            @dragover=${this._isDropDisabled ? null : this._onDragOver}
            @dragleave=${this._isDropDisabled ? null : this._onDragLeave}
            @drop=${this._isDropDisabled ? null : this._onDrop}
          >
            ${this._dragActive
              ? html`<p>Drop file to upload</p>`
              : html` <nys-button
                    id="file-btn"
                    name="file-btn"
                    label=${this.multiple ? "Choose files" : "Choose file"}
                    variant="outline"
                    ?disabled=${this._isDropDisabled}
                    .onClick=${() => this._openFileDialog()}
                  ></nys-button>
                  <p>or drag here</p>`}
          </div>`}
      ${this.showError
        ? html`
            <nys-errormessage
              ?showError=${this.showError}
              errorMessage=${this._internals.validationMessage ||
              this.errorMessage}
            ></nys-errormessage>
          `
        : null}
      ${this._selectedFiles.length > 0
        ? html`
            <ul>
              ${this._selectedFiles.map(
                (entry) =>
                  html`<li>
                    <nys-filelistitem filename=${entry.file.name} status=${entry.status} progress=${entry.progress} errorMessage=${entry.errorMsg || ""}></filelistitem>
                  </li>`,
              )}
            </ul>
          `
        : null}
    </div>`;
  }
}

if (!customElements.get("nys-fileinput")) {
  customElements.define("nys-fileinput", NysFileinput);
}
