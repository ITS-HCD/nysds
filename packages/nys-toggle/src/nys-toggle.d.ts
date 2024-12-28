import { LitElement } from "lit";
import "@nys-excelsior/nys-icon";
export declare class NysToggle extends LitElement {
    private readonly formControlController;
    static styles: import("lit").CSSResult;
    /********************** Properties **********************/
    id: string;
    name: string;
    value: string;
    checked: boolean;
    disabled: boolean;
    required: boolean;
    noIcon: boolean;
    label: string;
    description: string;
    private static readonly VALID_SIZES;
    private _size;
    get size(): (typeof NysToggle.VALID_SIZES)[number];
    set size(value: string);
    form: string;
    /******************** Functions ********************/
    connectedCallback(): void;
    setCustomValidity(message: string): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    private _handleFocus;
    private _handleBlur;
    private _handleChange;
    private _handleKeyDown;
    private _handleSubmitForm;
    render(): import("lit-html").TemplateResult<1>;
}
