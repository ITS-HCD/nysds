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
 * Wrapper component for `<nys-fileinput>`.
 *
 * File input with drag-and-drop, validation, and progress tracking.
 */
@Component({
  selector: 'nys-fileinput',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysFileinputComponent),
      multi: true,
    },
  ],
})
export class NysFileinputComponent extends NysControlValueAccessorBase<File[]> {
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
   * Allows selecting multiple files.
   * @default false
   */
  @Input() set multiple(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'multiple', value);
  }

  /**
   * Form `id` to associate with.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Tooltip text shown on hover/focus of info icon.
   * @default ""
   */
  @Input() set tooltip(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'tooltip', value);
  }

  /**
   * Accepted file types. Use MIME types (`image/*`) or extensions (`.pdf`). Validated via magic bytes.
   * @default ""
   */
  @Input() set accept(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'accept', value);
  }

  /**
   * Requires at least one file to be uploaded.
   * @default false
   */
  @Input() set required(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'required', value);
  }

  /**
   * Shows "Optional" flag.
   * @default false
   */
  @Input() set optional(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'optional', value);
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
   * Enables drag-and-drop zone UI.
   * @default false
   */
  @Input() set dropzone(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'dropzone', value);
  }

  /**
   * Component width: `lg` (384px) or `full` (100%, default).
   * @default "full"
   */
  @Input() set width(value: "lg" | "full") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'width', value);
  }

  /**
   * Adjusts colors for dark backgrounds.
   * @default false
   */
  @Input() set inverted(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'inverted', value);
  }

  protected override extractValue(event: Event): File[] {
    return ((event as CustomEvent).detail?.files as File[]) ?? [];
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
