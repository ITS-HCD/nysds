import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-dropdownmenu";

@Component({
  selector: "nys-dropdownmenu",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysDropdownMenuComponent {
  @Input() for: any;
  @Input() showDropdown: any;
  @Input() label: any;
  @Input() position: any;
}
