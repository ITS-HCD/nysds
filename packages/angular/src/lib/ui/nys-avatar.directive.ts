import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-avatar';` once component dist exists.
// TODO(task-8): generator populates typed @Input()s/@Output()s from the CEM.

/** Wrapper directive for `<nys-avatar>`. */
@Directive({
  selector: 'nys-avatar',
  standalone: true,
})
export class NysAvatarDirective {}
