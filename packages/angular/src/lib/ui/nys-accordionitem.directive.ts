import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  inject,
} from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-accordion';` (registers both
// `nys-accordion` and `nys-accordionitem`) once component dist exists.

/**
 * Wrapper directive for `<nys-accordionitem>` with two-way `[(expanded)]`.
 *
 * Note: when nested inside `<nys-accordion>`, the parent component will mutate
 * `expanded` directly on the item. Avoid driving the same property from
 * Angular state in that configuration — pick one source of truth.
 *
 * TODO(task-8): generator will populate remaining typed @Input()s/@Output()s.
 */
@Directive({
  selector: 'nys-accordionitem',
  standalone: true,
})
export class NysAccordionitemDirective {
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
