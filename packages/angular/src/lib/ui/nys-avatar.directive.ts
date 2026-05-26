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
 * Wrapper directive for `<nys-avatar>`.
 *
 * User avatar with image, initials, or icon fallback and contrast-aware colors.
 */
@Directive({
  selector: 'nys-avatar',
  standalone: true,
})
export class NysAvatarDirective {
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
   * Accessible label for screen readers. Required when no image `alt` is available.
   * @default ""
   */
  @Input() set ariaLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
  }

  /**
   * Image URL. Takes priority over initials and icon.
   * @default ""
   */
  @Input() set image(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'image', value);
  }

  /**
   * 1-2 character initials. Used when no image is provided.
   * @default ""
   */
  @Input() set initials(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'initials', value);
  }

  /**
   * Custom icon name. Falls back to `account_circle` if not set.
   * @default ""
   */
  @Input() set icon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'icon', value);
  }

  /**
   * Background color. Foreground auto-adjusts for contrast. Accepts CSS values or variables.
   * @default ""
   */
  @Input() set color(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'color', value);
  }

  /**
   * Makes avatar clickable with button role and focus ring.
   * @default false
   */
  @Input() set interactive(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'interactive', value);
  }

  /**
   * Prevents interaction when `interactive` is true.
   * @default false
   */
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  /**
   * Enables lazy loading for the image.
   * @default false
   */
  @Input() set lazy(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'lazy', value);
  }
}
