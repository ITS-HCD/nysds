// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from `custom-elements.json` by
// `packages/angular/scripts/cem-angular-plugin.mjs`, which runs automatically
// during `npm run cem` (wired into custom-elements-manifest.config.mjs). It is
// also available standalone via `npm run generate --workspace=@nysds/angular`.
// Modify the plugin (or promote this tag out of FORM_COMPONENTS to hand-edit)
// instead of editing this file.
//
// ControlValueAccessor wrapper: extends NysControlValueAccessorBase so the
// underlying custom element participates in ngModel / Reactive Forms. Typed
// @Input()s are derived from the CEM; the form value and disabled state are
// owned by Angular forms (writeValue / setDisabledState on the base), so they
// are intentionally excluded from the generated passthrough inputs.
// ============================================================================
import { Component, HostListener, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';

/**
 * Wrapper component for `<nys-toggle>`.
 *
 * Toggle switch for binary settings with immediate effect.
 */
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

  /**
   * Unique identifier. Auto-generated if not provided.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Name for form submission.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Value submitted when toggle is on.
   * @default ""
   */
  @Input() set value(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  /**
   * Visible label text.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * Helper text below label. Use slot for custom HTML.
   * @default ""
   */
  @Input() set description(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'description', value);
  }

  /**
   * Form `id` to associate with.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Hides check/close icon inside toggle knob.
   * @default false
   */
  @Input() set noIcon(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'noIcon', value);
  }

  /**
   * Adjusts colors for dark backgrounds.
   * @default false
   */
  @Input() set inverted(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'inverted', value);
  }

  /**
   * Toggle size: `sm` or `md` (default).
   * @default "md"
   */
  @Input() set size(value: "sm" | "md") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  protected override extractValue(event: Event): boolean {
    return Boolean((event as CustomEvent).detail?.checked);
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
