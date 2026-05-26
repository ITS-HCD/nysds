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
 * Wrapper directive for `<nys-tab>`.
 *
 * `<nys-tab>` is a single tab within a `<nys-tabgroup>`.
 * 
 * The host element carries `role="tab"`, `tabindex`, `aria-selected`,
 * `aria-controls`, and `aria-disabled` so assistive technologies see the
 * correct ARIA tab semantics on the element that is actually focused.
 * `<nys-tabgroup>` manages `tabindex`, `aria-selected`, and `aria-controls`
 * via `_applySelection`; do not set them directly on this element.
 */
@Directive({
  selector: 'nys-tab',
  standalone: true,
})
export class NysTabDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Unique identifier for the tab element.
   * Reflected to the DOM attribute so `aria-controls` references resolve.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Visible text label rendered inside the inner `<span>`.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * Whether this tab is the currently active tab.
   * Managed by `<nys-tabgroup>`; reflected for CSS attribute selectors.
   * @default false
   */
  @Input() set selected(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'selected', value);
  }

  /**
   * Whether this tab is disabled.
   * Reflected to the DOM attribute for CSS styling.
   * @default false
   */
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  /** Dispatched when the tab is activated via click or Enter / Space. Bubbles and crosses shadow DOM boundaries. `detail: { id: string, label: string }` */
  @Output() readonly nysTabSelect = new EventEmitter<CustomEvent>();

  @HostListener('nys-tab-select', ['$event'])
  protected _emit_nysTabSelect(event: Event): void {
    this.nysTabSelect.emit(event as CustomEvent);
  }

  /** Dispatched when the host receives focus. Bubbles and crosses shadow DOM boundaries. `detail: { id: string }` */
  @Output() readonly nysTabFocus = new EventEmitter<CustomEvent>();

  @HostListener('nys-tab-focus', ['$event'])
  protected _emit_nysTabFocus(event: Event): void {
    this.nysTabFocus.emit(event as CustomEvent);
  }

  /** Dispatched when the host loses focus. Bubbles and crosses shadow DOM boundaries. `detail: { id: string }` */
  @Output() readonly nysTabBlur = new EventEmitter<CustomEvent>();

  @HostListener('nys-tab-blur', ['$event'])
  protected _emit_nysTabBlur(event: Event): void {
    this.nysTabBlur.emit(event as CustomEvent);
  }
}
