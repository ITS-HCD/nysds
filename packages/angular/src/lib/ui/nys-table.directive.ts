// ============================================================================
// GENERATED — Do not edit by hand.
//
// This file is regenerated from `custom-elements.json` by
// `packages/angular/scripts/generate-directives.mjs` (run via `npm run
// generate --workspace=@nysds/angular`). Modify the script (or promote this
// tag out of GENERATED_TAGS to hand-edit) instead of editing this file.
// ============================================================================
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, inject } from '@angular/core';

/**
 * Wrapper directive for `<nys-table>`.
 *
 * `<nys-table>` is a responsive table component that can display native HTML tables,
 * supports striped and bordered styling, sortable columns, and CSV download.
 */
@Directive({
  selector: 'nys-table',
  standalone: true,
})
export class NysTableDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * @default ""
   */
  @Input() set name(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'name', value);
  }

  /**
   * @default false
   */
  @Input() set striped(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'striped', value);
  }

  /**
   * @default false
   */
  @Input() set sortable(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'sortable', value);
  }

  /**
   * @default false
   */
  @Input() set bordered(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'bordered', value);
  }

  /**
   * @default ""
   */
  @Input() set download(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'download', value);
  }

  /** Fired when the download button or sortable headers are clicked. */
  @Output() readonly nysClick = new EventEmitter<CustomEvent>();

  @HostListener('nys-click', ['$event'])
  protected _emit_nysClick(event: Event): void {
    this.nysClick.emit(event as CustomEvent);
  }

  /** Fired when a sortable column header is clicked.  Can be prevented by calling `event.preventDefault()` to override default sort behavior. Detail: { columnIndex: number, columnLabel: string, sortDirection: "asc" | "desc" | "none" } */
  @Output() readonly nysColumnSort = new EventEmitter<CustomEvent>();

  @HostListener('nys-column-sort', ['$event'])
  protected _emit_nysColumnSort(event: Event): void {
    this.nysColumnSort.emit(event as CustomEvent);
  }
}
