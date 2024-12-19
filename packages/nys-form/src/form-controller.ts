import { ReactiveController, ReactiveControllerHost } from 'lit';

// We store a Set of controls that users have interacted with. This allows us to determine the interaction state
// without littering the DOM with additional data attributes.
const formCollections: WeakMap<HTMLFormElement, Set<FormControlController>> = new WeakMap();


export interface FormControlControllerOptions {
  /** A function that returns the form containing the form control. */
  form?: (input: HTMLElement) => HTMLFormElement | null;
  /** A function that returns the form control's name, which will be submitted with the form data. */
  name?: (input: HTMLElement) => string | null;
  /** A function that returns the form control's current value. */
  value?: (input: HTMLElement) => unknown;
  /** A function that returns the form control's default value. */
  defaultValue?: (input: HTMLElement) => unknown;
  /** A function that returns the form control's current disabled state. */
  disabled?: (input: HTMLElement) => boolean;
  /** A function that maps to the form control's `reportValidity()` function. */
  reportValidity?: (input: HTMLElement) => boolean;
  /**
   * A function that maps to the form control's `checkValidity()` function. When the control is invalid, this will return false.
   * this is helpful is you want to check validation without triggering the native browser constraint violation warning.
   */
  checkValidity?: (input: HTMLElement) => boolean;
  /** A function that sets the form control's value */
  setValue?: (input: HTMLElement, value: unknown) => void;
  /** List of events that imply user interaction for validation purposes. */
  assumeInteractionOn?: string[];
}

/**
 * A controller to enable custom form controls to participate in native HTML forms.
 *
 * We use FormControlController for building form-associated custom elements, particularly when:
 * 1. You insert our nys-component (e.g., nys-textinput, nys-radiogroup).
 * 2. You need the component to interact with native forms:
 *    - Submit data during form submission.
 *    - Support resetting to a default value on <form> reset.
 *    - Provide validation states (e.g., required, validity checks).
 *    - Works with <form> submit event and gives back FormData.
 */
export class FormControlController implements ReactiveController {
  private host: ReactiveControllerHost & HTMLElement;
  private form: HTMLFormElement | null = null;
  private options: Required<FormControlControllerOptions>;

  constructor(host: ReactiveControllerHost & HTMLElement, options: FormControlControllerOptions = {}) {
    (this.host = host).addController(this);

    // Default behaviors if not provided in options
    this.options = {
      form: input => input.closest('form'),
      name: (input: HTMLElement) => input.getAttribute('name'),
      value: (input: HTMLElement) => input.getAttribute('value'),
      defaultValue: (input: HTMLElement) => (input as HTMLInputElement).defaultValue,
      disabled: (input: HTMLElement) => input.hasAttribute('disabled'),
      reportValidity: (input: HTMLElement) =>
        typeof (input as HTMLInputElement).reportValidity === 'function'
          ? (input as HTMLInputElement).reportValidity()
          : true,
      checkValidity: (input: HTMLElement) =>
        typeof (input as HTMLInputElement).checkValidity === 'function'
          ? (input as HTMLInputElement).checkValidity()
          : true,
      setValue: (input: HTMLElement, value: unknown) => (input as HTMLInputElement).value = String(value),
      assumeInteractionOn: ['input', 'change'],
      ...options
    };
  }

  hostConnected() {
    this.form = this.options.form(this.host);

    if (this.form) {
      this.attachForm(this.form);
    }
  }

  hostDisconnected() {
    this.detachForm();
  }

  private attachForm(form?: HTMLFormElement) {
    if (form) {
      this.form = form;

      this.form.addEventListener('formdata', this.handleFormData);
      this.form.addEventListener('submit', this.handleFormSubmit);
      console.log("We have attached form in form-controller.ts");
      this.form.addEventListener('reset', this.handleFormReset);
    
      // Overload the form's reportFormValidity() method to include custom validation
      if (!this.form.reportFormValidity) {
        this.form.reportFormValidity = () => this.reportFormValidity();
      }
      
      // Overload the form's checkValidity() method to include custom validation
      if (!this.form.checkValidity) {
        this.form.checkValidity = () => this.checkFormValidity();
      }
    }
  }

  private detachForm() {
    if (!this.form) return;

    this.form.removeEventListener('formdata', this.handleFormData);
    this.form.removeEventListener('submit', this.handleFormSubmit);
    this.form.removeEventListener('reset', this.handleFormReset);
  }

  /** Handles the 'formdata' event to append the control's value to the form data. **/
  private handleFormData = (event: FormDataEvent) => {
    if (this.options.disabled(this.host)) return;

    const name = this.options.name(this.host);
    const value = this.options.value(this.host);

    if (name && value !== undefined) {
      event.formData.append(name, String(value));
    }
  };

  private handleFormSubmit = (event: Event) => {
    const disabled = this.options.disabled(this.host);
    const reportValidity = this.options.reportValidity;

    if (this.form && !this.form.noValidate && !disabled && !reportValidity(this.host)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  
  /**
   * Handles the 'reset' event to reset the control's value.
   */
  private handleFormReset = () => {
    const defaultValue = this.options.defaultValue(this.host);
    if (defaultValue !== undefined) {
      this.options.setValue(this.host, defaultValue);
      this.host.requestUpdate();
    }
  };

  // private handleInteraction(event: Event) {
  //   // Handle interaction logic here
  //   this.setUserInteracted(true);
  // }

  private checkFormValidity() {
    if (this.form && !this.form.noValidate) {
      const elements = Array.from(this.form.querySelectorAll<HTMLInputElement>('*'));
      for (const element of elements) {
        if (typeof element.checkValidity === 'function' && !element.checkValidity()) {
          return false;
        }
      }
    }
    return true;
  }

  // Report form validity by checking all form controls, including custom ones.
  private reportFormValidity = () => {
    /* Excelsior form controls mimic native behavior, supporting the Constraint Validation API and methods like setCustomValidity() and reportValidity().
     * The HTMLFormElement's reportValidity() triggers validation for all child controls. To handle this, we overload reportValidity() to check for elements with this method.
     * The original method is stored in a WeakMap to prevent calling it directly, which could trigger validation in an unintended order. On disconnection, the original behavior is restored. 
     * */

    // This workaround will be unnecessary once ElementInternals is supported. We also respect the form's novalidate attribute.
    if (this.form && !this.form.noValidate) {
      // This seems sloppy, but checking all elements will cover native inputs, Shoelace inputs, and other custom
      // elements that support the constraint validation API.
      const elements = Array.from(this.form.querySelectorAll<HTMLInputElement>('*'));

      for (const element of elements) {
        if (typeof element.reportValidity === 'function') {
          if (!element.reportValidity()) {
            return false;
          }
        }
      }
    }

    return true;
  };

  /**
   * Triggers form submission.
   */
  submit() {
    this.form?.submit();
  }

  /**
   * Resets the form.
   */
  reset() {
    this.form?.reset();
  }

  /**
   * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
   * the host element immediately, i.e. before Lit updates the component in the next update.
   */
  setValidity(isValid: boolean) {
    console.log('Testing validity in form-controller: ', isValid);
    const host = this.host as unknown as HTMLInputElement;
    const required = Boolean(host.required);

    host.toggleAttribute('data-required', required);
    host.toggleAttribute('data-optional', !required);
    host.toggleAttribute('data-invalid', !isValid);
    host.toggleAttribute('data-valid', isValid);
    host.toggleAttribute('data-user-invalid', !isValid);
    host.toggleAttribute('data-user-valid', isValid);
  }

  /**
   * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
   * that affects constraint validation changes so the component receives the correct validity states.
   */
  updateValidity() {
    const host = this.host as unknown as HTMLInputElement;
    this.setValidity(host.validity.valid);
  }
}
