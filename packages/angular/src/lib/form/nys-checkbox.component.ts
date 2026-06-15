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
 * Wrapper component for `<nys-checkbox>`.
 *
 * Checkbox for binary choices or multi-select options.
 */
@Component({
  selector: 'nys-checkbox',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysCheckboxComponent),
      multi: true,
    },
  ],
})
export class NysCheckboxComponent extends NysControlValueAccessorBase<boolean> {
  protected readonly valueProperty = 'checked';

  /**
   * Marks as required. Validates that checkbox is checked.
   * @default false
   */
  @Input() set required(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'required', value);
  }

  /**
   * Visible label text. Required for accessibility.
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
   * Unique identifier. Auto-generated if not provided.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Name for form submission. Use same name for grouped checkboxes.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Value submitted when checked.
   * @default ""
   */
  @Input() set value(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  /**
   * Form `id` to associate with when checkbox is outside form element.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Shows error message when true.
   * @default false
   */
  @Input() set showError(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'showError', value);
  }

  /**
   * Error message text. Shown only when `showError` is true.
   * @default ""
   */
  @Input() set errorMessage(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'errorMessage', value);
  }

  /**
   * Internal: Set by parent checkboxgroup. Do not set manually.
   * @default false
   */
  @Input() set groupExist(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'groupExist', value);
  }

  /**
   * Renders as tile with larger clickable area. Apply to group for consistency.
   * @default false
   */
  @Input() set tile(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'tile', value);
  }

  /**
   * Tooltip text shown on hover/focus of info icon.
   * @default ""
   */
  @Input() set tooltip(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'tooltip', value);
  }

  /**
   * Checkbox size: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @Input() set size(value: "sm" | "md") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  /**
   * @default false
   */
  @Input() set other(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'other', value);
  }

  /**
   * @default false
   */
  @Input() set showOtherError(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'showOtherError', value);
  }

  protected override extractValue(event: Event): boolean {
    return Boolean((event as CustomEvent).detail?.checked);
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
