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
    <h1>Forms: template-driven</h1>
    <p>
      The shared application form with <code>[(ngModel)]</code> two-way
      bindings to signals and native form validation.
    </p>

    <div class="nys-grid-row">
      <section class="nys-grid-col-12 nys-desktop:nys-grid-col-8">
        <h2>Application form</h2>
        <form
          #f="ngForm"
          class="nys-display-flex nys-flex-column nys-flex-gap-300"
          (ngSubmit)="submit(f.valid)"
        >
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

          <div
            class="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200"
          >
            <nys-button
              type="submit"
              label="Submit"
              data-testid="submit"
            ></nys-button>
            <button
              type="button"
              class="app-action"
              data-testid="reset"
              (click)="reset(f)"
            >
              Reset
            </button>
            <button
              type="button"
              class="app-action"
              data-testid="toggle-disabled"
              (click)="firstNameDisabled.set(!firstNameDisabled())"
            >
              Toggle first name disabled
            </button>
          </div>
        </form>
      </section>
    </div>

    <div class="nys-grid-row nys-grid-gap-400">
      <section class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
        <h2>Live model</h2>
        <pre class="app-readout" data-testid="model">{{ model() | json }}</pre>
      </section>
      <section class="nys-grid-col-12 nys-tablet:nys-grid-col-6">
        <h2>Submitted</h2>
        <pre class="app-readout" data-testid="submitted">{{ submitted() ? (submitted() | json) : "" }}</pre>
      </section>
    </div>
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
