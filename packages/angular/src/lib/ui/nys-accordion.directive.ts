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
 * Wrapper directive for `<nys-accordion>`.
 *
 * Container for accordion items with optional single-select and bordered styling.
 */
@Directive({
  selector: 'nys-accordion',
  standalone: true,
})
export class NysAccordionDirective {
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
   * Only one item can be expanded at a time. Expanding one collapses others.
   * @default false
   */
  @Input() set singleSelect(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'singleSelect', value);
  }

  /**
   * Adds borders around each accordion item. Propagates to all children.
   * @default false
   */
  @Input() set bordered(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'bordered', value);
  }
}
