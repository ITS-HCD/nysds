import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-toggle.styles";

@customElement("nys-toggle")
export class NysToggle extends LitElement {
  static styles = styles;

  /********************** Properties **********************/
  @property({ type: String }) id = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) required = true;
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";
  private static readonly VALID_SIZES = ["sm", "md", "lg"] as const;

  // Private property to store the internal `size` value, restricted to the valid types. Default is "md".
  private _size: (typeof NysToggle.VALID_SIZES)[number] = "md";

  // Getter and setter for the `size` property.
  @property({ reflect: true })
  get size(): (typeof NysToggle.VALID_SIZES)[number] {
    return this._size;
  }

  set size(value: string) {
    // Check if the provided value is in VALID_SIZES. If not, default to "md".
    this._size = NysToggle.VALID_SIZES.includes(
      value as (typeof NysToggle.VALID_SIZES)[number],
    )
      ? (value as (typeof NysToggle.VALID_SIZES)[number])
      : "md";
  }
  @property({ type: String }) value = "";
  @property({ type: String }) error = "";
  @property({ type: String }) form = "";

  
  /******************** Functions ********************/
    // Handle focus event
    private _handleFocus() {
      this.dispatchEvent(new Event("focus"));
    }
  
    // Handle blur event
    private _handleBlur() {
      this.dispatchEvent(new Event("blur"));
    }

    private _handleChange(e: Event) {
      const { checked } = e.target as HTMLInputElement;
      this.checked = checked;
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { checked: this.checked },
          bubbles: true,
          composed: true,
        }),
      );
    }

  private _handleKeyDown(event: KeyboardEvent) {
    if (!this.disabled && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();

      // Manually toggle the checked state
      this.checked = !this.checked;

      /* Dispatch a custom event for the toggle action:
       * allows bubbling up so if developers wish to use the toggle state info.
       */
      this.dispatchEvent(
        new CustomEvent("nys-toggleChange", {
          detail: { checked: this.checked },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return html`
      <div 
      class="nys-toggle--main-container" 
      role="switch" 
      aria-label=${ifDefined(this.label ? this.label : undefined)}
      >
        <label class="switch" .size=${this.size}>
          <input
            type="checkbox"
            name="${ifDefined(this.name ? this.name : undefined)}"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            @change=${this._handleChange}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @keydown=${this._handleKeyDown}
          />
          <span class="slider"></span>
        </label>
        <div class="texts-right-container">
          <slot name="label"></slot>
          <slot name="description-right"></slot>
        </div>
      </div>
      <slot name="description-bottom"></slot>
    `;
  }
}
