// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from `custom-elements.json` by
// `packages/angular/scripts/cem-angular-plugin.mjs`, which runs automatically
// during `npm run cem` (wired into custom-elements-manifest.config.mjs). It is
// also available standalone via `npm run generate --workspace=@nysds/angular`.
// Modify the plugin (or promote this tag out of GENERATED_TAGS to hand-edit)
// instead of editing this file.
//
// Emitted as Angular Components so consumer templates don't need
// CUSTOM_ELEMENTS_SCHEMA — the Component selector satisfies Angular's
// template type checker for the underlying custom-element tag. The host
// element IS the custom element (the browser upgrades it when Angular
// creates the host), so property bindings flow straight through.
// ============================================================================
import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-icon>`.
 *
 * SVG icon from Material Symbols library with size, rotation, and color options.
 */
@Component({
  selector: 'nys-icon',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysIconComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Icon name from Material Symbols library. Required.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Accessible label. When set, removes `aria-hidden` and adds `aria-label` to the SVG.
   * @default ""
   */
  @Input() set ariaLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
  }

  /**
   * Rotation in degrees. Applied via CSS `rotate`.
   * @default "0"
   */
  @Input() set rotate(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'rotate', value);
  }

  /**
   * Flip direction: `horizontal`, `vertical`, or empty for none.
   * @default ""
   */
  @Input() set flip(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'flip', value);
  }

  /**
   * Icon color. Accepts any CSS color value. Defaults to `currentcolor`.
   * @default ""
   */
  @Input() set color(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'color', value);
  }

  /**
   * Icon size. Semantic sizes: `xs`-`5xl`. Pixel sizes: `12`-`50`.
   * @default "md"
   */
  @Input() set size(value: | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "32"
    | "40"
    | "50") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }
}
