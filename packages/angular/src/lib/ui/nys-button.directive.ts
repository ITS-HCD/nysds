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
 * The web component's form association does not survive Angular's template
 * boundary, so this wrapper walks up to the enclosing `<form>` and calls
 * `requestSubmit()` on click when `type === 'submit'`. That keeps `(ngSubmit)`
 * firing the way Angular consumers expect.
 *
 * TODO: generator could populate additional typed @Input()s for every
 * documented property; kept hand-written so the requestSubmit bridge isn't
 * lost on regeneration.
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

  // Common passthrough @Input()s so consumers can use `[bracket]` bindings under
  // strictTemplates without errors. Add others here as they're needed (or pick
  // up the generator-composition pattern described in README → "Why wrappers
  // and not directives?" to derive these from the CEM).
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }
  @Input() set label(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
  }
  @Input() set variant(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'variant', value);
  }
  @Input() set size(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }
  @Input() set fullWidth(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'fullWidth', value);
  }
  @Input() set prefixIcon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'prefixIcon', value);
  }
  @Input() set suffixIcon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'suffixIcon', value);
  }
  @Input() set icon(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'icon', value);
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
