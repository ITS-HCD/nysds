import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';

/**
 * Wrapper component for `<nys-globalheader>`.
 *
 * IMPORTANT: this component clones and sanitizes its slotted markup into shadow
 * DOM. Angular event bindings or directives placed inside the slot are stripped
 * during sanitization, so the recommended integration is to pass navigation
 * entries via the `items` property — the wrapper forwards an array input to the
 * component without going through HTML serialization.
 */
@Component({
  selector: 'nys-globalheader',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysGlobalheaderComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set items(value: unknown[]) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'items', value);
  }
}
