import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-tooltip";

@Component({
  selector: "nys-tooltip",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysTooltipComponent {
  @Input() id: any;
  @Input() text: any;
  @Input() inverted: any;
  @Input() for: any;
  @Input() position: any;
}
