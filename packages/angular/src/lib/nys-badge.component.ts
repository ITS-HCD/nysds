import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-badge";

@Component({
  selector: "nys-badge",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysBadgeComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() size: any;
  @Input() intent: any;
  @Input() prefixLabel: any;
  @Input() label: any;
  @Input() srText: any;
  @Input() variant: any;
  @Input() prefixIcon: any;
  @Input() suffixIcon: any;
}
