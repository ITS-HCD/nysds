import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// @ts-ignore: SCSS module imported via bundler as inline
import styles from "./nys-badge.scss?inline";

export class NysBadge extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) id = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String, reflect: true }) size: "sm" | "md" = "md";
  @property({ type: String, reflect: true }) intent:
    | "neutral"
    | "error"
    | "success"
    | "warning" = "neutral";
  @property({ type: String }) prefixLabel = "";
  @property({ type: String }) label = "";

  // Icons (string or boolean)
  private _prefixIcon: string | boolean = "";
  @property({ type: String, attribute: "prefixicon" })
  get prefixIcon(): string | boolean {
    return this._prefixIcon;
  }
  set prefixIcon(value: string | boolean) {
    if (value === "" || value === null) {
      // boolean attribute without value → true
      this._prefixIcon = true;
    } else if (value === "false" || value === false) {
      this._prefixIcon = "";
    } else {
      this._prefixIcon = value;
    }
  }

  private _suffixIcon: string | boolean = "";
  @property({ type: String, attribute: "suffixicon" })
  get suffixIcon(): string | boolean {
    return this._suffixIcon;
  }
  set suffixIcon(value: string | boolean) {
    if (value === "" || value === null) {
      this._suffixIcon = true;
    } else if (value === "false" || value === false) {
      this._suffixIcon = "";
    } else {
      this._suffixIcon = value;
    }
  }

  connectedCallback() {
    super.connectedCallback();

    const attr = this.getAttribute("prefixicon");
    if (attr !== null && this.prefixIcon === "") {
      this.prefixIcon = attr;
    }

    const suffixAttr = this.getAttribute("suffixicon");
    if (suffixAttr !== null && this.suffixIcon === "") {
      this.suffixIcon = suffixAttr;
    }
  }

  // Map of default icons by intent
  private static readonly DEFAULT_ICONS: Record<string, string> = {
    neutral: "info",
    error: "emergency_home",
    success: "check_circle",
    warning: "warning",
  };

  private resolveIcon(icon: string | boolean): string | null {
    if (icon === true) {
      return NysBadge.DEFAULT_ICONS[this.intent] ?? "info";
    }
    if (typeof icon === "string" && icon.trim() !== "") {
      return icon;
    }
    return null;
  }

  render() {
    const prefixIconName = this.resolveIcon(this.prefixIcon);
    const suffixIconName = this.resolveIcon(this.suffixIcon);

    return html`
      <div class="nys-badge">
        ${prefixIconName
          ? html`<nys-icon size="16" name=${prefixIconName}></nys-icon>`
          : ""}
        ${this.prefixLabel
          ? html`<div class="nys-badge__prefix">${this.prefixLabel}</div>`
          : ""}
        <div class="nys-badge__label">${this.label}</div>
        ${suffixIconName
          ? html`<nys-icon size="16" name=${suffixIconName}></nys-icon>`
          : ""}
      </div>
    `;
  }
}

if (!customElements.get("nys-badge")) {
  customElements.define("nys-badge", NysBadge);
}
