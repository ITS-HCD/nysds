import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-tab";

@Component({
  selector: "nys-tabgroup",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
  },
})
export class NysTabgroupComponent {
  @Input() id: any;
  @Input() name: any;
}
