import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-iconlist";

@Component({
  selector: "nys-iconlistitem",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysIconlistitemComponent {
  @Input() icon: any;
  @Input() divider: any;
}
