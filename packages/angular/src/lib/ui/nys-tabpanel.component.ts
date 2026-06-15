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
 * Wrapper component for `<nys-tabpanel>`.
 *
 * `<nys-tabpanel>` is a content panel paired with a `<nys-tab>` inside a
 * `<nys-tabgroup>`.
 * 
 * Pairing is determined by render order: the Nth `<nys-tabpanel>` child of a
 * `<nys-tabgroup>` corresponds to the Nth `<nys-tab>` child.
 * `aria-labelledby` and the `hidden` attribute are managed externally by
 * `<nys-tabgroup>` via `_applySelection`; do not set them directly.
 */
@Component({
  selector: 'nys-tabpanel',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysTabpanelComponent {
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
