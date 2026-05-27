import { Component, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

/** `ControlValueAccessor` for `<nys-textarea>` — string value, `nys-input` event. */
@Component({
  selector: 'nys-textarea',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextareaComponent),
      multi: true,
    },
  ],
})
export class NysTextareaComponent extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
