// ============================================================================
// GENERATED — Do not edit by hand.
//
// This file is regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-directives.mjs` (run via `npm run
// generate --workspace=@nysds/angular`). Modify the script (or promote this
// tag out of GENERATED_TAGS to hand-edit) instead of editing this file.
// ============================================================================
import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Wrapper directive for `<nys-skipnav>`.
 *
 * Skip navigation link for keyboard accessibility. Hidden until focused.
 */
@Directive({
  selector: 'nys-skipnav',
  standalone: true,
})
export class NysSkipnavDirective {
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
