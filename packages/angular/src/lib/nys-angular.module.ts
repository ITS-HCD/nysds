import { NgModule } from '@angular/core';

import { NysCheckboxComponent } from './form/nys-checkbox.directive';
import { NysCheckboxgroupComponent } from './form/nys-checkboxgroup.directive';
import { NysComboboxComponent } from './form/nys-combobox.directive';
import { NysDatepickerComponent } from './form/nys-datepicker.directive';
import { NysFileinputComponent } from './form/nys-fileinput.directive';
import { NysRadiogroupComponent } from './form/nys-radiogroup.directive';
import { NysSelectComponent } from './form/nys-select.directive';
import { NysTextareaComponent } from './form/nys-textarea.directive';
import { NysTextinputComponent } from './form/nys-textinput.directive';
import { NysToggleComponent } from './form/nys-toggle.directive';

import { NysAccordionComponent } from './ui/nys-accordion.directive';
import { NysAccordionitemComponent } from './ui/nys-accordionitem.directive';
import { NysAlertComponent } from './ui/nys-alert.directive';
import { NysAvatarComponent } from './ui/nys-avatar.directive';
import { NysBacktotopComponent } from './ui/nys-backtotop.directive';
import { NysBadgeComponent } from './ui/nys-badge.directive';
import { NysBreadcrumbsComponent } from './ui/nys-breadcrumbs.directive';
import { NysButtonComponent } from './ui/nys-button.directive';
import { NysDividerComponent } from './ui/nys-divider.directive';
import { NysDropdownmenuComponent } from './ui/nys-dropdownmenu.directive';
import { NysDropdownmenuitemComponent } from './ui/nys-dropdownmenuitem.directive';
import { NysGlobalfooterComponent } from './ui/nys-globalfooter.directive';
import { NysGlobalheaderComponent } from './ui/nys-globalheader.directive';
import { NysIconComponent } from './ui/nys-icon.directive';
import { NysModalComponent } from './ui/nys-modal.directive';
import { NysPaginationComponent } from './ui/nys-pagination.directive';
import { NysRadiobuttonComponent } from './ui/nys-radiobutton.directive';
import { NysSkipnavComponent } from './ui/nys-skipnav.directive';
import { NysStepComponent } from './ui/nys-step.directive';
import { NysStepperComponent } from './ui/nys-stepper.directive';
import { NysTabComponent } from './ui/nys-tab.directive';
import { NysTabgroupComponent } from './ui/nys-tabgroup.directive';
import { NysTabpanelComponent } from './ui/nys-tabpanel.directive';
import { NysTableComponent } from './ui/nys-table.directive';
import { NysTooltipComponent } from './ui/nys-tooltip.directive';
import { NysUnavfooterComponent } from './ui/nys-unavfooter.directive';
import { NysUnavheaderComponent } from './ui/nys-unavheader.directive';
import { NysVideoComponent } from './ui/nys-video.directive';

/**
 * Every standalone NYSDS wrapper component in declaration order.
 *
 * Useful for consumers who want to spread the full set into a standalone
 * component's `imports` array without enumerating each one:
 *
 * @example
 * ```ts
 * @Component({
 *   standalone: true,
 *   imports: [...NYS_COMPONENTS, FormsModule],
 *   template: `...`,
 * })
 * export class MyComponent {}
 * ```
 *
 * Note: because these are Angular Components (not Directives), consumer
 * templates do NOT need `CUSTOM_ELEMENTS_SCHEMA` — the Component selectors
 * satisfy Angular's template type checker for the underlying `<nys-*>` tags.
 */
export const NYS_COMPONENTS = [
  // Form (ControlValueAccessor)
  NysCheckboxComponent,
  NysCheckboxgroupComponent,
  NysComboboxComponent,
  NysDatepickerComponent,
  NysFileinputComponent,
  NysRadiogroupComponent,
  NysSelectComponent,
  NysTextareaComponent,
  NysTextinputComponent,
  NysToggleComponent,
  // UI wrappers
  NysAccordionComponent,
  NysAccordionitemComponent,
  NysAlertComponent,
  NysAvatarComponent,
  NysBacktotopComponent,
  NysBadgeComponent,
  NysBreadcrumbsComponent,
  NysButtonComponent,
  NysDividerComponent,
  NysDropdownmenuComponent,
  NysDropdownmenuitemComponent,
  NysGlobalfooterComponent,
  NysGlobalheaderComponent,
  NysIconComponent,
  NysModalComponent,
  NysPaginationComponent,
  NysRadiobuttonComponent,
  NysSkipnavComponent,
  NysStepComponent,
  NysStepperComponent,
  NysTabComponent,
  NysTabgroupComponent,
  NysTabpanelComponent,
  NysTableComponent,
  NysTooltipComponent,
  NysUnavfooterComponent,
  NysUnavheaderComponent,
  NysVideoComponent,
] as const;

/**
 * Convenience `NgModule` that imports and re-exports every NYSDS wrapper.
 *
 * Standalone components are preferred, but legacy NgModule-based apps can add
 * `NysAngularModule` to their module `imports` to register the full set in one
 * line. No `CUSTOM_ELEMENTS_SCHEMA` required.
 *
 * @example
 * ```ts
 * @NgModule({
 *   imports: [NysAngularModule, FormsModule],
 *   declarations: [AppComponent],
 *   bootstrap: [AppComponent],
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({
  imports: [...NYS_COMPONENTS],
  exports: [...NYS_COMPONENTS],
})
export class NysAngularModule {}
