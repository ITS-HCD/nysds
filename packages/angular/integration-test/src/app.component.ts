import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  NysAlertDirective,
  NysButtonDirective,
  NysModalDirective,
  NysTextinputDirective,
} from '@nysds/angular';

/**
 * Smoke-test app for `@nysds/angular`.
 *
 * Covers the three integration surfaces the Playwright spec exercises:
 *   1. `ngModel` round-trip through `NysTextinputDirective` (Control­ValueAccessor).
 *   2. Typed event emission through `NysAlertDirective`'s `(nysClose)` output.
 *   3. Two-way binding on `NysModalDirective`'s `[(open)]`.
 *
 * Everything is intentionally minimal — this harness exists to prove the
 * library wires correctly inside a real Angular standalone app, not to
 * demonstrate every directive.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    NysAlertDirective,
    NysButtonDirective,
    NysModalDirective,
    NysTextinputDirective,
  ],
  template: `
    <main style="padding: 2rem; font-family: system-ui;">
      <h1>@nysds/angular smoke test</h1>

      <!-- (1) ngModel round-trip -->
      <section data-testid="form-section">
        <h2>Form value round-trip</h2>
        <nys-textinput
          label="Full name"
          name="fullName"
          [(ngModel)]="name"
          data-testid="name-input"
        ></nys-textinput>
        <p>
          Angular sees:
          <code data-testid="name-output">{{ name() || '(empty)' }}</code>
        </p>
      </section>

      <!-- (2) Typed event emission -->
      <section data-testid="alert-section">
        <h2>Event emission</h2>
        @if (showAlert()) {
          <nys-alert
            type="info"
            heading="Alert"
            text="Dismiss me to test the (nysClose) output."
            dismissible
            (nysClose)="onAlertClose($event)"
            data-testid="alert"
          ></nys-alert>
        } @else {
          <p data-testid="alert-closed">Alert closed at: {{ closedAt() }}</p>
        }
      </section>

      <!-- (3) Two-way [(open)] -->
      <section data-testid="modal-section">
        <h2>Two-way modal binding</h2>
        <nys-button label="Open modal" (click)="modalOpen.set(true)" data-testid="modal-trigger"></nys-button>
        <p>Modal open: <code data-testid="modal-state">{{ modalOpen() }}</code></p>
        <nys-modal
          [(open)]="modalOpenValue"
          modalTitle="Smoke test modal"
          data-testid="modal"
        >
          <p>Press escape to close.</p>
        </nys-modal>
      </section>
    </main>
  `,
})
export class AppComponent {
  readonly name = signal('');
  readonly showAlert = signal(true);
  readonly closedAt = signal<string>('');
  readonly modalOpen = signal(false);

  // Bridge for [(open)] — Angular template needs a getter/setter pair for signals,
  // or a plain property. Using a plain getter/setter pair to keep the template
  // ergonomic.
  get modalOpenValue(): boolean {
    return this.modalOpen();
  }
  set modalOpenValue(value: boolean) {
    this.modalOpen.set(value);
  }

  onAlertClose(event: CustomEvent): void {
    this.showAlert.set(false);
    this.closedAt.set(new Date().toISOString());
    // Surface the detail in the console so devs can confirm the typed payload.
    // eslint-disable-next-line no-console
    console.log('nys-close detail:', event.detail);
  }
}
