// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-components.mjs` (run via
// `npm run generate --workspace=@nysds/angular`, or automatically as part of
// `npm run cem`). Modify the generator (or promote this tag out of
// GENERATED_TAGS to hand-edit) instead of editing this file.
//
// Emitted as Angular Components so consumer templates don't need
// CUSTOM_ELEMENTS_SCHEMA — the Component selector satisfies Angular's
// template type checker for the underlying custom-element tag. The host
// element IS the custom element (the browser upgrades it when Angular
// creates the host), so property bindings flow straight through.
// ============================================================================
import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-skipnav>`.
 *
 * Skip navigation link for keyboard accessibility. Hidden until focused.
 */
@Component({
  selector: 'nys-skipnav',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysSkipnavComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Unique identifier. Auto-generated if not provided.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Target element ID (with `#`). Defaults to `#main-content`.
   * @default ""
   */
  @Input() set href(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
  }
}
