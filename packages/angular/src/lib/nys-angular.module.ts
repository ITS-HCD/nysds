import { NgModule } from '@angular/core';

import { NysCheckboxDirective } from './form/nys-checkbox.directive';
import { NysCheckboxgroupDirective } from './form/nys-checkboxgroup.directive';
import { NysComboboxDirective } from './form/nys-combobox.directive';
import { NysDatepickerDirective } from './form/nys-datepicker.directive';
import { NysFileinputDirective } from './form/nys-fileinput.directive';
import { NysRadiogroupDirective } from './form/nys-radiogroup.directive';
import { NysSelectDirective } from './form/nys-select.directive';
import { NysTextareaDirective } from './form/nys-textarea.directive';
import { NysTextinputDirective } from './form/nys-textinput.directive';
import { NysToggleDirective } from './form/nys-toggle.directive';

import { NysAccordionDirective } from './ui/nys-accordion.directive';
import { NysAccordionitemDirective } from './ui/nys-accordionitem.directive';
import { NysAlertDirective } from './ui/nys-alert.directive';
import { NysAvatarDirective } from './ui/nys-avatar.directive';
import { NysBacktotopDirective } from './ui/nys-backtotop.directive';
import { NysBadgeDirective } from './ui/nys-badge.directive';
import { NysBreadcrumbsDirective } from './ui/nys-breadcrumbs.directive';
import { NysButtonDirective } from './ui/nys-button.directive';
import { NysDividerDirective } from './ui/nys-divider.directive';
import { NysDropdownmenuDirective } from './ui/nys-dropdownmenu.directive';
import { NysDropdownmenuitemDirective } from './ui/nys-dropdownmenuitem.directive';
import { NysGlobalfooterDirective } from './ui/nys-globalfooter.directive';
import { NysGlobalheaderDirective } from './ui/nys-globalheader.directive';
import { NysIconDirective } from './ui/nys-icon.directive';
import { NysModalDirective } from './ui/nys-modal.directive';
import { NysPaginationDirective } from './ui/nys-pagination.directive';
import { NysRadiobuttonDirective } from './ui/nys-radiobutton.directive';
import { NysSkipnavDirective } from './ui/nys-skipnav.directive';
import { NysStepDirective } from './ui/nys-step.directive';
import { NysStepperDirective } from './ui/nys-stepper.directive';
import { NysTabDirective } from './ui/nys-tab.directive';
import { NysTabgroupDirective } from './ui/nys-tabgroup.directive';
import { NysTabpanelDirective } from './ui/nys-tabpanel.directive';
import { NysTableDirective } from './ui/nys-table.directive';
import { NysTooltipDirective } from './ui/nys-tooltip.directive';
import { NysUnavfooterDirective } from './ui/nys-unavfooter.directive';
import { NysUnavheaderDirective } from './ui/nys-unavheader.directive';
import { NysVideoDirective } from './ui/nys-video.directive';

/**
 * Every standalone NYSDS directive in declaration order.
 *
 * Useful for consumers who want to spread the full set into a standalone
 * component's `imports` array without enumerating each directive:
 *
 * @example
 * ```ts
 * @Component({
 *   standalone: true,
 *   schemas: [CUSTOM_ELEMENTS_SCHEMA],
 *   imports: [...NYS_DIRECTIVES, FormsModule],
 *   template: `...`,
 * })
 * export class MyComponent {}
 * ```
 */
export const NYS_DIRECTIVES = [
  // Form (ControlValueAccessor)
  NysCheckboxDirective,
  NysCheckboxgroupDirective,
  NysComboboxDirective,
  NysDatepickerDirective,
  NysFileinputDirective,
  NysRadiogroupDirective,
  NysSelectDirective,
  NysTextareaDirective,
  NysTextinputDirective,
  NysToggleDirective,
  // UI wrappers
  NysAccordionDirective,
  NysAccordionitemDirective,
  NysAlertDirective,
  NysAvatarDirective,
  NysBacktotopDirective,
  NysBadgeDirective,
  NysBreadcrumbsDirective,
  NysButtonDirective,
  NysDividerDirective,
  NysDropdownmenuDirective,
  NysDropdownmenuitemDirective,
  NysGlobalfooterDirective,
  NysGlobalheaderDirective,
  NysIconDirective,
  NysModalDirective,
  NysPaginationDirective,
  NysRadiobuttonDirective,
  NysSkipnavDirective,
  NysStepDirective,
  NysStepperDirective,
  NysTabDirective,
  NysTabgroupDirective,
  NysTabpanelDirective,
  NysTableDirective,
  NysTooltipDirective,
  NysUnavfooterDirective,
  NysUnavheaderDirective,
  NysVideoDirective,
] as const;

/**
 * Convenience `NgModule` that imports and re-exports every NYSDS directive.
 *
 * Standalone components are preferred, but legacy NgModule-based apps can add
 * `NysAngularModule` to their module `imports` to register the full directive
 * set in one line. Consumers must still add `CUSTOM_ELEMENTS_SCHEMA` to
 * components that render `nys-*` tags.
 *
 * @example
 * ```ts
 * @NgModule({
 *   imports: [NysAngularModule, FormsModule],
 *   declarations: [AppComponent],
 *   schemas: [CUSTOM_ELEMENTS_SCHEMA],
 *   bootstrap: [AppComponent],
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({
  imports: [...NYS_DIRECTIVES],
  exports: [...NYS_DIRECTIVES],
})
export class NysAngularModule {}
