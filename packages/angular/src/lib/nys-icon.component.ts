import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-icon";

@Component({
  selector: "nys-icon",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[name]": "name",
    "[library]": "library",
    "[ariaLabel]": "ariaLabel",
    "[rotate]": "rotate",
    "[flip]": "flip",
    "[color]": "color",
    "[size]": "size",
    "[updateComplete]": "updateComplete",
  },
})
export class NysIconComponent {
  @Input() name: any;
  @Input() library: any;
  @Input() ariaLabel: any;
  @Input() rotate: any;
  @Input() flip: any;
  @Input() color: any;
  @Input() size: any;
  @Input() updateComplete: any;
}
