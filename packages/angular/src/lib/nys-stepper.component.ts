import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-stepper";

@Component({
  selector: "nys-stepper",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[label]": "label",
    "[counterText]": "counterText",
    "[isCompactExpanded]": "isCompactExpanded",
  },
})
export class NysStepperComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() label: any;
  @Input() counterText: any;
  @Input() isCompactExpanded: any;
}
