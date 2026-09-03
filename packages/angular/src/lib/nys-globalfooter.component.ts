import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-globalfooter";

@Component({
  selector: "nys-globalfooter",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[agencyName]": "agencyName",
    "[agencySubheading]": "agencySubheading",
    "[homepageLink]": "homepageLink",
    "[landmarkLabel]": "landmarkLabel",
  },
})
export class NysGlobalFooterComponent {
  @Input() id: any;
  @Input() agencyName: any;
  @Input() agencySubheading: any;
  @Input() homepageLink: any;
  @Input() landmarkLabel: any;
}
