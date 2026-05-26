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
 * Wrapper directive for `<nys-globalfooter>`.
 *
 * Agency footer with auto-layout for contact info and link sections.
 */
@Directive({
  selector: 'nys-globalfooter',
  standalone: true,
})
export class NysGlobalfooterDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Agency name displayed as the footer heading.
   * @default ""
   */
  @Input() set agencyName(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'agencyName', value);
  }

  /**
   * URL for the agency name link. If empty, name is not clickable.
   * @default ""
   */
  @Input() set homepageLink(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'homepageLink', value);
  }
}
