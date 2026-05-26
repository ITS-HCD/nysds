import { Directive, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';


/**
 * `ControlValueAccessor` for `<nys-checkboxgroup>`.
 *
 * Value is `string[]` — the `value` of every checked `<nys-checkbox>` child.
 * Reads by collecting checked children whenever a bubbling `nys-change` fires;
 * writes by setting each child's `checked` based on array membership.
 *
 * The group component does not currently expose a `selectedValues` getter on
 * its public API — flagged upstream alongside the equivalent `nys-radiogroup`
 * gap.
 */
@Directive({
  selector: 'nys-checkboxgroup',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysCheckboxgroupDirective),
      multi: true,
    },
  ],
})
export class NysCheckboxgroupDirective extends NysControlValueAccessorBase<string[]> {
  protected readonly valueProperty = '__unused__';

  protected override extractValue(_event: Event): string[] {
    return Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLElement>('nys-checkbox'),
    )
      .filter((checkbox) => Boolean((checkbox as unknown as { checked?: boolean }).checked))
      .map((checkbox) => (checkbox as unknown as { value?: string }).value ?? '');
  }

  override writeValue(value: string[] | null | undefined): void {
    const selected = new Set(value ?? []);
    const checkboxes = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'nys-checkbox',
    );
    checkboxes.forEach((checkbox) => {
      const cbValue = (checkbox as unknown as { value?: string }).value ?? '';
      this.renderer.setProperty(checkbox, 'checked', selected.has(cbValue));
    });
  }

  override setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
    const checkboxes = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'nys-checkbox',
    );
    checkboxes.forEach((checkbox) => {
      this.renderer.setProperty(checkbox, 'disabled', isDisabled);
    });
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
