// ============================================================================
// GENERATED — Do not edit by hand.
//
// This file is regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-directives.mjs` (run via `npm run
// generate --workspace=@nysds/angular`). Modify the script (or promote this
// tag out of GENERATED_TAGS to hand-edit) instead of editing this file.
//
// These are emitted as Angular Components (not Directives) so consumer
// templates don't need CUSTOM_ELEMENTS_SCHEMA — the Component selector
// satisfies Angular's template type checker for the underlying custom
// element tag. Host element IS the custom element (the browser upgrades
// it when Angular creates the host), so all property bindings flow
// straight through.
// ============================================================================
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-dropdownmenuitem>`.
 *
 * Dropdown item to display label and provide href link.
 */
@Component({
  selector: 'nys-dropdownmenuitem',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysDropdownmenuitemComponent {
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
