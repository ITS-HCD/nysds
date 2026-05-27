import { Component, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

/**
 * `ControlValueAccessor` for `<nys-combobox>` — string value, `nys-change` event.
 *
 * The combobox also fires `nys-input` during typing, but only `nys-change`
 * represents a committed selection — which is what Angular forms should track.
 */
@Component({
  selector: 'nys-combobox',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysComboboxComponent),
      multi: true,
    },
  ],
})
export class NysComboboxComponent extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
