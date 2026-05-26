// ============================================================================
// GENERATED — Do not edit by hand.
//
// This file is regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-directives.mjs` (run via `npm run
// generate --workspace=@nysds/angular`). Modify the script (or promote this
// tag out of GENERATED_TAGS to hand-edit) instead of editing this file.
// ============================================================================
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, inject } from '@angular/core';

/**
 * Wrapper directive for `<nys-radiobutton>`.
 *
 * Radio button for single selection from mutually exclusive options.
 */
@Directive({
  selector: 'nys-radiobutton',
  standalone: true,
})
export class NysRadiobuttonDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Whether this radio is selected. Only one per group can be checked.
   * @default false
   */
  @Input() set checked(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'checked', value);
  }

  /**
   * Prevents interaction.
   * @default false
   */
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  /**
   * Marks group as required. Set on radiogroup, not individual radios.
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
   * Group name. Radios with same name are mutually exclusive.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Value submitted when this radio is selected.
   * @default ""
   */
  @Input() set value(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  /**
   * Form `id` to associate with.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Radio size: `sm` (24px) or `md` (32px, default).
   * @default "md"
   */
  @Input() set size(value: "sm" | "md") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  /**
   * Renders as tile with larger clickable area.
   * @default false
   */
  @Input() set tile(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'tile', value);
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

  @Output() readonly nysErrorClear = new EventEmitter<CustomEvent>();

  @HostListener('nys-error-clear', ['$event'])
  protected _emit_nysErrorClear(event: Event): void {
    this.nysErrorClear.emit(event as CustomEvent);
  }

  /** Fired when selection changes. Detail: `{id, checked, name, value}`. */
  @Output() readonly nysChange = new EventEmitter<CustomEvent>();

  @HostListener('nys-change', ['$event'])
  protected _emit_nysChange(event: Event): void {
    this.nysChange.emit(event as CustomEvent);
  }

  /** Fired when "other" text input value changes. Detail: `{id, name, value}`. */
  @Output() readonly nysOtherInput = new EventEmitter<CustomEvent>();

  @HostListener('nys-other-input', ['$event'])
  protected _emit_nysOtherInput(event: Event): void {
    this.nysOtherInput.emit(event as CustomEvent);
  }

  /** Fired when radio gains focus. */
  @Output() readonly nysFocus = new EventEmitter<CustomEvent>();

  @HostListener('nys-focus', ['$event'])
  protected _emit_nysFocus(event: Event): void {
    this.nysFocus.emit(event as CustomEvent);
  }

  /** Fired when radio loses focus. */
  @Output() readonly nysBlur = new EventEmitter<CustomEvent>();

  @HostListener('nys-blur', ['$event'])
  protected _emit_nysBlur(event: Event): void {
    this.nysBlur.emit(event as CustomEvent);
  }

  @Output() readonly nysError = new EventEmitter<CustomEvent>();

  @HostListener('nys-error', ['$event'])
  protected _emit_nysError(event: Event): void {
    this.nysError.emit(event as CustomEvent);
  }
}
