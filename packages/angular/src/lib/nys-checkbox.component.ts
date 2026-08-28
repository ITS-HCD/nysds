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
import "@nysds/nys-checkbox";

@Component({
  selector: "nys-checkbox",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysCheckboxComponent),
      multi: true,
    },
  ],
})
export class NysCheckboxComponent implements ControlValueAccessor {
  @Input() checked: any;
  @Input() disabled: any;
  @Input() required: any;
  @Input() label: any;
  @Input() description: any;
  @Input() id: any;
  @Input() name: any;
  @Input() value: any;
  @Input() form: any;
  @Input() showError: any;
  @Input() errorMessage: any;
  @Input() groupExist: any;
  @Input() tile: any;
  @Input() tooltip: any;
  @Input() size: any;
  @Input() other: any;
  @Input() showOtherError: any;
  @Input() labelledby: any;
  @Input() hideLabel: any;
  @Input() _hasDescription: any;
  @Input() _isStandalone: any;

  @Output() "nys-change" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-other-input" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-error" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-error-clear" = new EventEmitter<CustomEvent<any>>();

  constructor(private elementRef: ElementRef) {}

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.checked = value;
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
    const val = event.target.checked;
    this.onChange(val);
    this.onTouched();
  }
}
