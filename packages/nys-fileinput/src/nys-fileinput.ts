import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import styles from "./nys-fileinput.styles";
import "./nys-filelistitem";
import "@nysds/nys-icon";
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
import "@nysds/nys-button";

let fileinputIdCounter = 0; // Counter for generating unique IDs
interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

export class NysFileinput extends LitElement {
  @property({ type: String }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: String }) accept = ""; // e.g. "image/*,.pdf"
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) optional = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) errorMessage = "";
  @property({ type: Boolean }) showError = false;
  @property({ type: Boolean }) dropzone = false;

  private _selectedFiles: FileWithProgress[] = [];

  // private _selectedFiles = [] as File[];
  private _dragActive = false;

  static styles = styles;

  /********************** Lifecycle updates **********************/
  constructor() {
    super();
  }

  // Generate a unique ID if one is not provided
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-checkbox-${Date.now()}-${fileinputIdCounter++}`;
    }
  }

  /******************** Event Handlers ********************/
  private _openFileDialog() {
    const input = this.renderRoot.querySelector(
      "#hidden-file-input",
    ) as HTMLInputElement;

    input?.click();
  }

  // Access the selected files & add new files to the internal list via the hidden <input type="file">
  private _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    const newFiles = files ? Array.from(files) : []; // changes FileList to array

    // Store the files
    newFiles.map((file) => {
      this._saveSelectedFiles(file);
    });

    input.value = "";

    this.requestUpdate(); // Trigger re-render
    this._dispatchChangeEvent();
  }

  private _handleFileRemove(e: CustomEvent) {
    const filenameToRemove = e.detail.filename;

    this._selectedFiles = this._selectedFiles.filter(
      (existingFile) => existingFile.file.name !== filenameToRemove,
    );

    this.requestUpdate(); // Trigger re-render
    this._dispatchChangeEvent();
  }

  private _onDragOver(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!this._dragActive) {
      this._dragActive = true; // For styling purpose
      this.requestUpdate();
    }
  }

  // Mostly used for styling purpose
  private _onDragLeave(e: DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    // Only reset if leaving the dropzone itself (not children)
    if (e.currentTarget === e.target) {
      this._dragActive = false; // For styling purpose
      this.requestUpdate();
    }
  }

  private _onDrop(e: DragEvent) {
    e.preventDefault();
    this._dragActive = false; // For styling purpose
    this.requestUpdate();

    const files = e.dataTransfer?.files;
    if (!files) return;

    const newFiles = Array.from(files);

    newFiles.forEach((file) => {
      this._saveSelectedFiles(file);
    });

    this.requestUpdate();
    this._dispatchChangeEvent();
  }

  /******************** Functions ********************/
  // Store the files to be displayed
  private _saveSelectedFiles(file: File) {
    const isDuplicate = this._selectedFiles.some(
      (existingFile) => existingFile.file.name == file.name,
    );
    if (isDuplicate) return;

    const entry: FileWithProgress = {
      file,
      progress: 0,
      status: "pending",
    };

    this._selectedFiles.push(entry);
    this._processFile(entry);
  }

  // Read the contents of stored files, this will indicate loading progress of the uploaded files
  private _processFile(entry: FileWithProgress) {
    const reader = new FileReader();
    entry.status = "processing";

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
      entry.error = "Failed to load file.";
      this.requestUpdate();
    };

    reader.readAsArrayBuffer(entry.file); // built-in browser API that reads the contents of files stored in our File object
  }

  private _dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-fileChange", {
        detail: { files: this._selectedFiles },
        bubbles: true,
        composed: true,
      }),
    );
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
        id="hidden-file-input"
        type="file"
        name=${this.name}
        ?multiple=${this.multiple}
        accept=${this.accept}
        ?required=${this.required}
        ?disabled=${this.disabled}
        hidden
        @change=${this._handleFileChange}
      />

      ${!this.dropzone
        ? html`<nys-button
            id="file-btn"
            name="file-btn"
            label=${this.multiple ? "Choose files" : "Choose file"}
            variant="outline"
            @click=${this._openFileDialog}
          ></nys-button>`
        : html`<div
            class="nys-fileinput__dropzone ${this._dragActive
              ? "drag-active"
              : ""}"
            @dragover=${this._onDragOver}
            @dragleave=${this._onDragLeave}
            @drop=${this._onDrop}
          >
            ${this._dragActive
              ? html`<p>Drop file to upload</p>`
              : html` <nys-button
                    id="file-btn"
                    name="file-btn"
                    label=${this.multiple ? "Choose files" : "Choose file"}
                    variant="outline"
                    @click=${this._openFileDialog}
                  ></nys-button>
                  <p>or drag here</p>`}
          </div>`}
      ${this.showError
        ? html`
            <nys-errormessage
              ?showError=${this.showError}
              errorMessage=${this.errorMessage}
            ></nys-errormessage>
          `
        : null}
      ${this._selectedFiles.length > 0
        ? html`
            <ul>
              ${this._selectedFiles.map(
                (entry) =>
                  html`<li>
                    <nys-filelistitem filename=${entry.file.name} status=${entry.status} progress=${entry.progress} error=${entry.error || ""}></filelistitem>
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
