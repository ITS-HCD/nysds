import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { NysFormControlElement, associateControlRefs } from "@nysds/internals";
import { validateFileHeader } from "./validateFileHeader";
import "./nys-fileitem";
// These internal elements are rendered inside this component's shadow DOM, so
// they must be registered whenever nys-fileinput is used. Importing them here
// (intentional side effect) guarantees the visible label and error message —
// which the accessible name/error association depends on — always render.
import "@nysds/nys-label";
import "@nysds/nys-errormessage";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-fileinput.scss?inline";

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "processing" | "done" | "error";
  errorMsg?: string;
}

/**
 * A file input for uploading files with support for multiple files, drag-and-drop, and progress tracking.
 * Validates file types via magic bytes (not just extension). Form-associated via ElementInternals.
 *
 * Use for document uploads, image uploads, or any file submission. Enable `dropzone` for drag-and-drop UI.
 *
 * Read or write the current selection via the `files` (`File[]`) and `value` (`File | null`)
 * properties — useful for rehydrating state or binding from a framework form model.
 * Setting them is silent (does not emit `nys-change`).
 *
 * @summary File input with drag-and-drop, validation, and progress tracking.
 * @element nys-fileinput
 *
 * @slot description - Custom HTML description content.
 *
 * @fires nys-change - Fired once per user action (file selection, drop, or removal).
 * Detail: `{id, files, changedFiles}`. The `files` is the full current selection
 * Whereas `changedFiles` is the entries this action added or removed.
 * Both `changedFiles` and each entry in `files` are `{ file: File, progress: number, status: "pending" | "processing" | "done" | "error", errorMsg?: string }`.
 *
 * @fires nys-blur - Fired when focus leaves the component. Triggers validation.
 *
 * @example Basic
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 * ></nys-fileinput>
 * ```
 *
 * @example Dropzone
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   dropzone
 * ></nys-fileinput>
 * ```
 *
 * @example Multiple
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   multiple
 * ></nys-fileinput>
 * ```
 *
 * @example Accepted Filetypes
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   description="Accepted file types: .jpg, .png, .pdf"
 *   accept="image/png, image/jpeg, .pdf"
 * ></nys-fileinput>
 * ```
 *
 * @example Width Large
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   width="lg"
 * ></nys-fileinput>
 * ```
 *
 * @example Width Large Dropzone
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   width="lg"
 *   dropzone
 * ></nys-fileinput>
 * ```
 *
 * @example Disabled
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   disabled
 * ></nys-fileinput>
 * ```
 *
 * @example Description
 * ```html
 * <nys-fileinput
 *   label="Upload a file"
 *   description="Make sure the file is not blurry and readable"
 * ></nys-fileinput>
 * ```
 *
 * @example Description Slot
 * ```html
 * <nys-fileinput label="Upload a file">
 *   <div slot="description">Make sure the file is <strong>legible</strong></div>
 * </nys-fileinput>
 * ```
 */

export class NysFileinput extends NysFormControlElement {
  static styles = unsafeCSS(styles);
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Unique identifier. Auto-generated if not provided. */
  @property({ type: String, reflect: true }) id = "";

  /** Name for form submission. */
  @property({ type: String, reflect: true }) name = "";

  /** Visible label text. */
  @property({ type: String }) label = "";

  /** Helper text below label. Use slot for custom HTML. */
  @property({ type: String }) description = "";

  /** Allows selecting multiple files. */
  @property({ type: Boolean }) multiple = false;

  /** Form `id` to associate with. */
  @property({ type: String, reflect: true }) form: string | null = null;

  /** Tooltip text shown on hover/focus of info icon. */
  @property({ type: String }) tooltip = "";

  /** Accepted file types. Use MIME types (`image/*`) or extensions (`.pdf`). Validated via magic bytes. */
  @property({ type: String }) accept = "";

  /** Prevents interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Requires at least one file to be uploaded. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Shows "Optional" flag. */
  @property({ type: Boolean, reflect: true }) optional = false;

  /** Shows error message when true. */
  @property({ type: Boolean, reflect: true }) showError = false;

  /** Error message text. Shown only when `showError` is true. */
  @property({ type: String }) errorMessage = "";

  /** Enables drag-and-drop zone UI. */
  @property({ type: Boolean }) dropzone = false;

  /**
   * Component width: `lg` (384px) or `full` (100%, default).
   * @default "full"
   */
  @property({ type: String, reflect: true }) width: "lg" | "full" = "full";

  /** Adjusts colors for dark backgrounds. */
  @property({ type: Boolean, reflect: true }) inverted = false;

  // Source of truth for the current selection (file + progress + status).
  // The public `files`/`value` accessors below read from and write to this.
  private _selectedFiles: FileWithProgress[] = [];

  /**
   * The currently selected files. Read to get the current selection; set to
   * replace it (e.g. rehydrating state after navigation, or binding from a
   * framework form model). Property-only — a `File[]` cannot round-trip through
   * an HTML attribute. Setting this is silent (does not emit `nys-change`),
   * matching native input behavior and avoiding feedback loops in two-way bindings.
   */
  @property({ attribute: false })
  get files(): File[] {
    return this._selectedFiles.map((entry) => entry.file);
  }

  set files(incoming: File[]) {
    // Replace the current selection with the provided files.
    this._selectedFiles = [];
    const input = this.renderRoot?.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement | null;
    if (input) input.value = "";

    // Reuse the user-driven intake path: dedupes, enforces single-file mode,
    // validates via magic bytes, and calls _setValue()/_validate() per file.
    // NOTE: _saveSelectedFiles does NOT dispatch nys-change, so programmatic
    // sets stay silent — user-driven changes still emit via _handleFileChange/_onDrop.
    (incoming ?? []).forEach((file) => this._saveSelectedFiles(file));

    // Sync form value + validity now (covers the empty/clear case, where the
    // loop above never runs); async _processFile re-syncs per file as it settles.
    this._setValue();
    this._validate();

    this.requestUpdate();
  }

  /**
   * Single-file convenience accessor (parity with `nys-textinput`'s `value`).
   * Reads the first selected file (or `null`); setting replaces the selection.
   */
  @property({ attribute: false })
  get value(): File | null {
    return this._selectedFiles[0]?.file ?? null;
  }

  set value(file: File | null) {
    this.files = file ? [file] : [];
  }

  /**
   * Programmatically set the selection and await async validation/processing.
   * Same as assigning `files`, but resolves once every file has finished its
   * magic-byte validation and read — use when you need to read `checkValidity()`
   * or the settled selection immediately after.
   */
  public async setFiles(incoming: File[]): Promise<void> {
    this._selectedFiles = [];
    const input = this.renderRoot?.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement | null;
    if (input) input.value = "";

    for (const file of incoming ?? []) {
      await this._saveSelectedFiles(file);
    }

    // Covers the empty/clear case; per-file syncing already happened above.
    this._setValue();
    this._validate();

    this.requestUpdate();
  }

  private _dragActive = false;
  private get _isDropDisabled(): boolean {
    return this.disabled || (!this.multiple && this._selectedFiles.length > 0);
  }

  private get _buttonAriaLabel(): string {
    if (this._selectedFiles.length === 0) {
      return this.multiple ? "Choose files: " : "Choose file: ";
    }

    return this.multiple ? "Change files: " : "Change file: ";
  }

  private get _buttonAriaDescription(): string {
    if (this._selectedFiles.length === 0)
      return `${this.label + " " + this.description}`;

    const hasInvalidFiles = this._selectedFiles.some(
      (file) => file.status === "error",
    );

    let base = "";

    if (this._selectedFiles.length === 1) {
      base = `You have selected ${this._selectedFiles[0].file.name}.`;
    } else {
      const fileNames = this._selectedFiles.map((f) => f.file.name).join(", ");
      base = `You have selected ${this._selectedFiles.length} files: ${fileNames}`;
    }

    const error = hasInvalidFiles
      ? " Error: One or more files are not valid file types."
      : "";

    return `${base}${error}`;
  }

  private get _innerNysButton(): HTMLElement | null {
    const nysButton = this.renderRoot.querySelector(
      '[name="file-btn"]',
    ) as HTMLButtonElement | null;
    const innerButton = nysButton?.shadowRoot?.querySelector(
      "button",
    ) as HTMLElement | null;
    return innerButton;
  }

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    // super.connectedCallback() (NysFormControlElement) assigns an id when one
    // is not provided and reflects default semantics.
    super.connectedCallback();
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

  updated() {
    void this._syncControlErrorAssociation();
  }

  /**
   * Point the exposed control at the rendered <nys-errormessage> and, in
   * dropzone mode, at the "or drag here" instructional text.
   *
   * The native <input type="file"> is `hidden`, `aria-hidden` and `tabindex="-1"`,
   * so it is not in the accessibility tree and must not carry these
   * associations. The element a user actually reaches is the <button> inside the
   * "Choose file" <nys-button>'s shadow root — that's also the keyboard path for
   * the dropzone (Enter/Space opens the native file picker via real button
   * semantics); the dropzone `<div>` itself is a non-interactive, pointer-only
   * drop target and never receives focus.
   *
   * The button and these targets sit in different shadow roots, so an IDREF
   * written on the button would dangle. ARIA element reflection does cross into a
   * shadow-including ancestor tree, so associateControlRefs sets the control's own
   * ariaDescribedByElements (plus an aria-description string fallback for engines
   * that expose the IDL but do not yet honor it). aria-describedby — not
   * aria-errormessage — is what Blink actually surfaces for a control inside a
   * shadow root; see src/scripts/verify-a11y-names.mjs. aria-errormessage is set
   * through its element-reflection form where the engine supports it.
   */
  private async _syncControlErrorAssociation() {
    const nysButton = this.renderRoot?.querySelector('[name="file-btn"]') as
      | (HTMLElement & { updateComplete?: Promise<unknown> })
      | null;
    if (!nysButton) return;

    // The trigger lives in <nys-button>'s shadow root, which only exists once
    // that element has been defined and has completed its first render.
    if (!customElements.get("nys-button")) {
      await customElements.whenDefined("nys-button");
    }
    await nysButton.updateComplete;

    const control = this._innerNysButton;
    if (!control) return;

    const errorEl = this.showError
      ? (this.renderRoot?.querySelector(
          "nys-errormessage",
        ) as HTMLElement | null)
      : null;

    // Only present in dropzone mode, and only while the drag-active state
    // (which swaps the button + hint for a "Drop file to upload" message) isn't
    // showing.
    const hintEl =
      this.dropzone && !this._dragActive
        ? (this.renderRoot?.querySelector(
            ".nys-fileinput__dropzone-hint",
          ) as HTMLElement | null)
        : null;

    control.setAttribute("aria-invalid", errorEl ? "true" : "false");
    associateControlRefs(control, "describedby", [hintEl, errorEl]);

    // <nys-errormessage> keeps its text in its own shadow root, so the helper's
    // textContent-derived fallback comes back empty for that piece — the hint
    // <p> is plain text, so its portion is already correct. Rebuild the full
    // fallback string here so neither part clobbers the other. aria-describedby
    // wins wherever the element reference is honored.
    const message = this.internals?.validationMessage || this.errorMessage;
    const descriptionParts = [
      hintEl?.textContent?.trim() || undefined,
      errorEl && message ? message : undefined,
    ].filter((part): part is string => !!part);

    if (descriptionParts.length) {
      control.setAttribute("aria-description", descriptionParts.join(" "));
    } else {
      control.removeAttribute("aria-description");
    }

    const rec = control as unknown as Record<string, unknown>;
    if ("ariaErrorMessageElements" in control) {
      rec.ariaErrorMessageElements = errorEl ? [errorEl] : null;
    }
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  private _setValue() {
    // for multiple file uploads, we upload File object as an array
    if (this.multiple) {
      const files = this._selectedFiles.map((entry) => entry.file);

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append(this.name, file);
        });
        this.setFormValue(formData);
      } else {
        this.setFormValue(null);
      }
    } else {
      const singleFile = this._selectedFiles[0]?.file || null;
      this.setFormValue(singleFile);
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
      this.setValidityFromState({ valueMissing: true }, message, input);
    } else {
      this.clearValidity();
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

    if (message) {
      this.setValidityFromState({ customError: true }, message, input);
    } else {
      this.clearValidity();
    }
  }

  private _validate() {
    const hasErrorFiles = this._selectedFiles.some(
      (entry) => entry.status === "error",
    );
    const isEmpty = this.required && this._selectedFiles.length === 0;

    let message = "";
    if (isEmpty) {
      message = this.errorMessage || "Please upload a file.";
    } else if (hasErrorFiles) {
      message = "One or more files are invalid.";
    }

    this._setValidityMessage(message);
  }

  // This helper function is called to perform the element's native validation.
  checkValidity(): boolean {
    const input = this.shadowRoot?.querySelector("input");
    return input ? input.checkValidity() : true;
  }

  // Called automatically when the parent form is reset
  public formResetCallback() {
    this._selectedFiles = [];
    const input = this.shadowRoot?.querySelector(
      ".hidden-file-input",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }

    this.setFormValue(null);

    // Reset validation UI
    this.showError = false;
    this.errorMessage = "";
    this.clearValidity();

    // Re-render UI
    this.requestUpdate();
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._validate();

    const innerButton = this._innerNysButton;
    if (innerButton) {
      // Focus only if this is the first invalid element (top-down approach)
      const form = this.internals?.form;
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
          innerButton.focus();
          innerButton.classList.add("active-focus"); // This class styling is found within <nys-button>
        }
      } else {
        // If not part of a form, simply focus.
        innerButton.focus();
        innerButton.classList.add("active-focus"); // This class styling is found within <nys-button>
      }
    }
  }

  /**
   * Functions
   * --------------------------------------------------------------------------
   */

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

    return entry;
  }

  // Read the contents of stored files, this will indicate loading progress of the uploaded files
  private async _processFile(entry: FileWithProgress) {
    entry.status = "processing";

    try {
      const isValid = await validateFileHeader(entry.file, this.accept);
      if (!isValid) {
        entry.status = "error";
        entry.errorMsg = "File type is invalid.";
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

  // Fire nys-blur only when focus leaves the whole component, not when it
  // moves between internal controls (the button, remove buttons, etc.).
  // Uses focusout (bubbles) since blur does not.
  private _handleBlur(e: FocusEvent) {
    const next = e.relatedTarget as Node | null;
    if (next && this.renderRoot.contains(next)) return;
    this._validate();
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true }),
    );
  }

  private _dispatchChangeEvent(changedFiles: FileWithProgress[]) {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: this.id,
          files: this._selectedFiles,
          changedFiles,
        },
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

  private _handlePostFileSelectionFocus() {
    if (this.multiple) {
      const innerButton = this._innerNysButton;

      if (innerButton) {
        innerButton.focus();
      }
    } else {
      this._focusFirstFileItemIfSingleMode();
    }
  }

  private async _focusFirstFileItemIfSingleMode() {
    if (!this.multiple) {
      await this.updateComplete;
      const fileItem = this.renderRoot.querySelector(
        "nys-fileitem",
      ) as HTMLElement;

      const innerFileItemMainContainer = fileItem?.shadowRoot?.querySelector(
        ".file-item",
      ) as HTMLElement | null;

      if (innerFileItemMainContainer) {
        innerFileItemMainContainer.setAttribute("tabindex", "-1");
        innerFileItemMainContainer.focus();
      }
    }
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */

  // Access the selected files & add new files to the internal list via the hidden <input type="file">
  private async _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    const newFiles = files ? Array.from(files) : []; // changes FileList to array

    // Store the uploaded files
    const changedFiles = await this._addFiles(newFiles);

    this.requestUpdate();
    if (changedFiles.length) this._dispatchChangeEvent(changedFiles);
    this._handlePostFileSelectionFocus();
  }

  private _handleFileRemove(e: CustomEvent) {
    const fileNameToRemove = e.detail.filename;

    const removed = this._selectedFiles.find(
      (existingFile) => existingFile.file.name === fileNameToRemove,
    );

    // Remove selected files
    this._selectedFiles = this._selectedFiles.filter(
      (existingFile) => existingFile.file.name !== fileNameToRemove,
    );

    if (this._selectedFiles.length === 0) {
      const input = this.shadowRoot?.querySelector(
        "input",
      ) as HTMLInputElement | null;
      if (input) input.value = "";
    }

    this._setValue();
    this._validate();

    this.requestUpdate();
    if (removed) this._dispatchChangeEvent([removed]);
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

  private async _onDrop(e: DragEvent) {
    if (this.disabled) return;

    e.preventDefault();
    this._dragActive = false; // For styling purpose
    this.requestUpdate();

    const files = e.dataTransfer?.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const filesToAdd = this.multiple ? newFiles : [newFiles[0]];

    const changedFiles = await this._addFiles(filesToAdd);

    this.requestUpdate();
    if (changedFiles.length) this._dispatchChangeEvent(changedFiles);
  }

  private async _addFiles(files: File[]): Promise<FileWithProgress[]> {
    const savedEntries = await Promise.all(
      files.map((file) => this._saveSelectedFiles(file)),
    );
    return savedEntries.filter(
      (entry): entry is FileWithProgress => entry !== undefined,
    );
  }

  render() {
    return html`<div
      class="nys-fileinput"
      @nys-fileRemove=${this._handleFileRemove}
      @focusout=${this._handleBlur}
    >
      <nys-label
        id="${this.id}--label"
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
        tooltip=${this.tooltip}
        ?inverted=${this.inverted}
        @nys-label-click=${this._openFileDialog}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>

      <input
        id=${this.id + "--native"}
        class="hidden-file-input"
        tabindex="-1"
        type="file"
        name=${this.name}
        accept=${this.accept}
        form=${ifDefined(this.form || undefined)}
        ?multiple=${this.multiple}
        ?required=${this.required}
        ?disabled=${this.disabled ||
        (!this.multiple && this._selectedFiles.length > 0)}
        aria-labelledby=${ifDefined(
          this.label ? this.id + "--label" : undefined,
        )}
        aria-label=${ifDefined(
          !this.label && this.ariaLabel ? this.ariaLabel : undefined,
        )}
        aria-disabled="${this.disabled}"
        aria-hidden="true"
        @change=${this._handleFileChange}
        hidden
      />

      ${!this.dropzone
        ? html`<nys-button
            id="choose-files-btn"
            name="file-btn"
            label=${this.multiple ? "Choose files" : "Choose file"}
            variant="outline"
            ?disabled=${this.disabled ||
            (!this.multiple && this._selectedFiles.length > 0)}
            @nys-click=${this._openFileDialog}
          ></nys-button>`
        : html`<div
            class="nys-fileinput__dropzone
            ${this._dragActive ? "drag-active" : ""}
            ${this._isDropDisabled ? "disabled" : ""}
            ${this.showError && !this._isDropDisabled ? "error" : ""}"
            @click=${this._isDropDisabled
              ? null
              : (e: MouseEvent) => {
                  const target = e.target as HTMLElement;

                  // Ignore clicks that originated within a nys-button
                  if (target.closest("nys-button")) return;

                  // Only handle direct wrapper clicks (outside of buttons). This
                  // is a pointer-only convenience — the div carries no role or
                  // tabindex, so it is never part of the keyboard path. Keyboard
                  // users activate the real <nys-button> below (Enter/Space),
                  // which opens the native file picker the same as a click here.
                  this._openFileDialog();
                }}
            @dragover=${this._isDropDisabled ? null : this._onDragOver}
            @dragleave=${this._isDropDisabled ? null : this._onDragLeave}
            @drop=${this._isDropDisabled ? null : this._onDrop}
          >
            ${this._dragActive
              ? html`<p>Drop file to upload</p>`
              : html` <nys-button
                    id="choose-files-btn-drag"
                    name="file-btn"
                    label=${this.multiple ? "Choose files" : "Choose file"}
                    variant="outline"
                    ?disabled=${this._isDropDisabled}
                    @nys-click="${(e: CustomEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this._openFileDialog();
                    }}"
                  ></nys-button>
                  <p
                    id="${this.id}--dropzone-hint"
                    class="nys-fileinput__dropzone-hint"
                  >
                    or drag here
                  </p>`}
          </div>`}
      ${this.showError
        ? html`
            <nys-errormessage
              id=${this.id + "--error"}
              ?showError=${this.showError}
              errorMessage=${this.internals?.validationMessage ||
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
                    <nys-fileitem
                      filename=${entry.file.name}
                      status=${entry.status}
                      progress=${entry.progress}
                      errorMessage=${entry.errorMsg || ""}
                    ></nys-fileitem>
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
