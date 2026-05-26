import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';


/**
 * Wrapper directive for `<nys-button>`.
 *
 * The web component's form association does not survive Angular's template
 * boundary, so this directive walks up to the enclosing `<form>` and calls
 * `requestSubmit()` on click when `type === 'submit'`. That keeps `(ngSubmit)`
 * firing the way Angular consumers expect.
 *
 * TODO(task-8): generator will populate typed @Input()s for every documented
 * property and @Output()s for every `nys-*` event.
 */
@Directive({
  selector: 'nys-button',
  standalone: true,
})
export class NysButtonDirective implements OnInit {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() type: 'submit' | 'button' | 'reset' = 'button';

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
