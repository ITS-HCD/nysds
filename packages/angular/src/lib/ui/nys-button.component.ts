// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from `custom-elements.json` by
// `packages/angular/scripts/cem-angular-plugin.mjs`, which runs automatically
// during `npm run cem` (wired into custom-elements-manifest.config.mjs). It is
// also available standalone via `npm run generate --workspace=@nysds/angular`.
// Modify the plugin (or promote this tag out of FORM_COMPONENTS to hand-edit)
// instead of editing this file.
//
// Form-associated wrapper. The web component's form association does not
// survive Angular's template boundary, so this wrapper walks to the enclosing
// <form> and calls requestSubmit() on click when type === 'submit', keeping
// (ngSubmit) firing the way Angular consumers expect. Typed @Input()s (all
// CEM fields except the special `type`) are derived from the manifest.
// ============================================================================
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

/**
 * Wrapper component for `<nys-button>`.
 *
 * Button for actions and CTAs with variants, sizes, and icon support.
 */
@Component({
  selector: 'nys-button',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysButtonComponent implements OnInit {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /**
   * Unique identifier. Auto-generated if not provided.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Name for form submission.
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * Button height: `sm` (40px) for dense UIs, `md` (48px, default) for standard use, `lg` (56px) for prominent CTAs.
   * @default "md"
   */
  @Input() set size(value: "sm" | "md" | "lg") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  /**
   * Expands button to fill container width. Use for mobile layouts or stacked button groups.
   * @default false
   */
  @Input() set fullWidth(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'fullWidth', value);
  }

  /**
   * Visual style: `filled` for primary (one per section), `outline` for secondary, `ghost` for tertiary, `text` for inline actions. Avoid `text` for navigation.
   * @default "filled"
   */
  @Input() set variant(value: | "filled"
    | "outline"
    | "ghost"
    | "text") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'variant', value);
  }

  /**
   * Adjusts colors for dark backgrounds.
   * @default false
   */
  @Input() set inverted(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'inverted', value);
  }

  /**
   * Visible button text. Use sentence case, action-oriented text (e.g., "Save Draft"). Becomes aria-label in `circle` mode.
   * @default ""
   */
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }

  /**
   * Screen reader label. Required for icon-only buttons if `label` is not set.
   * @default ""
   */
  @Input() set ariaLabel(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
  }

  /**
   * ID of controlled element (e.g., dropdown or modal). Sets `aria-controls`.
   * @default ""
   */
  @Input() set ariaControls(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaControls', value);
  }

  /**
   * Material Symbol icon before label. Not shown for `circle` mode.
   * @default ""
   */
  @Input() set prefixIcon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'prefixIcon', value);
  }

  /**
   * Material Symbol icon after label. Use `chevron_down` for dropdowns, `open_in_new` for external links. Not shown for `circle` mode.
   * @default ""
   */
  @Input() set suffixIcon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'suffixIcon', value);
  }

  /**
   * Renders circular icon-only button. Requires `icon` prop. `label` becomes aria-label.
   * @default false
   */
  @Input() set circle(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'circle', value);
  }

  /**
   * Icon for circle mode. Required when `circle` is true. Scales with size (sm=24px, md=32px, lg=40px).
   * @default ""
   */
  @Input() set icon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'icon', value);
  }

  /**
   * Prevents interaction. Avoid disabling without explanation—show validation errors instead.
   * @default false
   */
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  /**
   * Form `id` to associate with. Use when button is outside the form element.
   * @default null
   */
  @Input() set form(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'form', value);
  }

  /**
   * Value submitted with form data. Only used when `type="submit"`.
   * @default ""
   */
  @Input() set value(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  /**
   * Additional screen reader description. Sets `aria-description`.
   * @default ""
   */
  @Input() set ariaDescription(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'ariaDescription', value);
  }

  /**
   * Click handler. Use instead of `@click` to ensure keyboard accessibility.
   * @default null
   */
  @Input() set onClick(value: ((event: Event) => void) | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'onClick', value);
  }

  /**
   * URL to navigate to. Renders as `<a>` tag. Omit for action buttons.
   * @default ""
   */
  @Input() set href(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
  }

  /**
   * Link target: `_self` (same tab), `_blank` (new tab—add `suffixIcon="open_in_new"`), `_parent`, `_top`, or frame name.
   * @default "_self"
   */
  @Input() set target(value: | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | "framename") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'target', value);
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'type', this.type);
  }

  @HostListener('click')
  protected handleClick(): void {
    if (this.type !== 'submit') return;
    const form = this.findParentForm(this.elementRef.nativeElement);
    if (form) form.requestSubmit();
  }

  private findParentForm(el: HTMLElement | null): HTMLFormElement | null {
    let node: HTMLElement | null = el;
    while (node?.parentElement) {
      node = node.parentElement;
      if (node.tagName === 'FORM') return node as HTMLFormElement;
    }
    return null;
  }
}
