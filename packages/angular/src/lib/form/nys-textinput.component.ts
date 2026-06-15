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
 * Wrapper component for `<nys-textinput>`.
 *
 * Text input for short single-line data with validation and masking support.
 */
@Component({
  selector: 'nys-textinput',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextinputComponent),
      multi: true,
    },
  ],
})
export class NysTextinputComponent extends NysControlValueAccessorBase<string> {
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
   * Input type: `text` (default), `email`, `number`, `password`, `search`, `tel` (auto-masked), `url`.
   * @default "text"
   */
  @Input() set type(value: | "email"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "url") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
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
   * Placeholder text. Don't use as label replacement.
   * @default ""
   */
  @Input() set placeholder(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
  }

  /**
   * Makes input read-only but focusable.
   * @default false
   */
  @Input() set readonly(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'readonly', value);
  }

  /**
   * Marks as required. Shows "Required" flag and validates on blur.
   * @default false
   */
  @Input() set required(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'required', value);
  }

  /**
   * Shows "Optional" flag. Use when most fields are required.
   * @default false
   */
  @Input() set optional(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'optional', value);
  }

  /**
   * Tooltip text shown on hover/focus of info icon.
   * @default ""
   */
  @Input() set tooltip(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'tooltip', value);
  }

  /**
   * Form `id` to associate with when input is outside form element.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Regex pattern for validation. Shows error on mismatch.
   * @default ""
   */
  @Input() set pattern(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'pattern', value);
  }

  /**
   * Maximum character length.
   * @default null
   */
  @Input() set maxlength(value: number | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'maxlength', value);
  }

  /**
   * Accessible label. When set, assuming "label" isn't provided for private special cases (i.e., <checkbox other>).
   * @default ""
   */
  @Input() set ariaLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
  }

  /**
   * Input width: `sm` (88px), `md` (200px), `lg` (384px), `full` (100%, default).
   * @default "full"
   */
  @Input() set width(value: | "sm"
    | "md"
    | "lg"
    | "full") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'width', value);
  }

  /**
   * Step increment for `type="number"`.
   * @default null
   */
  @Input() set step(value: number | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'step', value);
  }

  /**
   * Minimum value for `type="number"`.
   * @default null
   */
  @Input() set min(value: number | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'min', value);
  }

  /**
   * Maximum value for `type="number"`.
   * @default null
   */
  @Input() set max(value: number | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'max', value);
  }

  /**
   * Adjusts colors for dark backgrounds.
   * @default false
   */
  @Input() set inverted(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'inverted', value);
  }

  /**
   * Shows error message when true. Set by validation or manually.
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

  @HostListener('nys-input', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
