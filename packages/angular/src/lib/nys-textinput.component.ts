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
import "@nysds/nys-textinput";

@Component({
  selector: "nys-textinput",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[type]": "type",
    "[label]": "label",
    "[description]": "description",
    "[placeholder]": "placeholder",
    "[value]": "value",
    "[disabled]": "disabled",
    "[readonly]": "readonly",
    "[required]": "required",
    "[optional]": "optional",
    "[tooltip]": "tooltip",
    "[form]": "form",
    "[pattern]": "pattern",
    "[maxlength]": "maxlength",
    "[ariaLabel]": "ariaLabel",
    "[width]": "width",
    "[step]": "step",
    "[min]": "min",
    "[max]": "max",
    "[inverted]": "inverted",
    "[showError]": "showError",
    "[errorMessage]": "errorMessage",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextinputComponent),
      multi: true,
    },
  ],
})
export class NysTextinputComponent implements ControlValueAccessor {
  @Input() id: any;
  @Input() name: any;
  @Input() type: any;
  @Input() label: any;
  @Input() description: any;
  @Input() placeholder: any;
  @Input() value: any;
  @Input() disabled: any;
  @Input() readonly: any;
  @Input() required: any;
  @Input() optional: any;
  @Input() tooltip: any;
  @Input() form: any;
  @Input() pattern: any;
  @Input() maxlength: any;
  @Input() ariaLabel: any;
  @Input() width: any;
  @Input() step: any;
  @Input() min: any;
  @Input() max: any;
  @Input() inverted: any;
  @Input() showError: any;
  @Input() errorMessage: any;

  @Output() "nys-input" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();

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
