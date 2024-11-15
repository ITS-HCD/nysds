import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import styles from "./nys-alert.styles";

@customElement("nys-alert")
export class NysAlert extends LitElement {
  @property({ type: String }) title = "Title";
  @property({ type: String }) description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.";

  static styles = styles;

  private static readonly VALID_TYPES = [
    'info',
    'warning',
    'success',
    'error',
    'emergency',
  ] as const;

  private _type: (typeof NysAlert.VALID_TYPES)[number] = 'info'

  @property({reflect: true})
  get type() {
    return this._type;
  }

  set type(value: string) {
    this._type = (NysAlert.VALID_TYPES).includes(
      value as (typeof NysAlert.VALID_TYPES)[number])
      ? value as (typeof NysAlert.VALID_TYPES)[number]
    : "info";
  }
  
  render() {
    return html`
      <div class="nys-alert-container">
        <h1>${this.type}</h1>
        <h1>${this.title}</h1>
        <p>${this.description}</p>
      </div>
    `;
  }
}
