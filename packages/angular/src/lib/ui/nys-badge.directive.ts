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
 * Wrapper directive for `<nys-badge>`.
 *
 * Compact label for status, counts, or categorization with semantic styling.
 */
@Directive({
  selector: 'nys-badge',
  standalone: true,
})
export class NysBadgeDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Unique identifier.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Name attribute for form association.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Badge size: `sm` (smaller text) or `md` (default).
   * @default "md"
   */
  @Input() set size(value: "sm" | "md") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  /**
   * Semantic intent affecting color: `neutral`, `error`, `success`, or `warning`.
   * @default "neutral"
   */
  @Input() set intent(value: | "neutral"
    | "error"
    | "success"
    | "warning") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'intent', value);
  }

  /**
   * Secondary label displayed before the main label.
   * @default ""
   */
  @Input() set prefixLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'prefixLabel', value);
  }

  /**
   * Primary label text displayed in the badge.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * Screen reader text appended after the label for additional context.
   * @default ""
   */
  @Input() set srText(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'srText', value);
  }

  /**
   * @default ""
   */
  @Input() set variant(value: "strong" | "") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'variant', value);
  }

  @Input() set prefixIcon(value: string | boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'prefixIcon', value);
  }

  @Input() set suffixIcon(value: string | boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'suffixIcon', value);
  }
}
