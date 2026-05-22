import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-skipnav';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-skipnav>`. */
@Directive({
  selector: 'nys-skipnav',
  standalone: true,
})
export class NysSkipnavDirective {}
