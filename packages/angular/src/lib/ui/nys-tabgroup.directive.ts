import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-tab';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-tabgroup>`. */
@Directive({
  selector: 'nys-tabgroup',
  standalone: true,
})
export class NysTabgroupDirective {}
