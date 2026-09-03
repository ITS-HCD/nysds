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
import "@nysds/nys-toggle";

@Component({
  selector: "nys-toggle",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[name]": "name",
    "[value]": "value",
    "[label]": "label",
    "[description]": "description",
    "[form]": "form",
    "[checked]": "checked",
    "[disabled]": "disabled",
    "[noIcon]": "noIcon",
    "[inverted]": "inverted",
    "[size]": "size",
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysToggleComponent),
      multi: true,
    },
  ],
})
export class NysToggleComponent implements ControlValueAccessor {
  @Input() id: any;
  @Input() name: any;
  @Input() value: any;
  @Input() label: any;
  @Input() description: any;
  @Input() form: any;
  @Input() checked: any;
  @Input() disabled: any;
  @Input() noIcon: any;
  @Input() inverted: any;
  @Input() size: any;

  @Output() "nys-change" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-focus" = new EventEmitter<CustomEvent<any>>();
  @Output() "nys-blur" = new EventEmitter<CustomEvent<any>>();

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
