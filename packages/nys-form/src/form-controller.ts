import { ReactiveController, ReactiveControllerHost } from 'lit';

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
      this.form.addEventListener('formdata', this.handleFormData);
      this.form.addEventListener('reset', this.handleReset);
    }
  }

  hostDisconnected() {
    if (this.form) {
      this.form.removeEventListener('formdata', this.handleFormData);
      this.form.removeEventListener('reset', this.handleReset);
    }
  }

  /**
   * Handles the 'formdata' event to append the control's value to the form data.
   */
  private handleFormData = (event: FormDataEvent) => {
    if (this.options.disabled(this.host)) return;

    const name = this.options.name(this.host);
    const value = this.options.value(this.host);

    if (name && value !== undefined) {
      event.formData.append(name, String(value));
    }
  };

  /**
   * Handles the 'reset' event to reset the control's value.
   */
  private handleReset = () => {
    const defaultValue = this.options.defaultValue(this.host);
    if (defaultValue !== undefined) {
      this.options.setValue(this.host, defaultValue);
      this.host.requestUpdate();
    }
  };

  /**
   * Sets the form control's validity state programmatically.
   */
  setValidity(valid: boolean) {
    this.host.toggleAttribute('data-invalid', !valid);
    this.host.toggleAttribute('data-valid', valid);
  }

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
}
