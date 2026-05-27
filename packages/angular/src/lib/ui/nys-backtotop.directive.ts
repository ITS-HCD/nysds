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
import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-backtotop>`.
 *
 * Floating back-to-top button with auto-show behavior, smooth scroll, and focus management.
 */
@Component({
  selector: 'nys-backtotop',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysBacktotopComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Horizontal position: `left` or `right`.
   * @default "right"
   */
  @Input() set position(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'position', value);
  }

  /**
   * Force button visibility. Overrides auto-show scroll behavior.
   * @default false
   */
  @Input() set visible(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'visible', value);
  }
}
