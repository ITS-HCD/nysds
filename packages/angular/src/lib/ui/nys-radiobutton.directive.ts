import { Directive } from '@angular/core';

// TODO(task-7): registered alongside `nys-radiogroup` via `@nysds/nys-radiobutton`.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/**
 * Wrapper directive for `<nys-radiobutton>`.
 *
 * The form value is bound on the parent `<nys-radiogroup>` (see
 * `NysRadiogroupDirective`); individual radios are children.
 */
@Directive({
  selector: 'nys-radiobutton',
  standalone: true,
})
export class NysRadiobuttonDirective {}
