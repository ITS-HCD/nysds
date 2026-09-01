import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-button";

@Component({
  selector: "nys-button",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[size]": "size",
    "[fullWidth]": "fullWidth",
    "[variant]": "variant",
    "[inverted]": "inverted",
    "[label]": "label",
    "[ariaControls]": "ariaControls",
    "[ariaExpanded]": "ariaExpanded",
    "[ariaCurrent]": "ariaCurrent",
    "[prefixIcon]": "prefixIcon",
    "[suffixIcon]": "suffixIcon",
    "[circle]": "circle",
    "[icon]": "icon",
    "[disabled]": "disabled",
    "[form]": "form",
    "[value]": "value",
    "[ariaDescribedBy]": "ariaDescribedBy",
    "[type]": "type",
    "[onClick]": "onClick",
    "[href]": "href",
    "[target]": "target",
  },
})
export class NysButtonComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() size: any;
  @Input() fullWidth: any;
  @Input() variant: any;
  @Input() inverted: any;
  @Input() label: any;
  @Input() ariaControls: any;
  @Input() ariaExpanded: any;
  @Input() ariaCurrent: any;
  @Input() prefixIcon: any;
  @Input() suffixIcon: any;
  @Input() circle: any;
  @Input() icon: any;
  @Input() disabled: any;
  @Input() form: any;
  @Input() value: any;
  @Input() ariaDescribedBy: any;
  @Input() type: any;
  @Input() onClick: any;
  @Input() href: any;
  @Input() target: any;

  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-click" = new EventEmitter<CustomEvent<any>>();
}
