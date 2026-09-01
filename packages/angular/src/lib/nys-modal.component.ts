import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-modal";

@Component({
  selector: "nys-modal",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[heading]": "heading",
    "[ariaLabel]": "ariaLabel",
    "[subheading]": "subheading",
    "[open]": "open",
    "[mandatory]": "mandatory",
    "[width]": "width",
  },
})
export class NysModalComponent {
  @Input() id: any;
  @Input() heading: any;
  @Input() ariaLabel: any;
  @Input() subheading: any;
  @Input() open: any;
  @Input() mandatory: any;
  @Input() width: any;

  @Output() "nys-open" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-close" = new EventEmitter<CustomEvent<any>>();
}
