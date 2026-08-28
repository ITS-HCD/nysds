import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-backtotop";

@Component({
  selector: "nys-backtotop",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysBacktotopComponent {
  @Input() id: any;
  @Input() position: any;
  @Input() visible: any;
}
