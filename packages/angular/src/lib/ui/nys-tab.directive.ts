import { Directive } from '@angular/core';

// TODO(task-7): registered alongside `nys-tabgroup` via `@nysds/nys-tab`.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-tab>` (child of `<nys-tabgroup>`). */
@Directive({
  selector: 'nys-tab',
  standalone: true,
})
export class NysTabDirective {}
