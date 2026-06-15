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
 * Wrapper component for `<nys-datepicker>`.
 *
 * Date picker with calendar popup and native fallback.
 */
@Component({
  selector: 'nys-datepicker',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysDatepickerComponent),
      multi: true,
    },
  ],
})
export class NysDatepickerComponent extends NysControlValueAccessorBase<Date | string | undefined> {
  protected readonly valueProperty = 'value';

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
   * Input width: `md` (200px), `lg` (384px), `full` (100%).
   * @default "md"
   */
  @Input() set width(value: "md" | "lg" | "full") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'width', value);
  }

  /**
   * Hide the "Today" button in calendar popup.
   * @default false
   */
  @Input() set hideTodayButton(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'hideTodayButton', value);
  }

  /**
   * Hide the "Clear" button in calendar popup.
   * @default false
   */
  @Input() set hideClearButton(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'hideClearButton', value);
  }

  /**
   * Mark as required. Shows "Required" flag and validates on blur.
   * @default false
   */
  @Input() set required(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'required', value);
  }

  /**
   * Show "Optional" flag. Use when most fields are required.
   * @default false
   */
  @Input() set optional(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'optional', value);
  }

  /**
   * Show error state.
   * @default false
   */
  @Input() set showError(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'showError', value);
  }

  /**
   * Error message text.
   * @default ""
   */
  @Input() set errorMessage(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'errorMessage', value);
  }

  /**
   * Form `id` to associate with when input is outside form.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Tooltip text on info icon hover.
   * @default ""
   */
  @Input() set tooltip(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'tooltip', value);
  }

  /**
   * Input type. Currently only supports `date`.
   * @default "date"
   */
  @Input() set type(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
  }

  /**
   * Label text. Required for accessibility.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * Helper text below label.
   * @default ""
   */
  @Input() set description(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'description', value);
  }

  /**
   * Initial date when calendar opens (YYYY-MM-DD).
   * @default ""
   */
  @Input() set startDate(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'startDate', value);
  }

  /**
   * The earliest selectable date (YYYY-MM-DD).
   * @default ""
   */
  @Input() set minDate(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'minDate', value);
  }

  /**
   * The latest selectable date (YYYY-MM-DD).
   * @default ""
   */
  @Input() set maxDate(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'maxDate', value);
  }

  /**
   * Dark background mode.
   * @default false
   */
  @Input() set inverted(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'inverted', value);
  }

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
