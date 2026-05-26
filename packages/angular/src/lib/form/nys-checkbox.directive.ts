import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';


/**
 * `ControlValueAccessor` for `<nys-checkbox>` — boolean value lives on the
 * `checked` property; `nys-change` detail carries `{id, checked, name, value}`.
 */
@Directive({
  selector: 'nys-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysCheckboxDirective),
      multi: true,
    },
  ],
})
export class NysCheckboxDirective extends NysControlValueAccessorBase<boolean> {
  protected readonly valueProperty = 'checked';

  protected override extractValue(event: Event): boolean {
    return Boolean((event as CustomEvent).detail?.checked);
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
