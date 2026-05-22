import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-stepper';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-stepper>`. */
@Directive({
  selector: 'nys-stepper',
  standalone: true,
})
export class NysStepperDirective {}
