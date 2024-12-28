import { LitElement } from "lit";
export declare class NysRadiobutton extends LitElement {
    checked: boolean;
    disabled: boolean;
    required: boolean;
    label: string;
    description: string;
    id: string;
    name: string;
    value: string;
    static buttonGroup: Record<string, NysRadiobutton>;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    private _handleChange;
    private _handleFocus;
    private _handleBlur;
    private _handleKeydown;
    private _handleClick;
    private _handleSubmitForm;
    render(): import("lit-html").TemplateResult<1>;
}
