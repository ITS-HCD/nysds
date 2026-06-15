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
 * Wrapper component for `<nys-radiogroup>`.
 *
 * Container for grouping radio buttons as a single form control.
 */
@Component({
  selector: 'nys-radiogroup',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysRadiogroupComponent),
      multi: true,
    },
  ],
})
export class NysRadiogroupComponent extends NysControlValueAccessorBase<string> {
  protected readonly valueProperty = '__unused__';

  /**
   * Unique identifier. Auto-generated if not provided.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Name for form submission. Auto-populated from child radiobuttons.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Requires a selection before form submission.
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
   * Visible label text for the group.
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
   * Renders all radiobuttons as tiles with larger clickable area.
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
   * Form `id` to associate with. Applied to all children.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Radio size for all children: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @Input() set size(value: "sm" | "md") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  protected override extractValue(event: Event): string {
    return ((event as CustomEvent).detail?.value as string) ?? '';
  }

  override writeValue(value: string): void {
    const children = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'nys-radiobutton',
    );
    children.forEach((child) => {
      const childValue = (child as unknown as { value?: string }).value;
      this.renderer.setProperty(child, 'checked', childValue === value);
    });
  }

  override setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
    const children = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      'nys-radiobutton',
    );
    children.forEach((child) => {
      this.renderer.setProperty(child, 'disabled', isDisabled);
    });
  }

  @HostListener('nys-change', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }
}
