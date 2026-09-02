import { Directive, HostListener, inject } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import type { ElementRef } from "@angular/core";

/**
 * Base `ControlValueAccessor` for NYSDS form components with a `value`
 * property (text inputs, selects, datepickers, etc.).
 *
 * Subclasses set `changeEvent` and optionally `inputEvent`, which the base
 * wires to `handleChange` and `handleInput` via `@HostListener`. The form
 * control's value is a generic string by default; override the generic type
 * when the component carries a typed value.
 *
 * Access the element via `this.el.nativeElement` (injected by the concrete
 * component).
 */
@Directive()
export abstract class NysValueAccessor<
  T = string,
> implements ControlValueAccessor {
  /**
   * The element reference. Subclasses inject `ElementRef<ConcreteComponent>`
   * and override this field so TypeScript knows the concrete type.
   */
  protected abstract readonly el: ElementRef;

  /** Event name that signals a committed value change. */
  protected abstract readonly changeEvent: string;

  /** Optional event name that signals input (before commit). Enables live updates. */
  protected readonly inputEvent?: string;

  private onChange = (_: T) => {};
  private onTouched = () => {};
  private _isWriting = false;

  writeValue(value: T | null | undefined): void {
    const writeVal = value ?? ("" as T);
    this._isWriting = true;
    this.el.nativeElement.value = writeVal;
    this._isWriting = false;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  /**
   * Extract the value from a change event's detail. Override to handle
   * components with non-standard detail shapes.
   */
  protected extractValue(event: Event): T {
    return (event as CustomEvent).detail?.value;
  }

  /**
   * Called for the input event (live updates during typing).
   * Marks the control dirty and dirty+touched. Override in subclasses to
   * customize.
   */
  protected handleInput(event: Event): void {
    if (this._isWriting) return;
    const value = this.extractValue(event);
    this.onChange(value);
  }

  /**
   * Called for the change event (committed value). Marks dirty and touched.
   * Override in subclasses to customize.
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
