import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-alert.styles";
import "@excelsior/nys-icon"; // references: "/packages/nys-icon/dist/nys-icon.es.js";

@customElement("nys-alert")
export class NysAlert extends LitElement {
  static styles = styles;

  @property({ type: String }) title = "Title";
  @property({ type: Boolean }) noIcon = false;
  @property({ type: String }) icon = "";
  @property({ type: Boolean }) isSlim = false;
  @property({ type: Boolean }) dismissible = false;
  @property({ type: Number }) duration = 0;
  @state() private _alertClosed = false;
  private static readonly VALID_TYPES = [
    "info",
    "warning",
    "success",
    "error",
    "emergency",
  ] as const;
  private _theme: (typeof NysAlert.VALID_TYPES)[number] = "info";

  @property({ reflect: true })
  get theme() {
    return this._theme;
  }

  set theme(value: string) {
    this._theme = NysAlert.VALID_TYPES.includes(
      value as (typeof NysAlert.VALID_TYPES)[number],
    )
      ? (value as (typeof NysAlert.VALID_TYPES)[number])
      : "info";
  }

  private _timeoutId: any = null;

  // For alerts that have durations, we set a timer to close them.
  connectedCallback() {
    super.connectedCallback();
    if (this.duration > 0) {
      this._timeoutId = setTimeout(() => {
        this.closeAlert();
      }, this.duration);
    }
  }
  disconnectedCallback() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    super.disconnectedCallback();
  }

  /******************** Functions ********************/
  // Helper function for overriding default icons
  private getIconName() {
    if (this.icon) {
      return this.icon;
    } else {
      return this.checkAltNaming(); // checking alternative svg naming
    }
  }

  private checkAltNaming() {
    // map 'success' to 'check-circle'
    return this.theme === "success" ? "check-circle" : this.theme;
  }

  closeAlert() {
    this._alertClosed = true;
  }

  render() {
    return html`
      ${!this._alertClosed
        ? html` <div class="nys-alert__container nys-alert--${this.theme}">
            <div
              class="nys-alert__icon ${this.isSlim ? "nys-alert--slim" : ""}"
            >
              ${this.noIcon
                ? ""
                : html`<nys-icon
                    name="${this.getIconName()}"
                    size="2xl"
                    label="${this.theme} icon"
                  ></nys-icon>`}
            </div>
            <div class="nys-alert__heading">
              ${this.isSlim
                ? ""
                : html`<h4 class="nys-alert__title">${this.title}</h4>`}
              <slot class="nys-alert__text"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</slot
              >
            </div>
            ${this.dismissible
              ? html`<div class="close-container">
                  <button class="close-button" @click=${this.closeAlert}>
                    <nys-icon
                      name="close"
                      size="lg"
                      label="close icon"
                    ></nys-icon>
                  </button>
                </div>`
              : ""}
          </div>`
        : ""}
    `;
  }
}
