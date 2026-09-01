import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-processlist";

@Component({
  selector: "nys-processlist",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[strong]": "strong",
    "[neutral]": "neutral",
    "[size]": "size",
    "[initialStep]": "initialStep",
  },
})
export class NysProcesslistComponent {
  @Input() id: any;
  @Input() strong: any;
  @Input() neutral: any;
  @Input() size: any;
  @Input() initialStep: any;
}
