import { ReactiveController, ReactiveControllerHost } from "lit";

const formCollections: WeakMap<
  HTMLFormElement,
  Set<ReactiveControllerHost & HTMLElement>
> = new WeakMap();
const reportValidityOverloads: WeakMap<HTMLFormElement, () => boolean> =
  new WeakMap();
const checkValidityOverloads: WeakMap<HTMLFormElement, () => boolean> =
  new WeakMap();
const userInteractedControls: WeakSet<HTMLElement> = new WeakSet();
const interactions = new WeakMap<HTMLElement, string[]>();

export interface FormControlControllerOptions {
  form: (input: HTMLElement) => HTMLFormElement | null;
  name?: (input: HTMLElement) => string | null;
  value?: (input: HTMLElement) => unknown;
  defaultValue?: (input: HTMLElement) => unknown;
  disabled?: (input: HTMLElement) => boolean;
  reportValidity?: (input: HTMLElement) => boolean;
  checkValidity?: (input: HTMLElement) => boolean;
  setValue?: (input: HTMLElement, value: unknown) => void;
  assumeInteractionOn?: string[]; // List of events that imply user interaction for validation purposes.
}

/**
 * A controller to enable custom form controls to participate in native HTML forms.
 *
 * We use FormControlController for building form-associated custom elements, particularly when:
 * 1. You insert our nys-component (e.g., nys-textinput, nys-radiogroup) into a native form.
 * 2. You need the component to interact with native forms events:
 *    - Submit data during form submission.
 *    - Support resetting to a default value on <form> reset.
 *    - Provide validation states (e.g., required, validity checks).
 *    - Works with <form> submit event and gives back FormData.
 */
export class FormControlController implements ReactiveController {
  private host: ReactiveControllerHost & HTMLElement;
  private form?: HTMLFormElement | null;
  private options: Required<FormControlControllerOptions>;

  constructor(
    host: ReactiveControllerHost & HTMLElement,
    options?: Partial<FormControlControllerOptions>,
  ) {
    (this.host = host).addController(this);

    // Default behaviors if not provided in options
    this.options = {
      form: (input) => {
        // If there's a form attribute, use it to find the target form by id
        const formId = (input as HTMLInputElement).form;

        if (formId) {
          const root = input.getRootNode() as
            | Document
            | ShadowRoot
            | HTMLElement;
          const form = root.querySelector(`#${formId}`);

          if (form) {
            return form as HTMLFormElement;
          }
        }

        return input.closest("form");
      },
      name: (input: HTMLElement) => input.getAttribute("name"),
      value: (input: HTMLElement) => input.getAttribute("value"),
      defaultValue: (input: HTMLElement) =>
        (input as HTMLInputElement).defaultValue,
      disabled: (input: HTMLElement) => input.hasAttribute("disabled"),
      reportValidity: (input: HTMLElement) =>
        typeof (input as HTMLInputElement).reportValidity === "function"
          ? (input as HTMLInputElement).reportValidity()
          : true,
      checkValidity: (input: HTMLElement) =>
        typeof (input as HTMLInputElement).checkValidity === "function"
          ? (input as HTMLInputElement).checkValidity()
          : true,
      setValue: (input: HTMLElement, value: unknown) =>
        ((input as HTMLInputElement).value = String(value)),
      assumeInteractionOn: ["input", "change"],
      ...options,
    };
  }

  hostConnected() {
    console.log("hostConnected");
    const form = this.options.form(this.host);

    if (form) {
      this.attachForm(form);
    }

    interactions.set(this.host, []);
    this.options.assumeInteractionOn.forEach((event) => {
      this.host.addEventListener(event, this.handleInteraction);
    });
  }

  hostDisconnected() {
    this.detachForm();
    interactions.delete(this.host);
    this.options.assumeInteractionOn.forEach((event) => {
      this.host.removeEventListener(event, this.handleInteraction);
    });
  }

  private attachForm(form?: HTMLFormElement) {
    console.log("attaching form");
    if (form) {
      this.form = form;

      if (formCollections.has(this.form)) {
        formCollections.get(this.form)!.add(this.host);
      } else {
        formCollections.set(
          this.form,
          new Set<ReactiveControllerHost & HTMLElement>([this.host]),
        );
      }

      console.log("We have a form, now attaching listeners form");
      this.form.addEventListener("formdata", this.handleFormData);
      this.form.addEventListener("submit", this.handleFormSubmit);
      this.form.addEventListener("reset", this.handleFormReset);

      if (!reportValidityOverloads.has(this.form)) {
        console.log("current form does not have reportValidityOverloads");
        reportValidityOverloads.set(this.form, this.form.reportValidity);
        this.form.reportValidity = () => this.reportFormValidity();
      }

      if (!checkValidityOverloads.has(this.form)) {
        checkValidityOverloads.set(this.form, this.form.checkValidity);
        this.form.checkValidity = () => this.checkFormValidity();
      }
    } else {
      this.form = undefined;
    }
  }

  private detachForm() {
    if (!this.form) return;

    const formCollection = formCollections.get(this.form);

    if (!formCollection) {
      return;
    }

    formCollection.delete(this.host);

    if (formCollection.size <= 0) {
      this.form.removeEventListener("formdata", this.handleFormData);
      this.form.removeEventListener("submit", this.handleFormSubmit);
      this.form.removeEventListener("reset", this.handleFormReset);

      if (reportValidityOverloads.has(this.form)) {
        this.form.reportValidity = reportValidityOverloads.get(this.form)!;
        reportValidityOverloads.delete(this.form);
      }

      if (checkValidityOverloads.has(this.form)) {
        this.form.checkValidity = checkValidityOverloads.get(this.form)!;
        checkValidityOverloads.delete(this.form);
      }

      this.form = undefined;
    }
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
    console.log(
      "The handleFormSubmit() is being called -- checking validation.",
    );
    const disabled = this.options.disabled(this.host);
    const reportValidity = this.options.reportValidity;

    // Update the interacted state for all controls when the form is submitted
    if (this.form && !this.form.noValidate) {
      formCollections.get(this.form)?.forEach((control) => {
        this.setUserInteracted(control, true);
      });

      if (
        this.form &&
        !this.form.noValidate &&
        !disabled &&
        !reportValidity(this.host)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("Preventing submission -- invalid requirements");
      }
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

  /**
   * interactions map to track whether a user has interacted with a form control (using events like input, change, etc.).
   * This helps in marking a control as "user-interacted," which can be important for validation states.
   */
  private handleInteraction = (event: Event) => {
    const emittedEvents = interactions.get(this.host)!;

    if (!emittedEvents.includes(event.type)) {
      emittedEvents.push(event.type);
    }

    if (emittedEvents.length === this.options.assumeInteractionOn.length) {
      this.setUserInteracted(this.host, true);
    }
  };

  // Check form validity by checking all form controls, including custom ones. Note that this does not trigger the native validation UI.
  private checkFormValidity() {
    console.log("checking form validity from the form-controller...");

    if (this.form && !this.form.noValidate) {
      const elements = Array.from(
        this.form.querySelectorAll<HTMLInputElement>("*"),
      );
      for (const element of elements) {
        if (
          typeof element.checkValidity === "function" &&
          !element.checkValidity()
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // Report form validity by checking all form controls, including custom ones.
  private reportFormValidity = () => {
    console.log("reporting form validity from the form-controller...");

    if (this.form && !this.form.noValidate) {
      const elements = Array.from(
        this.form.querySelectorAll<HTMLInputElement>("*"),
      );

      for (const element of elements) {
        if (typeof element.reportValidity === "function") {
          if (!element.reportValidity()) {
            return false;
          }
        }
      }
    }

    return true;
  };

  private setUserInteracted(el: HTMLElement, hasInteracted: boolean) {
    if (hasInteracted) {
      userInteractedControls.add(el);
    } else {
      userInteractedControls.delete(el);
    }

    if ("requestUpdate" in el) {
      (el as unknown as ReactiveControllerHost).requestUpdate();
    }
  }

  private doAction(type: "submit" | "reset", submitter?: HTMLInputElement) {
    if (this.form) {
      const button = document.createElement("button");
      button.type = type;
      button.style.position = "absolute";
      button.style.width = "0";
      button.style.height = "0";
      button.style.clipPath = "inset(50%)";
      button.style.overflow = "hidden";
      button.style.whiteSpace = "nowrap";

      if (submitter) {
        button.name = submitter.name;
        button.value = submitter.value;

        [
          "formaction",
          "formenctype",
          "formmethod",
          "formnovalidate",
          "formtarget",
        ].forEach((attr) => {
          if (submitter.hasAttribute(attr)) {
            button.setAttribute(attr, submitter.getAttribute(attr)!);
          }
        });
      }

      this.form.append(button);
      button.click();
      button.remove();
    }
  }

  getForm() {
    return this.form ?? null;
  }

  reset(submitter?: HTMLInputElement) {
    this.doAction("reset", submitter);
  }

  submit(submitter?: HTMLInputElement) {
    this.doAction("submit", submitter);
  }

  /**
   * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
   * the host element immediately, i.e. before Lit updates the component in the next update.
   */
  setValidity(isValid: boolean) {
    const host = this.host as unknown as HTMLInputElement;
    const required = Boolean(host.required);

    host.toggleAttribute("data-required", required);
    host.toggleAttribute("data-optional", !required);
    host.toggleAttribute("data-invalid", !isValid);
    host.toggleAttribute("data-valid", isValid);
    host.toggleAttribute("data-user-invalid", !isValid);
    host.toggleAttribute("data-user-valid", isValid);
  }

  /**
   * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
   * that affects constraint validation changes so the component receives the correct validity states.
   */
  updateValidity() {
    const host = this.host as unknown as HTMLInputElement;
    this.setValidity(host.validity.valid);
  }

  /**
   * Emits an invalid event on the host element.
   * @param originalInvalidEvent The original invalid event that triggered this call.
   * @returns Whether the event was prevented.
   * @internal
   * */
  emitInvalidEvent(originalInvalidEvent?: Event) {
    const invalidEvent = new CustomEvent<Record<PropertyKey, never>>(
      "nys-invalid",
      {
        bubbles: false,
        composed: false,
        cancelable: true,
        detail: {},
      },
    );

    if (!originalInvalidEvent) {
      invalidEvent.preventDefault();
    }

    if (!this.host.dispatchEvent(invalidEvent)) {
      originalInvalidEvent?.preventDefault();
    }
  }
}
