import { Component, computed, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";
// Signal Forms shipped experimental in Angular 21. This file is only
// compiled when the installed Angular major is >= 21 — the barrel
// (index.ts, written by scripts/sync-signal-forms.mjs) points at the
// fallback page on Angular 20.
// eslint-disable-next-line import/no-unresolved
import { form, FormField } from "@angular/forms/signals";
import {
  NysButtonComponent,
  NysCheckboxComponent,
  NysRadiobuttonComponent,
  NysRadiogroupComponent,
  NysTextinputComponent,
} from "@nysds/angular";

interface SignalModel {
  firstName: string;
  agree: boolean;
  contact: string;
}

const initial: SignalModel = { firstName: "", agree: false, contact: "" };

/**
 * A reduced application form bound through Signal Forms' `[formField]`
 * directive, which drives the components' ControlValueAccessor
 * implementations. The smoke tests run the reduced forms suite here.
 *
 * The `$any()` casts work around a typing gap: FormField auto-binds
 * field metadata to inputs named `min`/`max`, and NysTextinput types
 * those as `number | null` while the directive provides
 * `number | undefined`. Runtime behavior is unaffected. Remove the
 * casts when WS4 widens those input types.
 */
@Component({
  selector: "app-signal-forms",
  standalone: true,
  imports: [
    FormField,
    JsonPipe,
    NysButtonComponent,
    NysCheckboxComponent,
    NysRadiobuttonComponent,
    NysRadiogroupComponent,
    NysTextinputComponent,
  ],
  template: `
    <h1>Forms: Signal Forms</h1>
    <p>
      A reduced application form with Signal Forms
      <code>[formField]</code> bindings (Angular 21+).
    </p>

    <div class="nys-grid-row">
      <section class="nys-grid-col-12 nys-desktop:nys-grid-col-8">
        <h2>Application form</h2>
        <!--
          The submit button uses (nysClick), not type="submit": FormField
          auto-binds empty PATTERN metadata into NysTextinput's string
          "pattern" input, which leaves the element's ElementInternals
          invalid and silently blocks form.requestSubmit(). Reported as a
          Signal Forms interop defect against @nysds/angular.
        -->
        <form
          class="nys-display-flex nys-flex-column nys-flex-gap-300"
          (submit)="$event.preventDefault(); submit()"
        >
        <nys-textinput
          label="First name"
          name="firstName"
          data-field="firstName"
          [showError]="showFirstNameError()"
          [errorMessage]="showFirstNameError() ? 'Enter your first name' : ''"
          [formField]="$any(f.firstName)"
        ></nys-textinput>
        <nys-checkbox
          label="I agree to the terms"
          name="agree"
          data-field="agree"
          value="yes"
          [formField]="$any(f.agree)"
        ></nys-checkbox>
        <nys-radiogroup
          label="Preferred contact method"
          name="contact"
          [formField]="$any(f.contact)"
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

          <div
            class="nys-display-flex nys-flex-wrap nys-flex-align-center nys-flex-gap-200 nys-margin-t-200"
          >
            <nys-button
              type="button"
              label="Submit"
              data-testid="submit"
              (nysClick)="submit()"
            ></nys-button>
            <button
              type="button"
              class="app-action"
              data-testid="reset"
              (click)="reset()"
            >
              Reset
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
export class SignalFormsPage {
  readonly model = signal<SignalModel>({ ...initial });
  readonly f = form(this.model);
  readonly submitted = signal<SignalModel | null>(null);
  readonly showFirstNameError = signal(false);

  readonly modelJson = computed(() => JSON.stringify(this.model(), null, 2));

  submit(): void {
    if (!this.model().firstName) {
      this.showFirstNameError.set(true);
      return;
    }
    this.showFirstNameError.set(false);
    this.submitted.set(this.model());
  }

  reset(): void {
    this.model.set({ ...initial });
    this.showFirstNameError.set(false);
    this.submitted.set(null);
  }
}
