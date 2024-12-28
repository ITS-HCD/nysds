import { LitElement } from "lit";
import "@nys-excelsior/nys-icon";
export declare class NysSelect extends LitElement {
    private readonly formControlController;
    id: string;
    name: string;
    label: string;
    description: string;
    value: string;
    disabled: boolean;
    required: boolean;
    form: string;
    size: string;
    hasError: boolean;
    errorMessage: string;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    setCustomValidity(message: string): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    private _handleSlotChange;
    private _handleChange;
    private _handleFocus;
    private _handleBlur;
    updated(changedProperties: Map<string, unknown>): void;
    private _handleSubmitForm;
    render(): import("lit-html").TemplateResult<1>;
}
