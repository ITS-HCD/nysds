// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-components.mjs` (run via
// `npm run generate --workspace=@nysds/angular`, or automatically as part of
// `npm run cem`). Modify the generator (or promote this tag out of
// GENERATED_TAGS to hand-edit) instead of editing this file.
//
// Emitted as Angular Components so consumer templates don't need
// CUSTOM_ELEMENTS_SCHEMA — the Component selector satisfies Angular's
// template type checker for the underlying custom-element tag. The host
// element IS the custom element (the browser upgrades it when Angular
// creates the host), so property bindings flow straight through.
// ============================================================================
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-alert>`.
 *
 * Alert for contextual feedback with semantic types and live region support.
 */
@Component({
  selector: 'nys-alert',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysAlertComponent {
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
   * Bold heading text displayed at the top of the alert.
   * @default ""
   */
  @Input() set heading(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'heading', value);
  }

  /**
   * Custom icon name. Defaults to type-appropriate icon if not set.
   * @default ""
   */
  @Input() set icon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'icon', value);
  }

  /**
   * Shows close button allowing users to dismiss the alert.
   * @default false
   */
  @Input() set dismissible(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'dismissible', value);
  }

  /**
   * Auto-dismiss after specified milliseconds. Set to 0 to disable.
   * @default 0
   */
  @Input() set duration(value: number) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'duration', value);
  }

  /**
   * Body text content. Ignored if slot content is provided.
   * @default ""
   */
  @Input() set text(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'text', value);
  }

  /**
   * URL for the primary action link.
   * @default ""
   */
  @Input() set primaryAction(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'primaryAction', value);
  }

  /**
   * URL for the secondary action link.
   * @default ""
   */
  @Input() set secondaryAction(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'secondaryAction', value);
  }

  /**
   * Label text for primary action link.
   * @default "Learn more"
   */
  @Input() set primaryLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'primaryLabel', value);
  }

  /**
   * Label text for secondary action link.
   * @default "Dismiss"
   */
  @Input() set secondaryLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'secondaryLabel', value);
  }

  /**
   * Semantic alert type affecting color and ARIA role. `danger`/`emergency` use assertive live region.
   * @default "base"
   */
  @Input() set type(value: | "base"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "emergency") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
  }

  /**
   * Returns ARIA role and label based on alert type.
   * - 'alert' => assertive live region (implied)
   * - 'status' => polite live region
   * - 'region' => generic, requires aria-label
   */
  @Input() set ariaAttributes(value: {
    role: "alert" | "status" | "region";
    ariaLabel: string;
  }) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaAttributes', value);
  }

  /**
   * Returns live-region type for screen readers if applicable.
   * - 'polite' for status role
   * - undefined for alert (since it's implicitly assertive) or region
   */
  @Input() set liveRegion(value: "polite" | undefined) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'liveRegion', value);
  }

  /** Fired when alert is dismissed. Detail: `{id, type, label}`. */
  @Output() readonly nysClose = new EventEmitter<CustomEvent>();

  @HostListener('nys-close', ['$event'])
  protected _emit_nysClose(event: Event): void {
    this.nysClose.emit(event as CustomEvent);
  }
}
