import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';


/**
 * Wrapper directive for `<nys-globalheader>`.
 *
 * IMPORTANT: this component clones and sanitizes its slotted markup into shadow
 * DOM. Angular event bindings or directives placed inside the slot are stripped
 * during sanitization, so the recommended integration is to pass navigation
 * entries via the `items` property — the directive forwards an array input to
 * the component without going through HTML serialization.
 *
 * TODO(task-8): generator will populate remaining typed @Input()s/@Output()s
 * (and a more precise `items` type) from the CEM.
 */
@Directive({
  selector: 'nys-globalheader',
  standalone: true,
})
export class NysGlobalheaderDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set items(value: unknown[]) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'items', value);
  }
}
