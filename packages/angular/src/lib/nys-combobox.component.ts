import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  HostListener,
  forwardRef,
  ElementRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import "@nysds/nys-combobox";

@Component({
  selector: "nys-combobox",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[label]": "label",
    "[description]": "description",
    "[value]": "value",
    "[disabled]": "disabled",
    "[required]": "required",
    "[optional]": "optional",
    "[tooltip]": "tooltip",
    "[form]": "form",
    "[width]": "width",
    "[inverted]": "inverted",
    "[showError]": "showError",
    "[errorMessage]": "errorMessage",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysComboboxComponent),
      multi: true,
    },
  ],
})
export class NysComboboxComponent implements ControlValueAccessor {
  @Input() id: any;
  @Input() name: any;
  @Input() label: any;
  @Input() description: any;
  @Input() value: any;
  @Input() disabled: any;
  @Input() required: any;
  @Input() optional: any;
  @Input() tooltip: any;
  @Input() form: any;
  @Input() width: any;
  @Input() inverted: any;
  @Input() showError: any;
  @Input() errorMessage: any;

  @Output() "nys-input" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-change" = new EventEmitter<CustomEvent<any>>();

  constructor(private elementRef: ElementRef) {}

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.disabled = isDisabled;
    }
  }

  @HostListener("nys-change", ["$event"])
  handleInputEvent(event: any): void {
    const val = event.target.value;
    this.onChange(val);
    this.onTouched();
  }
}
