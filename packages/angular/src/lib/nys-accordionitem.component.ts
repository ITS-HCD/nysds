import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-accordion";

@Component({
  selector: "nys-accordionitem",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysAccordionItemComponent {
  @Input() id: any;
  @Input() heading: any;
  @Input() headingLevel: any;
  @Input() expanded: any;
  @Input() bordered: any;

  @Output() "nys-accordionitem-toggle" = new EventEmitter<CustomEvent<any>>();
}
