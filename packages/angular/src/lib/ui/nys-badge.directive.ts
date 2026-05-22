import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-badge';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-badge>`. */
@Directive({
  selector: 'nys-badge',
  standalone: true,
})
export class NysBadgeDirective {}
