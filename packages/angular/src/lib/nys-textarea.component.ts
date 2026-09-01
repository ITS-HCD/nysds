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
import "@nysds/nys-textarea";

@Component({
  selector: "nys-textarea",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[label]": "label",
    "[description]": "description",
    "[placeholder]": "placeholder",
    "[value]": "value",
    "[disabled]": "disabled",
    "[readonly]": "readonly",
    "[required]": "required",
    "[optional]": "optional",
    "[tooltip]": "tooltip",
    "[inverted]": "inverted",
    "[form]": "form",
    "[maxlength]": "maxlength",
    "[width]": "width",
    "[rows]": "rows",
    "[resize]": "resize",
    "[showError]": "showError",
    "[errorMessage]": "errorMessage",
    "[ariaLabel]": "ariaLabel",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextareaComponent),
      multi: true,
    },
  ],
})
export class NysTextareaComponent implements ControlValueAccessor {
  @Input() id: any;
  @Input() name: any;
  @Input() label: any;
  @Input() description: any;
  @Input() placeholder: any;
  @Input() value: any;
  @Input() disabled: any;
  @Input() readonly: any;
  @Input() required: any;
  @Input() optional: any;
  @Input() tooltip: any;
  @Input() inverted: any;
  @Input() form: any;
  @Input() maxlength: any;
  @Input() width: any;
  @Input() rows: any;
  @Input() resize: any;
  @Input() showError: any;
  @Input() errorMessage: any;
  @Input() ariaLabel: any;

  @Output() "nys-input" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-select" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-selectionchange" = new EventEmitter<CustomEvent<any>>();

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
