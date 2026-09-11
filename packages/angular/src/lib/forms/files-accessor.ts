import { Directive, HostListener, inject } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import type { ElementRef } from "@angular/core";

/**
 * Base `ControlValueAccessor` for NYSDS file input components.
 *
 * Subclasses set `changeEvent` and optionally `inputEvent`.
 *
 * Access the element via `this.el.nativeElement` (injected by the concrete
 * component).
 */
@Directive()
export abstract class NysFilesAccessor implements ControlValueAccessor {
  /**
   * The element reference. Subclasses inject `ElementRef<ConcreteComponent>`
   * and override this field so TypeScript knows the concrete type.
   */
  protected abstract readonly el: ElementRef;

  /** Event name that signals a committed value change. */
  protected abstract readonly changeEvent: string;

  /** Optional event name that signals input (before commit). Enables live updates. */
  protected readonly inputEvent?: string;

  private onChange = (_: FileList | null) => {};
  private onTouched = () => {};
  private _isWriting = false;

  writeValue(value: FileList | null | undefined): void {
    const writeVal = value ?? null;
    this._isWriting = true;
    if (writeVal && "setFiles" in this.el.nativeElement) {
      this.el.nativeElement.setFiles(writeVal);
    }
    this._isWriting = false;
  }

  registerOnChange(fn: (value: FileList | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  /**
   * Extract the files from the component's current `files` property.
   */
  protected extractValue(): FileList | null {
    return this.el.nativeElement.files ?? null;
  }

  /**
   * Called for the input event (live updates).
   */
  protected handleInput(): void {
    if (this._isWriting) return;
    const value = this.extractValue();
    this.onChange(value);
  }

  /**
   * Called for the change event (committed value).
   */
  protected handleChange(): void {
    if (this._isWriting) return;
    const value = this.extractValue();
    this.onChange(value);
  }

  /**
   * Called when the component fires `nys-blur`. Marks the control touched.
   */
  @HostListener("nys-blur")
  protected handleBlur(): void {
    this.onTouched();
  }
}
