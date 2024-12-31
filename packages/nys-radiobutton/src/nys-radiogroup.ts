import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
// import { FormControlController } from "@nys-excelsior/form-controller";

@customElement("nys-radiogroup")
export class NysRadiogroup extends LitElement {
  // private formControlController = new FormControlController(this);

  @property() label = "lol";

  /** The radio groups's help text. If you need to display HTML, use the `help-text` slot instead. */
  @property({ attribute: "help-text" }) helpText = "a";

  /** The name of the radio group, submitted as a name/value pair with form data. */
  @property() name = "option";

  /** The current value of the radio group, submitted as a name/value pair with form data. */
  @property({ reflect: true }) value = "ahhhh";

  render() {
    return html` <div role="radiogroup">
      <slot></slot>
    </div>`;
  }
}
