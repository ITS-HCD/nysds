import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-video';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-video>`. */
@Directive({
  selector: 'nys-video',
  standalone: true,
})
export class NysVideoDirective {}
