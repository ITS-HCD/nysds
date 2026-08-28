import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-tab";

@Component({
  selector: "nys-tabgroup",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysTabgroupComponent {
  @Input() id: any;
  @Input() name: any;
}
