import { LitElement } from "lit";
import {
  ReflectsAriaMixin,
  type Constructor,
  type ReflectsAriaInterface,
} from "./reflects-aria-mixin";
import type { FormValue } from "./types";

/** Surface added by {@link FormControlMixin}, on top of {@link ReflectsAriaInterface}. */
export declare class FormControlInterface extends ReflectsAriaInterface {
  /** Form-associated custom element opt-in. */
  static formAssociated: boolean;
  /** Push the current value into the owning form. */
  protected setFormValue(value: FormValue): void;
  /** Map a set of validity flags to `setValidity` + host `aria-invalid`. */
  protected setValidityFromState(
    flags: ValidityStateFlags,
    message?: string,
    anchor?: HTMLElement,
  ): void;
  /** Clear validity and reset `aria-invalid`. */
  protected clearValidity(): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  formResetCallback(): void;
}

/**
 * Mixin that makes an element a form-associated custom element with centralized
 * value, validity, and ARIA-association plumbing. Composes
 * {@link ReflectsAriaMixin}, so it also provides role/state reflection and id
 * generation. Use for form controls.
 *
 * Note: form controls should still declare their own
 * `static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }`
 * — the mixin intentionally does not set it, to avoid changing focus behavior on
 * non-form elements.
 */
export const FormControlMixin = <T extends Constructor<LitElement>>(
  Base: T,
) => {
  class FormControl extends ReflectsAriaMixin(Base) {
    static formAssociated = true;

    protected setFormValue(value: FormValue): void {
      this.internals?.setFormValue(value ?? null);
    }

    protected setValidityFromState(
      flags: ValidityStateFlags,
      message?: string,
      anchor?: HTMLElement,
    ): void {
      const internals = this.internals;
      if (!internals) return;
      const invalid = Object.values(flags).some(Boolean);
      if (invalid) {
        internals.setValidity(flags, message ?? "Invalid value", anchor);
      } else {
        internals.setValidity({});
      }
      this.setHostAria("ariaInvalid", invalid ? "true" : "false");
    }

    protected clearValidity(): void {
      this.internals?.setValidity({});
      this.setHostAria("ariaInvalid", "false");
    }

    checkValidity(): boolean {
      return this.internals?.checkValidity() ?? true;
    }

    reportValidity(): boolean {
      return this.internals?.reportValidity() ?? true;
    }

    formResetCallback(): void {
      this.clearValidity();
    }
  }
  return FormControl as unknown as Constructor<FormControlInterface> & T;
};

/** Concrete base class: `extends NysFormControlElement` for form controls. */
export class NysFormControlElement extends FormControlMixin(LitElement) {}
