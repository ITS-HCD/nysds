import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-unavfooter";

@Component({
  selector: "nys-unavfooter",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[landmarkLabel]": "landmarkLabel",
  },
})
export class NysUnavFooterComponent {
  @Input() landmarkLabel: any;
}
