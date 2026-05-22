import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';

/**
 * Abstract base for NYSDS `ControlValueAccessor` directives.
 *
 * Concrete subclasses configure three things:
 *  - `valueProperty` — the property on the custom element that carries the
 *    bound value (`'value'` for text/select, `'checked'` for checkbox/toggle).
 *  - `changeEventName` — the `nys-*` event that signals a value change.
 *  - `extractValue()` — pulls the value out of the change event's detail.
 *
 * The base wires up `writeValue` (property write via `Renderer2`), `nys-blur`
 * for `onTouched`, and `setDisabledState` for the `disabled` property.
 *
 * Subclasses must annotate themselves with `@Directive({ selector, providers })`
 * registering `NG_VALUE_ACCESSOR` — the base intentionally stays selectorless so
 * Angular treats it as an abstract directive (no element binding of its own).
 */
@Directive()
export abstract class NysControlValueAccessorBase<TValue = unknown>
  implements ControlValueAccessor
{
  protected readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly renderer: Renderer2 = inject(Renderer2);

  /** Property name on the custom element that carries the bound value. */
  protected abstract readonly valueProperty: string;

  /**
   * Pull the bound value out of a `nys-*` change event.
   *
   * Default reads `event.detail.value`; subclasses override for `checked`,
   * `files`, etc.
   */
  protected extractValue(event: Event): TValue {
    const detail = (event as CustomEvent).detail as { value?: unknown } | undefined;
    return detail?.value as TValue;
  }

  private onChange: (value: TValue) => void = () => {};
  private onTouched: () => void = () => {};

  /** Angular → element. Push the bound value onto the configured property. */
  writeValue(value: TValue): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      this.valueProperty,
      value,
    );
  }

  registerOnChange(fn: (value: TValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
  }

  /**
   * Subclasses bind a concrete `nys-*` event to this handler via a
   * `@HostListener` decorator on an override method (HostListener does not
   * inherit through abstract base classes in Ivy).
   */
  protected handleChange(event: Event): void {
    this.onChange(this.extractValue(event));
  }

  /** `nys-blur` is the universal "touched" signal across NYSDS form components. */
  @HostListener('nys-blur')
  protected handleBlur(): void {
    this.onTouched();
  }
}
