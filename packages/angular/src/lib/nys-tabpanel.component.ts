import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-tab";

@Component({
  selector: "nys-tabpanel",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
  },
})
export class NysTabpanelComponent {
  @Input() id: any;
}
