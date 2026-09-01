import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-badge";

@Component({
  selector: "nys-badge",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[size]": "size",
    "[intent]": "intent",
    "[prefixLabel]": "prefixLabel",
    "[label]": "label",
    "[srText]": "srText",
    "[variant]": "variant",
    "[prefixIcon]": "prefixIcon",
    "[suffixIcon]": "suffixIcon",
  },
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
