import { Component, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

/** `ControlValueAccessor` for `<nys-toggle>` — boolean `checked`, `nys-change`. */
@Component({
  selector: 'nys-toggle',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysToggleComponent),
      multi: true,
    },
  ],
})
export class NysToggleComponent extends NysControlValueAccessorBase<boolean> {
  protected readonly valueProperty = 'checked';

  protected override extractValue(event: Event): boolean {
    return Boolean((event as CustomEvent).detail?.checked);
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
