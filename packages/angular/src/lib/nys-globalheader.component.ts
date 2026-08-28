import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-globalheader";

@Component({
  selector: "nys-globalheader",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysGlobalHeaderComponent {
  @Input() id: any;
  @Input() appName: any;
  @Input() agencyName: any;
  @Input() homepageLink: any;
  @Input() nysLogo: any;
  @Input() landmarkLabel: any;
}
