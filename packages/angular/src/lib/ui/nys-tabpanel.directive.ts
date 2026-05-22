import { Directive } from '@angular/core';

// TODO(task-7): registered alongside `nys-tabgroup` via `@nysds/nys-tab`.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-tabpanel>` (paired with `<nys-tab>`). */
@Directive({
  selector: 'nys-tabpanel',
  standalone: true,
})
export class NysTabpanelDirective {}
