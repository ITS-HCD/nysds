import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

// TODO(task-7): add `import '@nysds/nys-select';` once component dist exists.

/**
 * `ControlValueAccessor` for `<nys-select>` — string value, `nys-change` event.
 */
@Directive({
  selector: 'nys-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysSelectDirective),
      multi: true,
    },
  ],
})
export class NysSelectDirective extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
