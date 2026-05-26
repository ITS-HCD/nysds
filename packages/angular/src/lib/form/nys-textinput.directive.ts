import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';


/**
 * Angular `ControlValueAccessor` for the `<nys-textinput>` web component.
 *
 * Bridges `ngModel` / Reactive Forms with the component's `value` property and
 * its `nys-input` change event. `nys-blur` drives `onTouched` via the base
 * class.
 *
 * @example
 * ```html
 * <nys-textinput label="Full name" [(ngModel)]="name"></nys-textinput>
 * ```
 */
@Directive({
  selector: 'nys-textinput',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextinputDirective),
      multi: true,
    },
  ],
})
export class NysTextinputDirective extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = 'value';

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
