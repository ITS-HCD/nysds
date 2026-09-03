import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-iconlist";

@Component({
  selector: "nys-iconlist",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[divider]": "divider",
  },
})
export class NysIconlistComponent {
  @Input() id: any;
  @Input() divider: any;
}
