import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./nys-textarea.styles";
import "@nys-excelsior/nys-icon";
import { FormControlController } from "@nys-excelsior/components/form-controller";

let textareaIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-textarea")
export class NysTextarea extends LitElement {
	// The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
	private readonly formControlController = new FormControlController(this, {
		form: () => (this.form ? (document.getElementById(this.form) as HTMLFormElement) : this.closest("form")),
		value: () => this.value,
		defaultValue: () => "",
		reportValidity: () => this.reportValidity(),
		checkValidity: () => this.checkValidity(),
	});

	@property({ type: String }) id = "";
	@property({ type: String }) name = "";
	@property({ type: String }) label = "";
	@property({ type: String }) description = "";
	@property({ type: String }) placeholder = "";
	@property({ type: String }) value = "";
	@property({ type: Boolean }) disabled = false;
	@property({ type: Boolean }) readonly = false;
	@property({ type: Boolean }) required = false;
	@property({ type: String }) form = null;
	@property({ type: Number }) maxlength = null;
	private static readonly VALID_WIDTHS = ["sm", "md", "lg", "full"] as const;
	@property({ reflect: true })
	width: (typeof NysTextarea.VALID_WIDTHS)[number] = "full";
	@property({ type: Number }) rows = 4;
	private static readonly VALID_RESIZE = ["vertical", "none"] as const;

	// Use `typeof` to dynamically infer the allowed types
	private _resize: (typeof NysTextarea.VALID_RESIZE)[number] = "vertical";

	// Getter and setter for the `resize` property
	@property({ reflect: true })
	get resize(): (typeof NysTextarea.VALID_RESIZE)[number] {
		return this._resize;
	}

	set resize(value: string) {
		this._resize = NysTextarea.VALID_RESIZE.includes(value as (typeof NysTextarea.VALID_RESIZE)[number]) ? (value as (typeof NysTextarea.VALID_RESIZE)[number]) : "vertical";
	}
	@property({ type: Boolean, reflect: true }) showError = false;

	// Gets the validity property
	get validity() {
		const input = this.shadowRoot?.querySelector("input");
		return input ? input.validity : { valid: true };
	}
	@property({ type: String }) errorMessage = "";

	updated(changedProperties: Map<string | number | symbol, unknown>) {
		if (changedProperties.has("width")) {
			this.width = NysTextarea.VALID_WIDTHS.includes(this.width) ? this.width : "full";
		}
		if (changedProperties.has("rows")) {
			this.rows = this.rows ?? 4;
		}
	}

	static styles = styles;

	/********************** Form Control Integration **********************/
	/**
	 * Handles the integration of the component with form behavior.
	 * This includes managing form control state (checked value), validity checks,
	 * and custom validity messages, ensuring the component works
	 * with HTML forms and participates in form submission.
	 */

	// Ensures the form control's validity state is updated after the first render.
	firstUpdated() {
		this.formControlController.updateValidity();
	}

	// Gets the associated form, if one exists.
	getForm(): HTMLFormElement | null {
		return this.formControlController.getForm();
	}

	// Set the form control custom validity message
	setCustomValidity(message: string) {
		const input = this.shadowRoot?.querySelector("input");
		if (input) {
			input.setCustomValidity(message);
			this.formControlController.updateValidity();
		}
	}

	// Check the form control validity
	checkValidity(): boolean {
		const textarea = this.shadowRoot?.querySelector("textarea");
		return textarea ? textarea.checkValidity() : false;
	}

	// Report the form control validity
	reportValidity(): boolean {
		const textarea = this.shadowRoot?.querySelector("textarea");
		return textarea ? textarea.reportValidity() : false;
	}

	/******************** Functions ********************/
	// Generate a unique ID if one is not provided
	connectedCallback() {
		super.connectedCallback();
		if (!this.id) {
			this.id = `nys-textarea-${Date.now()}-${textareaIdCounter++}`;
		}
	}

	// Handle input event to check pattern validity
	private _handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.value = input.value;

		this.dispatchEvent(
			new CustomEvent("input", {
				detail: { value: this.value },
				bubbles: true,
				composed: true,
			})
		);

		this.formControlController.updateValidity();
	}

	// Handle focus event
	private _handleFocus() {
		this.dispatchEvent(new Event("focus"));
	}

	// Handle blur event
	private _handleBlur() {
		this.dispatchEvent(new Event("blur"));
	}

	private _handleChange() {
		this.dispatchEvent(new Event("change"));
	}

	private _handleSelect() {
		this.dispatchEvent(new Event("select"));
	}

	private _handleSelectionChange() {
		this.dispatchEvent(new Event("selectionchange"));
	}

	render() {
		return html`
			<label class="nys-textarea">
				${this.label &&
				html` <div class="nys-textarea__text">
					<div class="nys-textarea__requiredwrapper">
						<label for=${this.id} class="nys-textarea__label">${this.label}</label>
						${this.required ? html`<label class="nys-textarea__required">*</label>` : ""}
					</div>
					<div class="nys-textarea__description">
						${this.description}
						<slot name="description"> </slot>
					</div>
				</div>`}
				<textarea class="nys-textarea__textarea ${this.resize}" name=${this.name} id=${this.id} ?disabled=${this.disabled} ?required=${this.required} ?readonly=${this.readonly} aria-disabled="${this.disabled}" .value=${this.value} placeholder=${this.placeholder} maxlength=${this.maxlength} .rows=${this.rows} form=${this.form} @input=${this._handleInput} @focus="${this._handleFocus}" @blur="${this._handleBlur}" @change="${this._handleChange}" @select="${this._handleSelect}" @selectionchange="${this._handleSelectionChange}"></textarea>
				${this.showError && this.errorMessage
					? html`<div class="nys-textarea__error">
							<nys-icon name="error" size="xl"></nys-icon>
							${this.errorMessage}
						</div>`
					: ""}
			</label>
		`;
	}
}
