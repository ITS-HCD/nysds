import { Component, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

/**
 * `ControlValueAccessor` for `<nys-datepicker>` — emits `nys-input` with the
 * selected date in the detail. Value type is intentionally loose because the
 * underlying component accepts `Date | string | undefined`.
 */
@Component({
  selector: 'nys-datepicker',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysDatepickerComponent),
      multi: true,
    },
  ],
})
export class NysDatepickerComponent extends NysControlValueAccessorBase<
  Date | string | undefined
> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
