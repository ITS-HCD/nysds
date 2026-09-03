import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-dropdownmenu";

@Component({
  selector: "nys-dropdownmenuitem",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[label]": "label",
    "[href]": "href",
    "[disabled]": "disabled",
    "[target]": "target",
    "[prefixIcon]": "prefixIcon",
    "[divider]": "divider",
  },
})
export class NysDropdownMenuItemComponent {
  @Input() label: any;
  @Input() href: any;
  @Input() disabled: any;
  @Input() target: any;
  @Input() prefixIcon: any;
  @Input() divider: any;

  @Output() "nys-click" = new EventEmitter<CustomEvent<any>>();
}
