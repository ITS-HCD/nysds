import { LitElement, html, unsafeCSS } from "lit";
import { property, state, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-combobox.scss?inline";

let comboboxIdCounter = 0;

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

/**
 * `<nys-combobox>` is a form-enabled combo box combining text input with a filterable dropdown.
 *
 * Features:
 * - Type to filter options
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Mouse and keyboard interaction
 * - Clears non-selected text on blur
 * - Clear button when value is selected
 * - Integrates with forms via ElementInternals
 * - Supports native <option> and <optgroup> elements
 * - Accessible per W3C ARIA Authoring Practices
 *
 * @slot description - Optional custom description content below the label.
 * @slot default - Options (<option>, <optgroup>) to populate the dropdown
 *
 * @fires nys-change - Fired when selection changes. Detail: `{ id, value }`.
 * @fires nys-input - Fired on input change. Detail: `{ id, value }`.
 * @fires nys-focus - Fired when combobox receives focus.
 * @fires nys-blur - Fired when combobox loses focus.
 */

export class NysCombobox extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: String }) tooltip = "";
  @property({ type: String, reflect: true }) form: string | null = null;
  @property({ type: String, reflect: true }) width: "md" | "lg" | "full" =
    "full";
  @property({ type: Boolean, reflect: true }) inverted = false;
  @property({ type: Boolean, reflect: true }) showError = false;
  @property({ type: String }) errorMessage = "";

  @state() private _isOpen = false;
  @state() private _filterText = "";
  @state() private _highlightedIndex = -1;
  @state() private _options: ComboboxOption[] = [];
  @state() private _filteredOptions: ComboboxOption[] = [];
  @state() private _dropdownAbove = false;

  @query("input") private _input!: HTMLInputElement;
  @query(".nys-combobox__listbox") private _listbox?: HTMLElement;

  private _originalErrorMessage = "";
  private _hasUserInteracted = false;
  private _internals: ElementInternals;
  private _selectedLabel = "";

  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.id) {
      this.id = `nys-combobox-${Date.now()}-${comboboxIdCounter++}`;
    }

    this._originalErrorMessage = this.errorMessage ?? "";
    this.addEventListener("invalid", this._handleInvalid);
    document.addEventListener("click", this._handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("invalid", this._handleInvalid);
    document.removeEventListener("click", this._handleDocumentClick);
  }

  firstUpdated() {
    this._handleSlotChange();
    this._setValue();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("value")) {
      const option = this._options.find((opt) => opt.value === this.value);
      this._selectedLabel = option ? option.label : "";
      this._filterText = this._selectedLabel;
    }

    if (changedProperties.has("_isOpen") && this._isOpen) {
      this._positionDropdown();
      this.updateComplete.then(() => {
        this._scrollToHighlighted();
      });
    }
  }

  /**
   * Slot handling
   * --------------------------------------------------------------------------
   */
  private _handleSlotChange() {
    const slot = this.shadowRoot?.querySelector(
      'slot:not([name="description"])',
    ) as HTMLSlotElement | null;

    if (!slot) return;

    const assignedElements = slot.assignedElements({ flatten: true });
    const options: ComboboxOption[] = [];

    assignedElements.forEach((node) => {
      if (node.tagName === "OPTION") {
        const option = node as HTMLOptionElement;
        options.push({
          value: option.value,
          label: option.textContent?.trim() || option.value,
          disabled: option.disabled,
        });
      } else if (node.tagName === "OPTGROUP") {
        const group = node as HTMLOptGroupElement;
        const groupLabel = group.label;

        Array.from(group.children).forEach((child) => {
          if (child.tagName === "OPTION") {
            const option = child as HTMLOptionElement;
            options.push({
              value: option.value,
              label: option.textContent?.trim() || option.value,
              disabled: option.disabled || group.disabled,
              group: groupLabel,
            });
          }
        });
      }
    });

    this._options = options;
    this._filteredOptions = options;

    // Set initial display text if value exists
    if (this.value) {
      const option = this._options.find((opt) => opt.value === this.value);
      if (option) {
        this._selectedLabel = option.label;
        this._filterText = option.label;
      }
    }
  }

  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  private _setValue() {
    this._internals.setFormValue(this.value);
    this._manageRequire();
  }

  private _manageRequire() {
    const message = this.errorMessage || "This field is required";
    const isInvalid =
      this.required && (!this.value || this.value?.trim() === "");

    if (isInvalid) {
      this._internals.ariaRequired = "true";
      this._internals.setValidity({ valueMissing: true }, message, this._input);
    } else {
      this._internals.ariaRequired = "false";
      this._internals.setValidity({});
      this._hasUserInteracted = false;
    }
  }

  private _setValidityMessage(message: string = "") {
    this.showError = !!message;

    if (this._originalErrorMessage?.trim() && message !== "") {
      this.errorMessage = this._originalErrorMessage;
    } else {
      this.errorMessage = message;
    }

    const validityState = message ? { customError: true } : {};
    this._internals.setValidity(validityState, this.errorMessage, this._input);
  }

  private _validate() {
    if (!this._input) return;

    const validity = this._input.validity;
    let message = "";

    if (validity.valueMissing) {
      message = "This field is required";
    } else {
      message = this._input.validationMessage;
    }

    this._setValidityMessage(message);
  }

  formResetCallback() {
    this.value = "";
    this._filterText = "";
    this._selectedLabel = "";
  }

  checkValidity(): boolean {
    return this._input ? this._input.checkValidity() : true;
  }

  private _handleInvalid(event: Event) {
    event.preventDefault();
    this._hasUserInteracted = true;
    this._validate();

    if (this._input) {
      const form = this._internals.form;
      if (form) {
        const elements = Array.from(form.elements) as Array<
          HTMLElement & { checkValidity?: () => boolean }
        >;
        const firstInvalidElement = elements.find(
          (element) =>
            typeof element.checkValidity === "function" &&
            !element.checkValidity(),
        );
        if (firstInvalidElement === this) {
          this._input.focus();
        }
      } else {
        this._input.focus();
      }
    }
  }

  /**
   * Dropdown positioning
   * --------------------------------------------------------------------------
   */
  private _positionDropdown() {
    if (!this._listbox || !this._input) return;

    const inputRect = this._input.getBoundingClientRect();
    const listboxHeight = this._listbox.offsetHeight;
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    // Show above if not enough space below and more space above
    this._dropdownAbove = spaceBelow < listboxHeight && spaceAbove > spaceBelow;
  }

  /**
   * Filtering
   * --------------------------------------------------------------------------
   */
  private _filterOptions(searchText: string) {
    if (!searchText) {
      this._filteredOptions = this._options;
      return;
    }

    const search = searchText.toLowerCase();
    this._filteredOptions = this._options.filter((option) =>
      option.label.toLowerCase().includes(search),
    );
  }

  /**
   * Keyboard navigation
   * --------------------------------------------------------------------------
   */
  private _scrollToHighlighted() {
    if (!this._listbox || this._highlightedIndex < 0) return;

    const highlighted = this._listbox.querySelector(
      `[data-index="${this._highlightedIndex}"]`,
    ) as HTMLElement;

    if (highlighted) {
      highlighted.scrollIntoView({ block: "nearest" });
    }
  }

  private _handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!this._isOpen) {
          this._openDropdown();
        } else {
          this._moveHighlight(1);
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (!this._isOpen) {
          this._openDropdown();
        } else {
          this._moveHighlight(-1);
        }
        break;

      case "Enter":
        event.preventDefault();
        if (this._isOpen && this._highlightedIndex >= 0) {
          this._selectOption(this._filteredOptions[this._highlightedIndex]);
        }
        break;

      case "Escape":
        event.preventDefault();
        this._closeDropdown();
        this._filterText = this._selectedLabel;
        break;

      case "Tab":
        if (this._isOpen) {
          this._closeDropdown();
          this._filterText = this._selectedLabel;
        }
        break;
    }
  }

  private _moveHighlight(direction: number) {
    const enabledOptions = this._filteredOptions.filter((opt) => !opt.disabled);
    if (enabledOptions.length === 0) return;

    let newIndex = this._highlightedIndex + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = this._filteredOptions.length - 1;
    } else if (newIndex >= this._filteredOptions.length) {
      newIndex = 0;
    }

    // Skip disabled options
    while (this._filteredOptions[newIndex]?.disabled) {
      newIndex += direction;
      if (newIndex < 0) newIndex = this._filteredOptions.length - 1;
      if (newIndex >= this._filteredOptions.length) newIndex = 0;
    }

    this._highlightedIndex = newIndex;
    this._scrollToHighlighted();
  }

  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this._filterText = input.value;
    this._filterOptions(this._filterText);

    if (!this._isOpen) {
      this._openDropdown();
    }

    this._highlightedIndex = 0;

    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this._filterText },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }

  private _handleBlur(event: FocusEvent) {
    // Check if focus moved to the listbox
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && this._listbox?.contains(relatedTarget)) {
      return;
    }

    // If no valid selection, clear the input
    if (!this.value || this._filterText !== this._selectedLabel) {
      this._filterText = this._selectedLabel;
      this._filterOptions("");
    }

    this._closeDropdown();

    if (!this._hasUserInteracted) {
      this._hasUserInteracted = true;
    }
    this._validate();

    this.dispatchEvent(new Event("nys-blur"));
  }

  private _handleDocumentClick = (event: MouseEvent) => {
    if (!this.shadowRoot?.contains(event.target as Node)) {
      this._closeDropdown();
    }
  };

  private _handleIconClick() {
    if (this.disabled) return;

    if (this._isOpen) {
      this._closeDropdown();
    } else {
      this._input.focus();
      this._openDropdown();
    }
  }

  private _handleClearClick(event: Event) {
    event.stopPropagation();
    this.value = "";
    this._filterText = "";
    this._selectedLabel = "";
    this._filterOptions("");
    this._internals.setFormValue("");
    this._closeDropdown();
    this._input.focus();

    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, value: "" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleLabelClick() {
    this._input.focus();
    this._openDropdown();
  }

  private _handleOptionClick(option: ComboboxOption) {
    if (option.disabled) return;
    this._selectOption(option);
  }

  private _handleOptionMouseEnter(index: number) {
    this._highlightedIndex = index;
  }

  private _selectOption(option: ComboboxOption) {
    this.value = option.value;
    this._selectedLabel = option.label;
    this._filterText = option.label;
    this._internals.setFormValue(this.value);
    this._closeDropdown();
    this._filterOptions("");

    if (this.required && this.value) {
      this.showError = false;
      this.errorMessage = "";
      this._internals.setValidity({});
    }

    if (this._hasUserInteracted) {
      this._validate();
    }

    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true,
      }),
    );

    this._input.focus();
  }

  private _openDropdown() {
    this._isOpen = true;
    this._highlightedIndex = this._filteredOptions.findIndex(
      (opt) => opt.value === this.value,
    );
    if (this._highlightedIndex < 0) this._highlightedIndex = 0;
  }

  private _closeDropdown() {
    this._isOpen = false;
    this._highlightedIndex = -1;
  }

  /**
   * Render helpers
   * --------------------------------------------------------------------------
   */
  private _renderOptions() {
    let currentGroup = "";
    const elements: any[] = [];

    this._filteredOptions.forEach((option, index) => {
      if (option.group && option.group !== currentGroup) {
        currentGroup = option.group;
        elements.push(html`
          <div class="nys-combobox__group-label" role="presentation">
            ${option.group}
          </div>
        `);
      }

      const isHighlighted = index === this._highlightedIndex;
      const isSelected = option.value === this.value;

      elements.push(html`
        <div
          class="nys-combobox__option ${isHighlighted
            ? "nys-combobox__option--highlighted"
            : ""} ${isSelected ? "nys-combobox__option--selected" : ""}"
          role="option"
          data-index="${index}"
          aria-selected="${isSelected}"
          aria-disabled="${option.disabled || false}"
          ?disabled=${option.disabled}
          @click=${() => this._handleOptionClick(option)}
          @mouseenter=${() => this._handleOptionMouseEnter(index)}
        >
          ${option.label}
        </div>
      `);
    });

    if (elements.length === 0) {
      return html`
        <div class="nys-combobox__no-results" role="option">
          No results found
        </div>
      `;
    }

    return elements;
  }

  render() {
    return html`
      <div class="nys-combobox">
        <nys-label
          for=${this.id + "--native"}
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
          @click=${this._handleLabelClick}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div
          class="nys-combobox__container ${this._isOpen
            ? "nys-combobox__container--open"
            : ""}"
        >
          <div class="nys-combobox__input-wrapper">
            <input
              class="nys-combobox__input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="${this._isOpen}"
              aria-controls="${this.id}--listbox"
              aria-activedescendant="${this._highlightedIndex >= 0
                ? `${this.id}--option-${this._highlightedIndex}`
                : ""}"
              name=${this.name}
              id=${this.id + "--native"}
              ?disabled=${this.disabled}
              ?required=${this.required}
              aria-required=${this.required}
              aria-disabled="${this.disabled}"
              aria-label="${[this.label, this.description]
                .filter(Boolean)
                .join(" ")}"
              .value=${this._filterText}
              placeholder=${ifDefined(
                this.placeholder ? this.placeholder : undefined,
              )}
              form=${ifDefined(this.form || undefined)}
              @input=${this._handleInput}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeyDown}"
              @click="${() => !this._isOpen && this._openDropdown()}"
            />
            ${this.value
              ? html`
                  <nys-button
                    class="nys-combobox__clear"
                    suffixIcon="slotted"
                    ariaLabel="clear selection"
                    variant="ghost"
                    size="sm"
                    circle
                    @nys-click=${this._handleClearClick}
                    ?disabled=${this.disabled}
                  >
                    <nys-icon
                      slot="suffix-icon"
                      size="2xl"
                      name="close"
                    ></nys-icon>
                  </nys-button>
                `
              : ""}
            <nys-button
              class="nys-combobox__toggle"
              suffixIcon="slotted"
              ariaLabel="toggle dropdown"
              variant="ghost"
              size="sm"
              circle
              @nys-click=${this._handleIconClick}
              ?disabled=${this.disabled}
            >
              <nys-icon
                slot="suffix-icon"
                size="2xl"
                name="expand_all"
              ></nys-icon>
            </nys-button>
          </div>
          ${this._isOpen
            ? html`
                <div
                  class="nys-combobox__listbox ${this._dropdownAbove
                    ? "nys-combobox__listbox--above"
                    : ""}"
                  id="${this.id}--listbox"
                  role="listbox"
                  tabindex="-1"
                >
                  ${this._renderOptions()}
                </div>
              `
            : ""}
        </div>
        <slot
          style="display: none;"
          @slotchange=${this._handleSlotChange}
        ></slot>
        <nys-errormessage
          ?showError=${this.showError}
          errorMessage=${this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
}

if (!customElements.get("nys-combobox")) {
  customElements.define("nys-combobox", NysCombobox);
}
