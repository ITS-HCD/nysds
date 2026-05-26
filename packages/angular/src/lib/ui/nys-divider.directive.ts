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
 * Wrapper directive for `<nys-divider>`.
 *
 * Horizontal divider for visual separation of content sections.
 */
@Directive({
  selector: 'nys-divider',
  standalone: true,
})
export class NysDividerDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Adjusts colors for dark backgrounds.
   * @default false
   */
  @Input() set inverted(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'inverted', value);
  }
}
