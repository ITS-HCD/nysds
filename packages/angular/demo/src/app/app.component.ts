import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { NYSDS_COMPONENTS } from "@nysds/angular";

@Component({
  selector: "app-root",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, ...NYSDS_COMPONENTS],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  readonly modalOpen = signal(false);
  readonly toggleOn = signal(true);
  readonly page = signal(3);
  readonly eventLog = signal<string[]>([]);

  // Template-driven forms ([(ngModel)]) — exercised by the CVA wrappers.
  firstName = "";
  contactMethod = "email";
  favoriteTrail = "";

  // Reactive form — same CVA path via formControlName.
  private readonly fb = new FormBuilder();
  readonly permitForm = this.fb.group({
    applicant: ["", Validators.required],
    county: ["albany"],
    startDate: [""],
    notes: [""],
    contact: ["email"],
    subscribed: [true],
    terms: [false, Validators.requiredTrue],
  });

  readonly submittedValue = signal<string | null>(null);

  log(message: string): void {
    this.eventLog.update((entries) => [message, ...entries].slice(0, 5));
  }

  onPageChange(event: CustomEvent): void {
    const detail = event.detail as
      | { page?: number; currentPage?: number }
      | undefined;
    const next = detail?.page ?? detail?.currentPage;
    if (typeof next === "number") {
      this.page.set(next);
    }
    this.log(`nys-change: pagination → ${JSON.stringify(detail)}`);
  }

  submitPermitForm(): void {
    if (this.permitForm.invalid) {
      this.permitForm.markAllAsTouched();
      this.submittedValue.set(
        "Form invalid — applicant is required and terms must be accepted.",
      );
      return;
    }
    this.submittedValue.set(JSON.stringify(this.permitForm.value, null, 2));
  }
}
