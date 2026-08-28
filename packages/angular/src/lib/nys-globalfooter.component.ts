import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-globalfooter";

@Component({
  selector: "nys-globalfooter",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysGlobalFooterComponent {
  @Input() id: any;
  @Input() agencyName: any;
  @Input() agencySubheading: any;
  @Input() homepageLink: any;
  @Input() landmarkLabel: any;
}
