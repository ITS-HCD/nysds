import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import {
  NysButtonComponent,
  NysCheckboxComponent,
  NysCheckboxgroupComponent,
  NysComboboxComponent,
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
 * The application form implemented with template-driven forms:
 * `[(ngModel)]` two-way bindings to signals, `required` participating in
 * NgForm validity.
 */
@Component({
  selector: "app-forms-template",
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    NysButtonComponent,
    NysCheckboxComponent,
    NysCheckboxgroupComponent,
    NysComboboxComponent,
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
      <h1>Forms: template-driven</h1>

      <form #f="ngForm" (ngSubmit)="submit(f.valid)">
        <nys-textinput
          label="First name"
          name="firstName"
          data-field="firstName"
          required
          [disabled]="firstNameDisabled()"
          [showError]="showFirstNameError()"
          [errorMessage]="showFirstNameError() ? 'Enter your first name' : ''"
          [(ngModel)]="firstName"
        ></nys-textinput>
        <nys-textarea
          label="Bio"
          name="bio"
          data-field="bio"
          [(ngModel)]="bio"
        ></nys-textarea>
        <nys-select
          label="State"
          name="state"
          data-field="state"
          [(ngModel)]="state"
        >
          @for (o of stateOptions; track o.value) {
            <option [value]="o.value">{{ o.label }}</option>
          }
        </nys-select>
        <nys-combobox
          label="County"
          name="county"
          data-field="county"
          [(ngModel)]="county"
        >
          @for (o of countyOptions; track o.value) {
            <option [value]="o.value">{{ o.label }}</option>
          }
        </nys-combobox>
        <nys-datepicker
          label="Date of birth"
          name="dob"
          data-field="dob"
          [(ngModel)]="dob"
        ></nys-datepicker>
        <nys-checkbox
          label="I agree to the terms"
          name="agree"
          data-field="agree"
          value="yes"
          [(ngModel)]="agree"
        ></nys-checkbox>
        <nys-checkboxgroup
          label="Languages"
          name="languages"
          [(ngModel)]="languages"
        >
          <nys-checkbox label="English" value="en"></nys-checkbox>
          <nys-checkbox label="Spanish" value="es"></nys-checkbox>
        </nys-checkboxgroup>
        <nys-radiogroup
          label="Preferred contact method"
          name="contact"
          [(ngModel)]="contact"
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
          [(ngModel)]="newsletter"
        ></nys-toggle>
        <nys-fileinput
          label="Resume"
          name="resume"
          data-field="resume"
          [(ngModel)]="resume"
        ></nys-fileinput>

        <nys-button
          type="submit"
          label="Submit"
          data-testid="submit"
        ></nys-button>
        <button type="button" data-testid="reset" (click)="reset(f)">
          Reset
        </button>
        <button
          type="button"
          data-testid="toggle-disabled"
          (click)="firstNameDisabled.set(!firstNameDisabled())"
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
export class FormsTemplateComponent {
  readonly stateOptions = stateOptions;
  readonly countyOptions = countyOptions;

  readonly firstName = signal("");
  readonly bio = signal("");
  readonly state = signal("");
  readonly county = signal("");
  readonly dob = signal("");
  readonly agree = signal(false);
  readonly languages = signal<string[]>([]);
  readonly contact = signal("");
  readonly newsletter = signal(false);
  readonly resume = signal<FileList | null>(null);

  readonly firstNameDisabled = signal(false);
  readonly showFirstNameError = signal(false);
  readonly submitted = signal<FormsReadout | null>(null);

  readonly model = computed<FormsReadout>(() => ({
    firstName: this.firstName(),
    bio: this.bio(),
    state: this.state(),
    county: this.county(),
    dob: this.dob(),
    agree: this.agree(),
    languages: this.languages(),
    contact: this.contact(),
    newsletter: this.newsletter(),
    resume: fileName(this.resume()),
  }));

  submit(valid: boolean | null): void {
    if (!valid) {
      this.showFirstNameError.set(true);
      return;
    }
    this.showFirstNameError.set(false);
    this.submitted.set(this.model());
  }

  reset(f: { resetForm: () => void }): void {
    f.resetForm();
    this.firstName.set("");
    this.bio.set("");
    this.state.set("");
    this.county.set("");
    this.dob.set("");
    this.agree.set(false);
    this.languages.set([]);
    this.contact.set("");
    this.newsletter.set(false);
    this.resume.set(null);
    this.showFirstNameError.set(false);
    this.submitted.set(null);
  }
}
