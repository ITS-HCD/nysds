import { NgModule } from '@angular/core';

import { NysCheckboxComponent } from './form/nys-checkbox.component';
import { NysCheckboxgroupComponent } from './form/nys-checkboxgroup.component';
import { NysComboboxComponent } from './form/nys-combobox.component';
import { NysDatepickerComponent } from './form/nys-datepicker.component';
import { NysFileinputComponent } from './form/nys-fileinput.component';
import { NysRadiogroupComponent } from './form/nys-radiogroup.component';
import { NysSelectComponent } from './form/nys-select.component';
import { NysTextareaComponent } from './form/nys-textarea.component';
import { NysTextinputComponent } from './form/nys-textinput.component';
import { NysToggleComponent } from './form/nys-toggle.component';

import { NysAccordionComponent } from './ui/nys-accordion.component';
import { NysAccordionitemComponent } from './ui/nys-accordionitem.component';
import { NysAlertComponent } from './ui/nys-alert.component';
import { NysAvatarComponent } from './ui/nys-avatar.component';
import { NysBacktotopComponent } from './ui/nys-backtotop.component';
import { NysBadgeComponent } from './ui/nys-badge.component';
import { NysBreadcrumbsComponent } from './ui/nys-breadcrumbs.component';
import { NysButtonComponent } from './ui/nys-button.component';
import { NysDividerComponent } from './ui/nys-divider.component';
import { NysDropdownmenuComponent } from './ui/nys-dropdownmenu.component';
import { NysDropdownmenuitemComponent } from './ui/nys-dropdownmenuitem.component';
import { NysGlobalfooterComponent } from './ui/nys-globalfooter.component';
import { NysGlobalheaderComponent } from './ui/nys-globalheader.component';
import { NysIconComponent } from './ui/nys-icon.component';
import { NysModalComponent } from './ui/nys-modal.component';
import { NysPaginationComponent } from './ui/nys-pagination.component';
import { NysRadiobuttonComponent } from './ui/nys-radiobutton.component';
import { NysSkipnavComponent } from './ui/nys-skipnav.component';
import { NysStepComponent } from './ui/nys-step.component';
import { NysStepperComponent } from './ui/nys-stepper.component';
import { NysTabComponent } from './ui/nys-tab.component';
import { NysTabgroupComponent } from './ui/nys-tabgroup.component';
import { NysTabpanelComponent } from './ui/nys-tabpanel.component';
import { NysTableComponent } from './ui/nys-table.component';
import { NysTooltipComponent } from './ui/nys-tooltip.component';
import { NysUnavfooterComponent } from './ui/nys-unavfooter.component';
import { NysUnavheaderComponent } from './ui/nys-unavheader.component';
import { NysVideoComponent } from './ui/nys-video.component';

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
