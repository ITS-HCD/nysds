import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-dropdownmenu";

@Component({
  selector: "nys-dropdownmenu",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[for]": "for",
    "[showDropdown]": "showDropdown",
    "[label]": "label",
    "[position]": "position",
  },
})
export class NysDropdownMenuComponent {
  @Input() for: any;
  @Input() showDropdown: any;
  @Input() label: any;
  @Input() position: any;
}
