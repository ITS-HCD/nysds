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
 * Wrapper directive for `<nys-modal>` with two-way `[(open)]` support.
 *
 * Consumers can write `<nys-modal [(open)]="isOpen">…</nys-modal>` and have
 * the boolean stay in sync as the user dismisses the modal. The `nys-close`
 * event (and any future open/close transitions) flows through `openChange`.
 *
 * TODO(task-8): generator will populate remaining typed @Input()s/@Output()s.
 */
@Directive({
  selector: 'nys-modal',
  standalone: true,
})
export class NysModalDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() set open(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'open', value);
  }

  @Output() openChange = new EventEmitter<boolean>();

  @HostListener('nys-close')
  protected handleClose(): void {
    this.openChange.emit(false);
  }

  @HostListener('nys-open')
  protected handleOpen(): void {
    this.openChange.emit(true);
  }
}
