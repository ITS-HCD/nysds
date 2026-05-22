import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-accordion';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-accordion>`. */
@Directive({
  selector: 'nys-accordion',
  standalone: true,
})
export class NysAccordionDirective {}
