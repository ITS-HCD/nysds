import { Directive } from '@angular/core';

// TODO(task-7): registered alongside `nys-stepper` via `@nysds/nys-stepper`.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-step>` (child of `<nys-stepper>`). */
@Directive({
  selector: 'nys-step',
  standalone: true,
})
export class NysStepDirective {}
