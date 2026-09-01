import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-errormessage";

@Component({
  selector: "nys-errormessage",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[showError]": "showError",
    "[errorMessage]": "errorMessage",
    "[showDivider]": "showDivider",
  },
})
export class NysErrorMessageComponent {
  @Input() id: any;
  @Input() showError: any;
  @Input() errorMessage: any;
  @Input() showDivider: any;
}
