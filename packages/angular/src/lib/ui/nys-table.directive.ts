import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-table';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-table>`. */
@Directive({
  selector: 'nys-table',
  standalone: true,
})
export class NysTableDirective {}
