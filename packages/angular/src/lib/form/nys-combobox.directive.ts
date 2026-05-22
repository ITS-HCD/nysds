import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

// TODO(task-7): add `import '@nysds/nys-combobox';` once component dist exists.

/**
 * `ControlValueAccessor` for `<nys-combobox>` — string value, `nys-change` event.
 *
 * The combobox also fires `nys-input` during typing, but only `nys-change`
 * represents a committed selection — which is what Angular forms should track.
 */
@Directive({
  selector: 'nys-combobox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysComboboxDirective),
      multi: true,
    },
  ],
})
export class NysComboboxDirective extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
