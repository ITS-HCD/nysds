import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-avatar";

@Component({
  selector: "nys-avatar",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[ariaLabel]": "ariaLabel",
    "[image]": "image",
    "[initials]": "initials",
    "[icon]": "icon",
    "[color]": "color",
    "[interactive]": "interactive",
    "[disabled]": "disabled",
    "[lazy]": "lazy",
  },
})
export class NysAvatarComponent {
  @Input() id: any;
  @Input() ariaLabel: any;
  @Input() image: any;
  @Input() initials: any;
  @Input() icon: any;
  @Input() color: any;
  @Input() interactive: any;
  @Input() disabled: any;
  @Input() lazy: any;
}
