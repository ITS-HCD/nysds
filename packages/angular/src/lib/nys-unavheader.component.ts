import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-unavheader";

@Component({
  selector: "nys-unavheader",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NysUnavHeaderComponent {
  @Input() trustbarVisible: any;
  @Input() searchDropdownVisible: any;
  @Input() languageVisible: any;
  @Input() isSearchFocused: any;
  @Input() hideTranslate: any;
  @Input() hideSearch: any;
  @Input() searchUrl: any;
  @Input() landmarkLabel: any;
  @Input() languages: any;

  @Output() "nys-language-select" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-search-submit" = new EventEmitter<CustomEvent<any>>();
}
