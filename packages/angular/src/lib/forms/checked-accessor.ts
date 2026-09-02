import { Directive, HostListener, inject } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import type { ElementRef } from "@angular/core";

/**
 * Base `ControlValueAccessor` for NYSDS form components with a `checked`
 * property (checkboxes, toggles).
 *
 * Subclasses set `changeEvent` and optionally `inputEvent`.
 *
 * Access the element via `this.el.nativeElement` (injected by the concrete
 * component).
 */
@Directive()
export abstract class NysCheckedAccessor implements ControlValueAccessor {
  /**
   * The element reference. Subclasses inject `ElementRef<ConcreteComponent>`
   * and override this field so TypeScript knows the concrete type.
   */
  protected abstract readonly el: ElementRef;

  /** Event name that signals a committed value change. */
  protected abstract readonly changeEvent: string;

  /** Optional event name that signals input (before commit). Enables live updates. */
  protected readonly inputEvent?: string;

  private onChange = (_: boolean) => {};
  private onTouched = () => {};
  private _isWriting = false;

  writeValue(value: boolean | null | undefined): void {
    const writeVal = value ?? false;
    this._isWriting = true;
    this.el.nativeElement.checked = writeVal;
    this._isWriting = false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  /**
   * Extract the checked state from a change event's detail. Override to
   * handle components with non-standard detail shapes.
   */
  protected extractValue(event: Event): boolean {
    return (event as CustomEvent).detail?.checked ?? false;
  }

  /**
   * Called for the input event (live updates).
   */
  protected handleInput(event: Event): void {
    if (this._isWriting) return;
    const value = this.extractValue(event);
    this.onChange(value);
  }

  /**
   * Called for the change event (committed value).
   */
  protected handleChange(event: Event): void {
    if (this._isWriting) return;
    const value = this.extractValue(event);
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
