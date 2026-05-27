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
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-step>`.
 *
 * Individual step for use within nys-stepper with navigation support.
 */
@Component({
  selector: 'nys-step',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysStepComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Which step is currently being displayed. If not set, defaults to the `current` step.
   * Setting this on a step after `current` is silently corrected to match `current`.
   * When controlling state from a framework, always set this explicitly.
   * @default false
   */
  @Input() set selected(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'selected', value);
  }

  /**
   * The furthest step the user has reached (progress boundary). Steps before this are navigable.
   * @default false
   */
  @Input() set current(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'current', value);
  }

  /**
   * Step label text displayed alongside the step number.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * URL navigated to when the step is activated, via `window.location.href`.
   * Navigation is suppressed if the `nys-step-click` listener calls `e.preventDefault()`.
   * Omit for SPA/framework routing and handle navigation in the event listener instead.
   * @default ""
   */
  @Input() set href(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
  }

  /**
   * Optional function called before `nys-step-click` is dispatched. Use for pre-navigation logic.
   */
  @Input() set onClick(value: (e: Event) => void | undefined) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'onClick', value);
  }

  /** Fired when a navigable (`previous` or `current`) non-selected step is clicked or activated by keyboard. Detail: `{ href: string, label: string }`. Cancelable — call `e.preventDefault()` to suppress `window.location.href` navigation. */
  @Output() readonly nysStepClick = new EventEmitter<CustomEvent>();

  @HostListener('nys-step-click', ['$event'])
  protected _emit_nysStepClick(event: Event): void {
    this.nysStepClick.emit(event as CustomEvent);
  }
}
