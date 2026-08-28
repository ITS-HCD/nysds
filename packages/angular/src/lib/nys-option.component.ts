import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-select";

@Component({
  selector: "nys-option",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysOptionComponent {
  @Input() disabled: any;
  @Input() selected: any;
  @Input() value: any;
  @Input() label: any;
  @Input() hidden: any;
}
