import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-alert";

@Component({
  selector: "nys-alert",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[heading]": "heading",
    "[icon]": "icon",
    "[dismissible]": "dismissible",
    "[duration]": "duration",
    "[text]": "text",
    "[primaryAction]": "primaryAction",
    "[secondaryAction]": "secondaryAction",
    "[primaryLabel]": "primaryLabel",
    "[secondaryLabel]": "secondaryLabel",
    "[type]": "type",
    "[ariaAttributes]": "ariaAttributes",
  },
})
export class NysAlertComponent {
  @Input() id: any;
  @Input() heading: any;
  @Input() icon: any;
  @Input() dismissible: any;
  @Input() duration: any;
  @Input() text: any;
  @Input() primaryAction: any;
  @Input() secondaryAction: any;
  @Input() primaryLabel: any;
  @Input() secondaryLabel: any;
  @Input() type: any;
  @Input() ariaAttributes: any;

  @Output() "nys-close" = new EventEmitter<CustomEvent<any>>();
}
