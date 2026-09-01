import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-card";

@Component({
  selector: "nys-card",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[preheading]": "preheading",
    "[heading]": "heading",
    "[headingLevel]": "headingLevel",
    "[subheading]": "subheading",
    "[description]": "description",
    "[inset]": "inset",
    "[elevated]": "elevated",
    "[href]": "href",
    "[target]": "target",
    "[onClick]": "onClick",
  },
})
export class NysCardComponent {
  @Input() id: any;
  @Input() preheading: any;
  @Input() heading: any;
  @Input() headingLevel: any;
  @Input() subheading: any;
  @Input() description: any;
  @Input() inset: any;
  @Input() elevated: any;
  @Input() href: any;
  @Input() target: any;
  @Input() onClick: any;

  @Output() "nys-click" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();
}
