// ============================================================================
// GENERATED — Do not edit by hand.
//
// This file is regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-directives.mjs` (run via `npm run
// generate --workspace=@nysds/angular`). Modify the script (or promote this
// tag out of GENERATED_TAGS to hand-edit) instead of editing this file.
//
// These are emitted as Angular Components (not Directives) so consumer
// templates don't need CUSTOM_ELEMENTS_SCHEMA — the Component selector
// satisfies Angular's template type checker for the underlying custom
// element tag. Host element IS the custom element (the browser upgrades
// it when Angular creates the host), so all property bindings flow
// straight through.
// ============================================================================
import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-tabgroup>`.
 *
 * `<nys-tabgroup>` is the container for `<nys-tab>` and `<nys-tabpanel>`
 * elements.
 * 
 * Accepts tabs and panels as flat light-DOM children in any order (interleaved
 * or grouped). On slot change, children are sorted into dedicated shadow-DOM
 * containers, ARIA relationships are wired, and the first selected (or first)
 * tab is activated.
 * 
 * Scroll shadows are rendered on either side of the tab list and toggled via
 * `ResizeObserver` and a `scroll` listener so they accurately reflect whether
 * overflow content exists in each direction.
 * 
 * Keyboard navigation follows the
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ ARIA Tabs Pattern:
 * - Arrow keys move focus without changing selection.
 * - Enter / Space confirm selection on the focused tab.
 */
@Component({
  selector: 'nys-tabgroup',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysTabgroupComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Unique identifier for the tabgroup element.
   * If not provided, one is auto-generated in `connectedCallback`.
   * Reflected to the DOM attribute.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * The name of the tab group.
   * Used for form submission and accessibility purposes.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }
}
