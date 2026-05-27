import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  NysButtonComponent,
  NysRadiobuttonComponent,
  NysRadiogroupComponent,
  NysTextinputComponent,
} from '@nysds/angular';

interface SignupForm {
  name: string;
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

/**
 * Demo app showing `@nysds/angular` wrappers wired into `ReactiveFormsModule`.
 *
 * Three fields:
 *   1. Name        (`<nys-textinput>` + required validator)
 *   2. Email       (`<nys-textinput type="email">` + required + email validator)
 *   3. Frequency   (`<nys-radiogroup>` with three `<nys-radiobutton>` children)
 *
 * Submitting prints the typed form value into the result panel.
 *
 * Note: no `CUSTOM_ELEMENTS_SCHEMA` is needed. Each `<nys-*>` tag in the
 * template below is matched by an Angular Component from `@nysds/angular`,
 * so the template type checker is fully satisfied.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NysButtonComponent,
    NysRadiobuttonComponent,
    NysRadiogroupComponent,
    NysTextinputComponent,
  ],
  template: `
    <h1>Newsletter signup</h1>
    <p class="meta">
      All three fields below are NYSDS web components wrapped by
      <code>@nysds/angular</code> components — Angular's
      <code>ReactiveFormsModule</code> handles validation and state.
    </p>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
      <nys-textinput
        label="Full name"
        name="name"
        autocomplete="name"
        required
        formControlName="name"
      ></nys-textinput>

      <nys-textinput
        label="Email address"
        name="email"
        type="email"
        autocomplete="email"
        required
        formControlName="email"
      ></nys-textinput>

      <nys-radiogroup
        label="Email frequency"
        name="frequency"
        formControlName="frequency"
      >
        <nys-radiobutton label="Daily" value="daily"></nys-radiobutton>
        <nys-radiobutton label="Weekly" value="weekly"></nys-radiobutton>
        <nys-radiobutton label="Monthly" value="monthly"></nys-radiobutton>
      </nys-radiogroup>

      <div class="submit-row">
        <nys-button
          type="submit"
          label="Subscribe"
          variant="filled"
          [disabled]="form.invalid"
        ></nys-button>
      </div>
    </form>

    @if (submitted()) {
      <div class="result" data-testid="submit-result">
        <strong>Form submitted ✓</strong>
        <p class="meta">
          The block below is the typed value pulled from
          <code>form.value</code>.
        </p>
        <pre>{{ result() }}</pre>
      </div>
    }

    <p class="meta">
      Form status: <code>{{ form.status }}</code>
      &nbsp;·&nbsp; valid: <code>{{ form.valid }}</code>
      &nbsp;·&nbsp; dirty: <code>{{ form.dirty }}</code>
    </p>
  `,
})
export class AppComponent {
  private readonly fb = new FormBuilder().nonNullable;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    frequency: ['weekly' as SignupForm['frequency'], Validators.required],
  });

  readonly submitted = signal(false);
  readonly result = signal('');

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as SignupForm;
    this.submitted.set(true);
    this.result.set(JSON.stringify(value, null, 2));
    // eslint-disable-next-line no-console
    console.log('signup submitted:', value);
  }
}
