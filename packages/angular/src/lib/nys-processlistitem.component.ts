import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-processlist";

@Component({
  selector: "nys-processlistitem",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysProcesslistitemComponent {
  @Input() label: any;
  @Input() description: any;
  @Input() _hasDescription: any;
}
