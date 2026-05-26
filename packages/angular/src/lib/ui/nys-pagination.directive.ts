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


/**
 * Wrapper directive for `<nys-pagination>` with two-way `[(currentPage)]`.
 *
 * TODO(task-8): generator will populate remaining typed @Input()s/@Output()s.
 */
@Directive({
  selector: 'nys-pagination',
  standalone: true,
})
export class NysPaginationDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set currentPage(value: number) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'currentPage', value);
  }

  @Output() currentPageChange = new EventEmitter<number>();

  @HostListener('nys-change', ['$event'])
  protected handleChange(event: Event): void {
    const detail = (event as CustomEvent).detail as { currentPage?: number } | undefined;
    if (typeof detail?.currentPage === 'number') {
      this.currentPageChange.emit(detail.currentPage);
    }
  }
}
