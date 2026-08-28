import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-divider";

@Component({
  selector: "nys-divider",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysDividerComponent {
  @Input() inverted: any;
  @Input() subtle: any;
  @Input() defaultRole: any;
}
