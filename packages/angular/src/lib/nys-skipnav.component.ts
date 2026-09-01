import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-skipnav";

@Component({
  selector: "nys-skipnav",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[href]": "href",
  },
})
export class NysSkipnavComponent {
  @Input() id: any;
  @Input() href: any;
}
