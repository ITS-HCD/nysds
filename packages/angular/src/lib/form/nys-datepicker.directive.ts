import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';


/**
 * `ControlValueAccessor` for `<nys-datepicker>` — emits `nys-input` with the
 * selected date in the detail. Value type is intentionally loose because the
 * underlying component accepts `Date | string | undefined`.
 */
@Directive({
  selector: 'nys-datepicker',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysDatepickerDirective),
      multi: true,
    },
  ],
})
export class NysDatepickerDirective extends NysControlValueAccessorBase<
  Date | string | undefined
> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
