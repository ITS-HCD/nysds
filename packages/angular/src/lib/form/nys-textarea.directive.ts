import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

// TODO(task-7): add `import '@nysds/nys-textarea';` once component dist exists.

/**
 * `ControlValueAccessor` for `<nys-textarea>` — string value, `nys-input` event.
 */
@Directive({
  selector: 'nys-textarea',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextareaDirective),
      multi: true,
    },
  ],
})
export class NysTextareaDirective extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
