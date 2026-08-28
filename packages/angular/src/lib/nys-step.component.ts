import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-stepper";

@Component({
  selector: "nys-step",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysStepComponent {
  @Input() selected: any;
  @Input() current: any;
  @Input() label: any;
  @Input() href: any;
  @Input() onClick: any;

  @Output() "nys-step-click" = new EventEmitter<CustomEvent<any>>();
}
