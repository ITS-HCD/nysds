import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Typed language entry accepted by `<nys-unavheader>`'s `languages` property.
 *
 * Mirrors the underlying component's `Language[]` type; widen if the upstream
 * type evolves.
 */
export interface NysUnavheaderLanguage {
  code: string;
  label: string;
  href?: string;
}

/**
 * Wrapper component for `<nys-unavheader>`.
 *
 * Exposes the typed `languages` array property so Angular consumers don't have
 * to bind it through `attr.` / cast it to `any`.
 */
@Component({
  selector: 'nys-unavheader',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysUnavheaderComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set languages(value: NysUnavheaderLanguage[]) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'languages', value);
  }
}
