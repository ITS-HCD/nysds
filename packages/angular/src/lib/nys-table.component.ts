import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-table";

@Component({
  selector: "nys-table",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysTableComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() striped: any;
  @Input() sortable: any;
  @Input() bordered: any;
  @Input() download: any;

  @Output() "nys-click" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-column-sort" = new EventEmitter<CustomEvent<any>>();
}
