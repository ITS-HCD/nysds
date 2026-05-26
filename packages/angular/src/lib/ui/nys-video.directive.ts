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
 * Wrapper directive for `<nys-video>`.
 *
 * YouTube video player with thumbnail preview and accessibility announcements.
 */
@Directive({
  selector: 'nys-video',
  standalone: true,
})
export class NysVideoDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  /**
   * Full YouTube URL — required. Component will not render if invalid.
   * @default ""
   */
  @Input() set id(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'id', value);
  }

  /**
   * Title text for the thumbnail of the video
   * @default ""
   */
  @Input() set titleText(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'titleText', value);
  }

  /**
   * Full YouTube URL — required. Component will not render if invalid.
   * @default ""
   */
  @Input() set videourl(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'videourl', value);
  }

  /**
   * Largest size for the video player.
   * If not set, size is determined automatically by viewport width.
   * @default ""
   */
  @Input() set size(value: "full" | "md" | "sm" | "") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'size', value);
  }

  /**
   * @default "lazy"
   */
  @Input() set loading(value: "lazy" | "eager") {
    this.renderer.setProperty(this.elementRef.nativeElement, 'loading', value);
  }

  /**
   * Time in seconds where playback begins. *
   * @default 0
   */
  @Input() set starttime(value: number) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'starttime', value);
  }

  /**
   * Custom thumbnail image path.
   * Falls back to YouTube's auto-generated thumbnail if not provided.
   * @default null
   */
  @Input() set thumbnail(value: string | null) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'thumbnail', value);
  }

  /**
   * Triggers autoplay when the iframe loads
   * @default false
   */
  @Input() set autoplay(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'autoplay', value);
  }

  /**
   * Prevents the video from being played
   * @default false
   */
  @Input() set disabled(value: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', value);
  }

  /** Fired when the user clicks the thumbnail to load the player. */
  @Output() readonly nysVideoPlay = new EventEmitter<CustomEvent>();

  @HostListener('nys-video-play', ['$event'])
  protected _emit_nysVideoPlay(event: Event): void {
    this.nysVideoPlay.emit(event as CustomEvent);
  }
}
