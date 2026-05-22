import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

// TODO(task-7): add `import '@nysds/nys-toggle';` once component dist exists.

/**
 * `ControlValueAccessor` for `<nys-toggle>` — boolean `checked`, `nys-change`.
 */
@Directive({
  selector: 'nys-toggle',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysToggleDirective),
      multi: true,
    },
  ],
})
export class NysToggleDirective extends NysControlValueAccessorBase<boolean> {
  protected readonly valueProperty = 'checked';

  protected override extractValue(event: Event): boolean {
    return Boolean((event as CustomEvent).detail?.checked);
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
