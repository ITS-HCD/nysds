import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-fileinput";

@Component({
  selector: "nys-fileitem",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysFileItemComponent {
  @Input() filename: any;
  @Input() status: any;
  @Input() progress: any;
  @Input() errorMessage: any;

  @Output() "nys-fileRemove" = new EventEmitter<CustomEvent<any>>();
}
