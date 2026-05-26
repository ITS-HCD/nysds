import { Directive } from '@angular/core';


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
