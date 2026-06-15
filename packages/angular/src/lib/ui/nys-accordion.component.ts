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
 * Wrapper component for `<nys-accordion>`.
 *
 * Container for accordion items with optional single-select and bordered styling.
 */
@Component({
  selector: 'nys-accordion',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysAccordionComponent {
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
