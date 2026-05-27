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
export { NysTextinputComponent } from './lib/form/nys-textinput.component';
export { NysTextareaComponent } from './lib/form/nys-textarea.component';
export { NysSelectComponent } from './lib/form/nys-select.component';
export { NysComboboxComponent } from './lib/form/nys-combobox.component';
export { NysDatepickerComponent } from './lib/form/nys-datepicker.component';
export { NysCheckboxComponent } from './lib/form/nys-checkbox.component';
export { NysCheckboxgroupComponent } from './lib/form/nys-checkboxgroup.component';
export { NysRadiogroupComponent } from './lib/form/nys-radiogroup.component';
export { NysFileinputComponent } from './lib/form/nys-fileinput.component';
export { NysToggleComponent } from './lib/form/nys-toggle.component';

// UI components (non-FACE wrappers)
export { NysAccordionComponent } from './lib/ui/nys-accordion.component';
export { NysAccordionitemComponent } from './lib/ui/nys-accordionitem.component';
export { NysAlertComponent } from './lib/ui/nys-alert.component';
export { NysAvatarComponent } from './lib/ui/nys-avatar.component';
export { NysBacktotopComponent } from './lib/ui/nys-backtotop.component';
export { NysBadgeComponent } from './lib/ui/nys-badge.component';
export { NysBreadcrumbsComponent } from './lib/ui/nys-breadcrumbs.component';
export { NysButtonComponent } from './lib/ui/nys-button.component';
export { NysDividerComponent } from './lib/ui/nys-divider.component';
export { NysDropdownmenuComponent } from './lib/ui/nys-dropdownmenu.component';
export { NysDropdownmenuitemComponent } from './lib/ui/nys-dropdownmenuitem.component';
export { NysGlobalfooterComponent } from './lib/ui/nys-globalfooter.component';
export { NysGlobalheaderComponent } from './lib/ui/nys-globalheader.component';
export { NysIconComponent } from './lib/ui/nys-icon.component';
export { NysModalComponent } from './lib/ui/nys-modal.component';
export { NysPaginationComponent } from './lib/ui/nys-pagination.component';
export { NysRadiobuttonComponent } from './lib/ui/nys-radiobutton.component';
export { NysSkipnavComponent } from './lib/ui/nys-skipnav.component';
export { NysStepComponent } from './lib/ui/nys-step.component';
export { NysStepperComponent } from './lib/ui/nys-stepper.component';
export { NysTabComponent } from './lib/ui/nys-tab.component';
export { NysTabgroupComponent } from './lib/ui/nys-tabgroup.component';
export { NysTabpanelComponent } from './lib/ui/nys-tabpanel.component';
export { NysTableComponent } from './lib/ui/nys-table.component';
export { NysTooltipComponent } from './lib/ui/nys-tooltip.component';
export { NysUnavfooterComponent } from './lib/ui/nys-unavfooter.component';
export { NysUnavheaderComponent, type NysUnavheaderLanguage } from './lib/ui/nys-unavheader.component';
export { NysVideoComponent } from './lib/ui/nys-video.component';

// Convenience aggregate
export { NYS_COMPONENTS, NysAngularModule } from './lib/nys-angular.module';
