import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-verticalnav";

@Component({
  selector: "nys-verticalnavgroup",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysVerticalnavGroupComponent {
  @Input() id: any;
  @Input() label: any;
  @Input() expanded: any;
  @Input() disabled: any;
  @Input() active: any;

  @Output() "nys-child-resize" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-verticalnavgroup-toggle" = new EventEmitter<
    CustomEvent<any>
  >();
}
