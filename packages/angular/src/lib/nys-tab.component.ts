import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-tab";

@Component({
  selector: "nys-tab",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysTabComponent {
  @Input() id: any;
  @Input() label: any;
  @Input() selected: any;
  @Input() disabled: any;

  @Output() "nys-tab-select" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-tab-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-tab-blur" = new EventEmitter<CustomEvent<any>>();
}
