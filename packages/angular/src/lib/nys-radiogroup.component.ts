import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-radiobutton";

@Component({
  selector: "nys-radiogroup",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[required]": "required",
    "[optional]": "optional",
    "[showError]": "showError",
    "[errorMessage]": "errorMessage",
    "[label]": "label",
    "[description]": "description",
    "[tile]": "tile",
    "[tooltip]": "tooltip",
    "[form]": "form",
    "[size]": "size",
    "[_showOtherError]": "_showOtherError",
    "[defaultRole]": "defaultRole",
  },
})
export class NysRadiogroupComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() required: any;
  @Input() optional: any;
  @Input() showError: any;
  @Input() errorMessage: any;
  @Input() label: any;
  @Input() description: any;
  @Input() tile: any;
  @Input() tooltip: any;
  @Input() form: any;
  @Input() size: any;
  @Input() _showOtherError: any;
  @Input() defaultRole: any;

  @Output() "nys-change" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-other-input" = new EventEmitter<CustomEvent<any>>();
}
