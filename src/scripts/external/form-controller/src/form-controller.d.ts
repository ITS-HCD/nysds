import { ReactiveController, ReactiveControllerHost } from "lit";
export interface FormControlControllerOptions {
    form: (input: HTMLElement) => HTMLFormElement | null;
    name?: (input: HTMLElement) => string | null;
    value?: (input: HTMLElement) => unknown;
    defaultValue?: (input: HTMLElement) => unknown;
    disabled?: (input: HTMLElement) => boolean;
    reportValidity?: (input: HTMLElement) => boolean;
    checkValidity?: (input: HTMLElement) => boolean;
    setValue?: (input: HTMLElement, value: unknown) => void;
    assumeInteractionOn?: string[];
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
export declare class FormControlController implements ReactiveController {
    private host;
    private form?;
    private options;
    constructor(host: ReactiveControllerHost & HTMLElement, options?: Partial<FormControlControllerOptions>);
    hostConnected(): void;
    hostDisconnected(): void;
    private attachForm;
    private detachForm;
    /** Handles the 'formdata' event to append the control's value to the form data. **/
    private handleFormData;
    private handleFormSubmit;
    /**
     * Handles the 'reset' event to reset the control's value.
     */
    private handleFormReset;
    /**
     * interactions map to track whether a user has interacted with a form control (using events like input, change, etc.).
     * This helps in marking a control as "user-interacted," which can be important for validation states.
     */
    private handleInteraction;
    private checkFormValidity;
    private reportFormValidity;
    private setUserInteracted;
    private doAction;
    getForm(): HTMLFormElement | null;
    reset(submitter?: HTMLInputElement): void;
    submit(submitter?: HTMLInputElement): void;
    /**
     * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
     * the host element immediately, i.e. before Lit updates the component in the next update.
     */
    setValidity(isValid: boolean): void;
    /**
     * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
     * that affects constraint validation changes so the component receives the correct validity states.
     */
    updateValidity(): void;
    /**
     * Emits an invalid event on the host element.
     * @param originalInvalidEvent The original invalid event that triggered this call.
     * @returns Whether the event was prevented.
     * @internal
     * */
    emitInvalidEvent(originalInvalidEvent?: Event): void;
}
