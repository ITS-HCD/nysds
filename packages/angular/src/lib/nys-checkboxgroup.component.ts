import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-checkbox";

@Component({
  selector: "nys-checkboxgroup",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysCheckboxgroupComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() required: any;
  @Input() optional: any;
  @Input() showError: any;
  @Input() errorMessage: any;
  @Input() label: any;
  @Input() description: any;
  @Input() tile: any;
  @Input() tooltip: any;
  @Input() form: any;
  @Input() size: any;
}
