import { Directive } from '@angular/core';

// TODO(task-7): add `import '@nysds/nys-dropdownmenu';` (registers both
// `nys-dropdownmenu` and `nys-dropdownmenuitem`) once component dist exists.

/**
 * Wrapper directive for `<nys-dropdownmenu>`.
 *
 * Like `<nys-tooltip>`, the dropdown trigger is referenced via
 * `for="triggerId"`. Make sure the trigger renders a stable `id` attribute.
 *
 * TODO(task-8): generator will populate typed @Input()s/@Output()s.
 */
@Directive({
  selector: 'nys-dropdownmenu',
  standalone: true,
})
export class NysDropdownmenuDirective {}
