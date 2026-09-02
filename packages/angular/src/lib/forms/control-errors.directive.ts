import { Directive, HostBinding, inject, OnInit, OnDestroy, effect } from "@angular/core";
import { NgControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NYS_ERROR_MESSAGES } from "./error-messages.token.js";

/**
 * Optional directive that maps Angular validation errors to the host
 * component's `showError` and `errorMessage` properties.
 *
 * Add it to any NYSDS form component inside a `formControl` or
 * `formControlName` binding:
 *
 * ```html
 * <nys-textinput
 *   formControlName="email"
 *   nysControlErrors
 * ></nys-textinput>
 * ```
 *
 * When the control is touched and invalid, the directive sets `showError`
 * and `errorMessage` on the host element so the component renders its error
 * UI. Consumers can override the default messages by providing
 * `NYS_ERROR_MESSAGES`.
 */
@Directive({
  selector: "[nysControlErrors]",
  standalone: true,
})
export class NysControlErrorsDirective implements OnInit, OnDestroy {
  private ngControl = inject(NgControl);
  private host = inject(NgControl, { self: true, optional: true })?.valueAccessor?.["el"]
    ?.nativeElement;
  private errorMessages = inject(NYS_ERROR_MESSAGES);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (!this.ngControl.control) return;

    const control = this.ngControl.control;

    // Subscribe to status changes to update error display
    control.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateErrors());

    // Also subscribe to value changes to clear errors on input (before blur)
    control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Clear errors while still dirty but touched not yet set
        if (!control.touched) {
          this.clearErrors();
        }
      });

    // Initial state
    this.updateErrors();
  }

  private updateErrors(): void {
    if (!this.ngControl.control) return;
    const control = this.ngControl.control;

    if (!this.host) return;

    // Only show errors if the control is touched and invalid
    if (control.touched && control.invalid && control.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      const errorFn = this.errorMessages[firstErrorKey] || (() => "Invalid");
      const message = errorFn(control.errors[firstErrorKey]);

      this.host.showError = true;
      this.host.errorMessage = message;
    } else {
      this.clearErrors();
    }
  }

  private clearErrors(): void {
    if (!this.host) return;
    this.host.showError = false;
    this.host.errorMessage = "";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
