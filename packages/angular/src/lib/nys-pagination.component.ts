import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-pagination";

@Component({
  selector: "nys-pagination",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[currentPage]": "currentPage",
    "[totalPages]": "totalPages",
    "[_twoBeforeLast]": "_twoBeforeLast",
  },
})
export class NysPaginationComponent {
  @Input() id: any;
  @Input() name: any;
  @Input() currentPage: any;
  @Input() totalPages: any;
  @Input() _twoBeforeLast: any;

  @Output() "nys-change" = new EventEmitter<CustomEvent<any>>();
}
