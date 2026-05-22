import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-divider';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-divider>`. */
@Directive({
  selector: 'nys-divider',
  standalone: true,
})
export class NysDividerDirective {}
