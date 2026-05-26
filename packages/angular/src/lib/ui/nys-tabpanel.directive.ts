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
 * Wrapper directive for `<nys-tabpanel>`.
 *
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a
 * `<nys-tabgroup>`.
 * 
 * Pairing is determined by render order: the Nth `<nys-tabpanel>` child of a
 * `<nys-tabgroup>` corresponds to the Nth `<nys-tab>` child.
 * `aria-labelledby` and the `hidden` attribute are managed externally by
 * `<nys-tabgroup>` via `_applySelection`; do not set them directly.
 */
@Directive({
  selector: 'nys-tabpanel',
  standalone: true,
})
export class NysTabpanelDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Unique identifier for the panel element.
   * If not provided, one is auto-generated in `connectedCallback`.
   * Reflected to the DOM attribute so `aria-controls` references on sibling
   * `<nys-tab>` elements resolve correctly.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }
}
