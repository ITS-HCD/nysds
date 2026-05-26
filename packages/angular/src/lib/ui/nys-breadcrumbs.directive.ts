import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';


/**
 * Wrapper directive for `<nys-breadcrumbs>`.
 *
 * Like `<nys-globalheader>`, this component clones and sanitizes slotted markup,
 * so dynamic Angular content inside the default slot will not survive. Pass
 * breadcrumb entries through the `items` property instead.
 *
 * TODO(task-8): generator will populate remaining typed @Input()s/@Output()s.
 */
@Directive({
  selector: 'nys-breadcrumbs',
  standalone: true,
})
export class NysBreadcrumbsDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set items(value: unknown[]) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'items', value);
  }
}
