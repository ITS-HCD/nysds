import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-avatar";

@Component({
  selector: "nys-avatar",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
