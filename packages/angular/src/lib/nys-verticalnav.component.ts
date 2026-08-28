import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-verticalnav";

@Component({
  selector: "nys-verticalnav",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysVerticalnavComponent {
  @Input() id: any;
  @Input() heading: any;
  @Input() hideHeading: any;
  @Input() headingLevel: any;
  @Input() expanded: any;
}
