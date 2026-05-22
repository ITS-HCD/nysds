import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-icon';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-icon>`. */
@Directive({
  selector: 'nys-icon',
  standalone: true,
})
export class NysIconDirective {}
