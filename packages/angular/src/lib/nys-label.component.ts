import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-label";

@Component({
  selector: "nys-label",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[label]": "label",
    "[description]": "description",
    "[flag]": "flag",
    "[inverted]": "inverted",
    "[tooltip]": "tooltip",
    "[_hasDescription]": "_hasDescription",
  },
})
export class NysLabelComponent {
  @Input() id: any;
  @Input() label: any;
  @Input() description: any;
  @Input() flag: any;
  @Input() inverted: any;
  @Input() tooltip: any;
  @Input() _hasDescription: any;

  @Output() "nys-label-click" = new EventEmitter<CustomEvent<any>>();
}
