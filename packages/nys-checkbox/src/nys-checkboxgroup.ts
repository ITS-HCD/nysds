import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./nys-checkbox.styles";
import { FormControlController } from "@nys-excelsior/components/form-controller";

let checkboxgroupIdCounter = 0; // Counter for generating unique IDs

@customElement("nys-checkboxgroup")
export class NysCheckboxgroup extends LitElement {
	// The form controls will automatically append the component's values to the FormData object that’s used to submit the form.
	private readonly formControlController = new FormControlController(this, {
		form: () => (this.form ? (document.getElementById(this.form) as HTMLFormElement) : this.closest("form")),
		name: () => this.selectedName,
		value: () => this.selectedValues,
		defaultValue: () => undefined,
		reportValidity: () => this.reportValidity(),
		checkValidity: () => this.checkValidity(),
	});

	@property({ type: String }) id = "";
	// @property({ type: String }) name = "";
	@property({ type: Boolean }) required = false;
	@property({ type: Boolean }) showError = false;
	@property({ type: String }) errorMessage = "";
	@property({ type: String }) label = "";
	@property({ type: String }) description = "";
	@property({ type: String }) form = null;
	// State for storing the selected name and value for form-controller use
	@state() private selectedName: string | null = null;
	@state() private selectedValues: string[] = [];
	private static readonly VALID_SIZES = ["sm", "md"] as const;
	private _size: (typeof NysCheckboxgroup.VALID_SIZES)[number] = "md";

	// Getter and setter for the `size` property.
	@property({ reflect: true })
	get size(): (typeof NysCheckboxgroup.VALID_SIZES)[number] {
		return this._size;
	}

	set size(value: string) {
		// Check if the provided value is in VALID_WIDTHS. If not, default to "full".
		this._size = NysCheckboxgroup.VALID_SIZES.includes(value as (typeof NysCheckboxgroup.VALID_SIZES)[number]) ? (value as (typeof NysCheckboxgroup.VALID_SIZES)[number]) : "md";
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

	// Get validity by aggregating the state of the checkbox
	get validity() {
		const checkboxes = this.querySelectorAll("nys-checkbox");
		if (this.required) {
			// Ensure at least one radio button is checked
			const isValid = Array.from(checkboxes).some((checkbox: any) => {
				const input = checkbox.shadowRoot?.querySelector("input");
				return input?.checked ?? false;
			});
			return { valid: isValid };
		}
		return { valid: true };
	}

	// Gets the associated form, if one exists.
	getForm(): HTMLFormElement | null {
		return this.formControlController.getForm();
	}

	// Set the form control custom validity message
	setCustomValidity(message: string) {
		const checkbox = this.querySelector("nys-checkbox");
		if (checkbox) {
			// Find the input inside the checkbox
			const input = checkbox.shadowRoot?.querySelector("input");

			if (input) {
				input.setCustomValidity(message);
				this.formControlController.updateValidity();
			}
		}
	}

	// Check the form control validity
	checkValidity(): boolean {
		const checkboxes = this.querySelectorAll("nys-checkbox");

		if (this.required) {
			// Check if at least one radiobutton is selected
			const isValid = Array.from(checkboxes).some((checkbox) => {
				const input = checkbox.shadowRoot?.querySelector("input");
				return input?.checked;
			});

			if (!isValid) {
				return false;
			}
		}
		return true;
	}

	// Report the form control validity
	reportValidity(): boolean {
		const checkboxes = this.querySelectorAll("nys-checkbox");

		if (this.required) {
			// Check if at least one radiobutton is selected
			const isValid = Array.from(checkboxes).some((checkbox) => {
				const input = checkbox.shadowRoot?.querySelector("input");
				return input?.checked;
			});

			if (!isValid) {
				// Set the error state and custom error message
				this.showError = true;
				this.errorMessage = "Please select an option.";

				// Call native error message to appear on the first checkbox in the checkbox group
				const firstCheckbox = checkboxes[0];
				if (firstCheckbox) {
					const input = firstCheckbox.shadowRoot?.querySelector("input");
					if (input) {
						input.setCustomValidity(this.errorMessage);
						input.reportValidity();
					}
				}

				return false;
			} else {
				// Clear error state if valid
				this.showError = false;
				this.errorMessage = "";

				// Clear error message on all radiobutton in the group
				checkboxes.forEach((checkbox) => {
					const input = checkbox.shadowRoot?.querySelector("input");
					if (input) {
						input.setCustomValidity(""); // Clear custom validity
					}
				});
			}
		}

		// Report validity for all inputs in the group
		let groupValid = true;
		checkboxes.forEach((checkbox) => {
			const input = checkbox.shadowRoot?.querySelector("input");
			if (input) {
				const valid = input.reportValidity();
				groupValid = groupValid && valid;
			}
		});

		return groupValid;
	}

	/******************** Functions ********************/
	// Generate a unique ID if one is not provided
	connectedCallback() {
		super.connectedCallback();
		if (!this.id) {
			this.id = `nys-checkbox-${Date.now()}-${checkboxgroupIdCounter++}`;
		}
		this.addEventListener("change", this._handleCheckboxChange);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("change", this._handleCheckboxChange);
	}

	updated(changedProperties: Map<string | symbol, unknown>) {
		if (changedProperties.has("size")) {
			this.updateCheckboxSize();
		}
	}

	// Updates the selected checkboxes when the slot content changes or is set up initially.
	private handleSlotChange() {
		const checkedCheckboxes = this.querySelectorAll("nys-checkbox[checked]");

		if (checkedCheckboxes.length > 0) {
			checkedCheckboxes.forEach((checkbox) => {
				const input = checkbox.shadowRoot?.querySelector("input");

				if (input) {
					// Update selectedName and selectedValue with the currently checked radio button's values
					this.selectedName = input.name;
					this.selectedValues.push(input.value);
				}
			});
		}
	}

	/**
	 * Updates the checkbox's selected name and value based on the currently selected checkbox.
	 * Clears any error messages displayed if the selection satisfies the required condition.
	 */
	private _handleCheckboxChange(event: Event) {
		const customEvent = event as CustomEvent;
		const { name, value, checked } = customEvent.detail;

		this.selectedName = name;

		// Add or remove the value from selectedValues based on the checkbox's state
		if (checked) {
			if (!this.selectedValues.includes(value)) {
				this.selectedValues.push(value);
			}
		} else {
			this.selectedValues = this.selectedValues.filter((val) => val !== value);
		}

		const isValid = this.checkValidity();

		if (isValid) {
			this.showError = false;
			this.errorMessage = "";

			// Clear custom validity for all radio buttons
			const checkboxes = this.querySelectorAll("nys-checkbox");
			checkboxes.forEach((checkbox) => {
				const input = checkbox.shadowRoot?.querySelector("input");
				if (input) {
					input.setCustomValidity(""); // Clear custom validity
				}
			});
		}
	}

	// Updates the size of each checkbox in the group
	private updateCheckboxSize() {
		const checkboxes = this.querySelectorAll("nys-checkbox");
		checkboxes.forEach((checkbox) => {
			checkbox.setAttribute("size", this.size);
		});
	}

	render() {
		return html` <div class="nys-checkboxgroup">
			${this.label &&
			html` <div class="nys-checkbox__text">
				<div class="nys-checkbox__requiredwrapper">
					<label for=${this.id} class="nys-checkboxgroup__label">${this.label}</label>
					${this.required ? html`<label class="nys-checkbox__required">*</label>` : ""}
				</div>
				<label for=${this.id} class="nys-checkboxgroup__description">
					${this.description}
					<slot name="description"></slot>
				</label>
			</div>`}
			<div class="nys-checkboxgroup__content">
				<slot @slotchange=${this.handleSlotChange}></slot>
			</div>
			${this.showError && this.errorMessage
				? html`<div class="nys-checkbox__error">
						<nys-icon name="error" size="xl"></nys-icon>
						${this.errorMessage}
					</div>`
				: ""}
		</div>`;
	}
}
