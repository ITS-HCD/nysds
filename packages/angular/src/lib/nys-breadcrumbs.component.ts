import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-breadcrumbs";

@Component({
  selector: "nys-breadcrumbs",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[ariaLabel]": "ariaLabel",
    "[size]": "size",
    "[backToParent]": "backToParent",
    "[collapsed]": "collapsed",
    "[backgroundBar]": "backgroundBar",
    "[disabled]": "disabled",
  },
})
export class NysBreadcrumbsComponent {
  @Input() id: any;
  @Input() ariaLabel: any;
  @Input() size: any;
  @Input() backToParent: any;
  @Input() collapsed: any;
  @Input() backgroundBar: any;
  @Input() disabled: any;

  @Output() "nys-expand" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-breadcrumbs-expand" = new EventEmitter<CustomEvent<any>>();
}
