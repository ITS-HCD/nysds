import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-globalfooter';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-globalfooter>`. */
@Directive({
  selector: 'nys-globalfooter',
  standalone: true,
})
export class NysGlobalfooterDirective {}
