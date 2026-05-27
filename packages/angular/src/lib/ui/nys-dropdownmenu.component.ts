import { Component } from '@angular/core';

/**
 * Wrapper component for `<nys-dropdownmenu>`.
 *
 * Like `<nys-tooltip>`, the dropdown trigger is referenced via
 * `for="triggerId"`. Make sure the trigger renders a stable `id` attribute.
 */
@Component({
  selector: 'nys-dropdownmenu',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class NysDropdownmenuComponent {}
