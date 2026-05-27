import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  inject,
} from '@angular/core';

/**
 * Wrapper component for `<nys-accordionitem>` with two-way `[(expanded)]`.
 *
 * Note: when nested inside `<nys-accordion>`, the parent will mutate `expanded`
 * directly on the item. Avoid driving the same property from Angular state in
 * that configuration — pick one source of truth.
 */
@Component({
  selector: 'nys-accordionitem',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysAccordionitemComponent {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set expanded(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'expanded', value);
  }

  @Output() expandedChange = new EventEmitter<boolean>();

  @HostListener('nys-toggle', ['$event'])
  protected handleToggle(event: Event): void {
    const detail = (event as CustomEvent).detail as { expanded?: boolean } | undefined;
    if (typeof detail?.expanded === 'boolean') {
      this.expandedChange.emit(detail.expanded);
    }
  }
}
