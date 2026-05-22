import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

// TODO(task-7): add `import '@nysds/nys-radiobutton';` (which also registers
// `nys-radiogroup`) once component dist exists.

/**
 * `ControlValueAccessor` for `<nys-radiogroup>`.
 *
 * The group component does not dispatch its own `nys-change`; instead the
 * selected `<nys-radiobutton>` child fires one with detail
 * `{id, checked, name, value}` that bubbles through the group. `@HostListener`
 * catches it on the group element thanks to bubbling.
 *
 * Writing values walks the child radios and toggles `checked` so Reactive
 * Forms / `ngModel` updates propagate down. The underlying component exposes
 * only a private `selectedValue` field — flagged upstream for a public
 * accessor.
 */
@Directive({
  selector: 'nys-radiogroup',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysRadiogroupDirective),
      multi: true,
    },
  ],
})
export class NysRadiogroupDirective extends NysControlValueAccessorBase<string> {
  // Value is set via child traversal in writeValue — no single property to
  // mirror on the host element.
  protected readonly valueProperty = '__unused__';

  protected override extractValue(event: Event): string {
    return ((event as CustomEvent).detail?.value as string) ?? '';
  }

  override writeValue(value: string): void {
    const radios = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'nys-radiobutton',
    );
    radios.forEach((radio) => {
      const radioValue = (radio as unknown as { value?: string }).value;
      this.renderer.setProperty(radio, 'checked', radioValue === value);
    });
  }

  override setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
    const radios = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'nys-radiobutton',
    );
    radios.forEach((radio) => {
      this.renderer.setProperty(radio, 'disabled', isDisabled);
    });
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
