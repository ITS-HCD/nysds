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
import "@nysds/nys-datepicker";

@Component({
  selector: "nys-datepicker",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysDatepickerComponent),
      multi: true,
    },
  ],
})
export class NysDatepickerComponent implements ControlValueAccessor {
  @Input() id: any;
  @Input() name: any;
  @Input() width: any;
  @Input() hideTodayButton: any;
  @Input() hideClearButton: any;
  @Input() disabled: any;
  @Input() required: any;
  @Input() optional: any;
  @Input() showError: any;
  @Input() errorMessage: any;
  @Input() form: any;
  @Input() tooltip: any;
  @Input() type: any;
  @Input() label: any;
  @Input() description: any;
  @Input() startDate: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() inverted: any;
  @Input() value: any;

  @Output() "nys-input" = new EventEmitter<CustomEvent<any>>();
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
