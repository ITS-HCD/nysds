import { LitElement } from "lit";
export declare class NysCheckbox extends LitElement {
    private readonly formControlController;
    checked: boolean;
    disabled: boolean;
    required: boolean;
    label: string;
    description: string;
    id: string;
    name: string;
    value: string;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    setCustomValidity(message: string): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    private _handleChange;
    private _handleFocus;
    private _handleBlur;
    private _handleKeydown;
    private _handleSubmitForm;
    render(): import("lit-html").TemplateResult<1>;
}
