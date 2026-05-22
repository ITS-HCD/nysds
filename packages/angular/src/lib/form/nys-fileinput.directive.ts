import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

// TODO(task-7): add `import '@nysds/nys-fileinput';` once component dist exists.

/**
 * `ControlValueAccessor` for `<nys-fileinput>` — value is `File[]`. The
 * component dispatches `nys-change` with `{id, files}` whenever the selection
 * changes (including additions/removals).
 */
@Directive({
  selector: 'nys-fileinput',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysFileinputDirective),
      multi: true,
    },
  ],
})
export class NysFileinputDirective extends NysControlValueAccessorBase<File[]> {
  protected readonly valueProperty = 'value';

  protected override extractValue(event: Event): File[] {
    return ((event as CustomEvent).detail?.files as File[]) ?? [];
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
