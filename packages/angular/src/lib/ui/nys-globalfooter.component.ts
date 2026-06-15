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
 * Wrapper component for `<nys-globalfooter>`.
 *
 * Agency footer with auto-layout for contact info and link sections.
 */
@Component({
  selector: 'nys-globalfooter',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysGlobalfooterComponent {
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
