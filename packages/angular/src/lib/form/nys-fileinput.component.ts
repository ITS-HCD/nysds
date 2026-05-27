import { Component, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

/**
 * `ControlValueAccessor` for `<nys-fileinput>` — value is `File[]`. The
 * component dispatches `nys-change` with `{id, files}` whenever the selection
 * changes (including additions/removals).
 */
@Component({
  selector: 'nys-fileinput',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysFileinputComponent),
      multi: true,
    },
  ],
})
export class NysFileinputComponent extends NysControlValueAccessorBase<File[]> {
  protected readonly valueProperty = 'value';

  protected override extractValue(event: Event): File[] {
    return ((event as CustomEvent).detail?.files as File[]) ?? [];
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
