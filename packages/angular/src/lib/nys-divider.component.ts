import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-divider";

@Component({
  selector: "nys-divider",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[inverted]": "inverted",
    "[subtle]": "subtle",
    "[defaultRole]": "defaultRole",
  },
})
export class NysDividerComponent {
  @Input() inverted: any;
  @Input() subtle: any;
  @Input() defaultRole: any;
}
