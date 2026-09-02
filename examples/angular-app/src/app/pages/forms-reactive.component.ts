import { Component, inject, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from "@angular/forms";
import {
  NysButtonComponent,
  NysCheckboxComponent,
  NysCheckboxgroupComponent,
  NysComboboxComponent,
  NysControlErrorsDirective,
  NysDatepickerComponent,
  NysFileinputComponent,
  NysRadiobuttonComponent,
  NysRadiogroupComponent,
  NysSelectComponent,
  NysTextareaComponent,
  NysTextinputComponent,
  NysToggleComponent,
} from "@nysds/angular";
import {
  countyOptions,
  fileName,
  stateOptions,
  type FormsReadout,
} from "../forms-model";

/**
 * The application form implemented with Reactive Forms. Validation is
 * framework-owned: `Validators.required` on firstName, surfaced through
 * the `nysControlErrors` directive.
 */
@Component({
  selector: "app-forms-reactive",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NysButtonComponent,
    NysCheckboxComponent,
    NysCheckboxgroupComponent,
    NysComboboxComponent,
    NysControlErrorsDirective,
    NysDatepickerComponent,
    NysFileinputComponent,
    NysRadiobuttonComponent,
    NysRadiogroupComponent,
    NysSelectComponent,
    NysTextareaComponent,
    NysTextinputComponent,
    NysToggleComponent,
  ],
  template: `
    <main>
      <h1>Forms: reactive</h1>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <nys-textinput
          label="First name"
          name="firstName"
          data-field="firstName"
          formControlName="firstName"
          nysControlErrors
        ></nys-textinput>
        <nys-textarea
          label="Bio"
          name="bio"
          data-field="bio"
          formControlName="bio"
        ></nys-textarea>
        <nys-select
          label="State"
          name="state"
          data-field="state"
          formControlName="state"
        >
          @for (o of stateOptions; track o.value) {
            <option [value]="o.value">{{ o.label }}</option>
          }
        </nys-select>
        <nys-combobox
          label="County"
          name="county"
          data-field="county"
          formControlName="county"
        >
          @for (o of countyOptions; track o.value) {
            <option [value]="o.value">{{ o.label }}</option>
          }
        </nys-combobox>
        <nys-datepicker
          label="Date of birth"
          name="dob"
          data-field="dob"
          formControlName="dob"
        ></nys-datepicker>
        <nys-checkbox
          label="I agree to the terms"
          name="agree"
          data-field="agree"
          value="yes"
          formControlName="agree"
        ></nys-checkbox>
        <nys-checkboxgroup
          label="Languages"
          name="languages"
          formControlName="languages"
        >
          <nys-checkbox label="English" value="en"></nys-checkbox>
          <nys-checkbox label="Spanish" value="es"></nys-checkbox>
        </nys-checkboxgroup>
        <nys-radiogroup
          label="Preferred contact method"
          name="contact"
          formControlName="contact"
        >
          <nys-radiobutton
            label="Email"
            name="contact"
            value="email"
          ></nys-radiobutton>
          <nys-radiobutton
            label="Phone"
            name="contact"
            value="phone"
          ></nys-radiobutton>
        </nys-radiogroup>
        <nys-toggle
          label="Subscribe to the newsletter"
          name="newsletter"
          data-field="newsletter"
          formControlName="newsletter"
        ></nys-toggle>
        <nys-fileinput
          label="Resume"
          name="resume"
          data-field="resume"
          formControlName="resume"
        ></nys-fileinput>

        <nys-button
          type="submit"
          label="Submit"
          data-testid="submit"
        ></nys-button>
        <button type="button" data-testid="reset" (click)="reset()">
          Reset
        </button>
        <button
          type="button"
          data-testid="toggle-disabled"
          (click)="toggleDisabled()"
        >
          Toggle first name disabled
        </button>
      </form>

      <h2>Live model</h2>
      <pre data-testid="model">{{ model() | json }}</pre>
      <h2>Submitted</h2>
      <pre data-testid="submitted">{{ submitted() ? (submitted() | json) : "" }}</pre>
    </main>
  `,
})
export class FormsReactiveComponent {
  private fb = inject(NonNullableFormBuilder);
  readonly stateOptions = stateOptions;
  readonly countyOptions = countyOptions;

  readonly form = this.fb.group({
    firstName: this.fb.control("", Validators.required),
    bio: "",
    state: "",
    county: "",
    dob: "",
    agree: false,
    languages: this.fb.control<string[]>([]),
    contact: "",
    newsletter: false,
    resume: new FormControl<FileList | null>(null),
  });

  readonly model = signal<FormsReadout>(this.readout());
  readonly submitted = signal<FormsReadout | null>(null);

  constructor() {
    this.form.valueChanges.subscribe(() => this.model.set(this.readout()));
  }

  private readout(): FormsReadout {
    const v = this.form.getRawValue();
    return { ...v, resume: fileName(v.resume) };
  }

  submit(): void {
    if (this.form.invalid) {
      // Surfaces errors through nysControlErrors (touched + invalid).
      // updateValueAndValidity re-emits statusChanges so the directive
      // re-evaluates after the touched flip.
      this.form.markAllAsTouched();
      this.form.controls.firstName.updateValueAndValidity();
      this.model.set(this.readout());
      return;
    }
    this.submitted.set(this.readout());
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(null);
    this.model.set(this.readout());
  }

  toggleDisabled(): void {
    const control = this.form.controls.firstName;
    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
    this.model.set(this.readout());
  }
}
