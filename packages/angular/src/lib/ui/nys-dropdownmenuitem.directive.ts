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
 * Wrapper directive for `<nys-dropdownmenuitem>`.
 *
 * Dropdown item to display label and provide href link.
 */
@Directive({
  selector: 'nys-dropdownmenuitem',
  standalone: true,
})
export class NysDropdownmenuitemDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * @default ""
   */
  @Input() set href(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
  }

  /**
   * @default false
   */
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  /**
   * @default "_self"
   */
  @Input() set target(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'target', value);
  }

  /**
   * @default ""
   */
  @Input() set prefixIcon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'prefixIcon', value);
  }

  /**
   * @default ""
   */
  @Input() set divider(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'divider', value);
  }

  @Output() readonly nysClick = new EventEmitter<CustomEvent>();

  @HostListener('nys-click', ['$event'])
  protected _emit_nysClick(event: Event): void {
    this.nysClick.emit(event as CustomEvent);
  }
}
