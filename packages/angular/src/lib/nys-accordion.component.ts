import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import "@nysds/nys-accordion";

@Component({
  selector: "nys-accordion",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysAccordionComponent {
  @Input() id: any;
  @Input() singleSelect: any;
  @Input() bordered: any;
  @Input() headingLevel: any;
}
