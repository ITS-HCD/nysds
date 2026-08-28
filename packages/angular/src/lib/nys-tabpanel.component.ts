import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-tab";

@Component({
  selector: "nys-tabpanel",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysTabpanelComponent {
  @Input() id: any;
}
