/*
 * Public API surface of @nysds/angular
 *
 * The side-effect import below loads the @nysds/components ES bundle so the
 * underlying custom elements (`<nys-*>`) are registered exactly once whenever
 * any wrapper from this package is imported. This mirrors the pattern used by
 * the React wrappers (which import `dist/nysds.es.js` per wrapper).
 *
 * Bundlers preserve this side-effect because the package declares
 * `sideEffects: ["./src/lib/**", "./fesm2022/*.mjs"]` in its package.json.
 */
import '@nysds/components';

// Shared types
export * from './lib/shared/nys-event.types';
export { NysControlValueAccessorBase } from './lib/shared/nys-control-value-accessor.base';

// Form components (ControlValueAccessor)
export { NysTextinputComponent } from './lib/form/nys-textinput.directive';
export { NysTextareaComponent } from './lib/form/nys-textarea.directive';
export { NysSelectComponent } from './lib/form/nys-select.directive';
export { NysComboboxComponent } from './lib/form/nys-combobox.directive';
export { NysDatepickerComponent } from './lib/form/nys-datepicker.directive';
export { NysCheckboxComponent } from './lib/form/nys-checkbox.directive';
export { NysCheckboxgroupComponent } from './lib/form/nys-checkboxgroup.directive';
export { NysRadiogroupComponent } from './lib/form/nys-radiogroup.directive';
export { NysFileinputComponent } from './lib/form/nys-fileinput.directive';
export { NysToggleComponent } from './lib/form/nys-toggle.directive';

// UI components (non-FACE wrappers)
export { NysAccordionComponent } from './lib/ui/nys-accordion.directive';
export { NysAccordionitemComponent } from './lib/ui/nys-accordionitem.directive';
export { NysAlertComponent } from './lib/ui/nys-alert.directive';
export { NysAvatarComponent } from './lib/ui/nys-avatar.directive';
export { NysBacktotopComponent } from './lib/ui/nys-backtotop.directive';
export { NysBadgeComponent } from './lib/ui/nys-badge.directive';
export { NysBreadcrumbsComponent } from './lib/ui/nys-breadcrumbs.directive';
export { NysButtonComponent } from './lib/ui/nys-button.directive';
export { NysDividerComponent } from './lib/ui/nys-divider.directive';
export { NysDropdownmenuComponent } from './lib/ui/nys-dropdownmenu.directive';
export { NysDropdownmenuitemComponent } from './lib/ui/nys-dropdownmenuitem.directive';
export { NysGlobalfooterComponent } from './lib/ui/nys-globalfooter.directive';
export { NysGlobalheaderComponent } from './lib/ui/nys-globalheader.directive';
export { NysIconComponent } from './lib/ui/nys-icon.directive';
export { NysModalComponent } from './lib/ui/nys-modal.directive';
export { NysPaginationComponent } from './lib/ui/nys-pagination.directive';
export { NysRadiobuttonComponent } from './lib/ui/nys-radiobutton.directive';
export { NysSkipnavComponent } from './lib/ui/nys-skipnav.directive';
export { NysStepComponent } from './lib/ui/nys-step.directive';
export { NysStepperComponent } from './lib/ui/nys-stepper.directive';
export { NysTabComponent } from './lib/ui/nys-tab.directive';
export { NysTabgroupComponent } from './lib/ui/nys-tabgroup.directive';
export { NysTabpanelComponent } from './lib/ui/nys-tabpanel.directive';
export { NysTableComponent } from './lib/ui/nys-table.directive';
export { NysTooltipComponent } from './lib/ui/nys-tooltip.directive';
export { NysUnavfooterComponent } from './lib/ui/nys-unavfooter.directive';
export { NysUnavheaderComponent, type NysUnavheaderLanguage } from './lib/ui/nys-unavheader.directive';
export { NysVideoComponent } from './lib/ui/nys-video.directive';

// Convenience aggregate
export { NYS_COMPONENTS, NysAngularModule } from './lib/nys-angular.module';
