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
 * Wrapper component for `<nys-stepper>`.
 *
 * Multi-step progress indicator with navigation and mobile-friendly compact view.
 */
@Component({
  selector: 'nys-stepper',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysStepperComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Unique identifier. Auto-generated as `nys-stepper-{n}-{timestamp}` if not provided.
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
   * Title displayed above the step list and compact counter.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * Progress text displayed in compact mode (e.g., "Step 2 of 5"). Auto-managed — do not set manually.
   * @default "initial"
   */
  @Input() set counterText(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'counterText', value);
  }

  /**
   * Whether compact mobile view is expanded to show all steps. Toggled by clicking the counter.
   * @default false
   */
  @Input() set isCompactExpanded(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'isCompactExpanded', value);
  }
}
