/*
 * Public API surface of @nysds/angular
 *
 * The side-effect import below loads the @nysds/components ES bundle so the
 * underlying custom elements (`<nys-*>`) are registered exactly once whenever
 * any directive from this package is imported. This mirrors the pattern used
 * by the React wrappers (which import `dist/nysds.es.js` per wrapper).
 *
 * Bundlers preserve this side-effect because the package declares
 * `sideEffects: ["./src/lib/**", "./fesm2022/*.mjs"]` in its package.json.
 */
import '@nysds/components';


// Shared types
export * from './lib/shared/nys-event.types';
export { NysControlValueAccessorBase } from './lib/shared/nys-control-value-accessor.base';

// Form directives (ControlValueAccessor)
export { NysTextinputDirective } from './lib/form/nys-textinput.directive';
export { NysTextareaDirective } from './lib/form/nys-textarea.directive';
export { NysSelectDirective } from './lib/form/nys-select.directive';
export { NysComboboxDirective } from './lib/form/nys-combobox.directive';
export { NysDatepickerDirective } from './lib/form/nys-datepicker.directive';
export { NysCheckboxDirective } from './lib/form/nys-checkbox.directive';
export { NysCheckboxgroupDirective } from './lib/form/nys-checkboxgroup.directive';
export { NysRadiogroupDirective } from './lib/form/nys-radiogroup.directive';
export { NysFileinputDirective } from './lib/form/nys-fileinput.directive';
export { NysToggleDirective } from './lib/form/nys-toggle.directive';

// UI directives (non-FACE wrappers)
export { NysAccordionDirective } from './lib/ui/nys-accordion.directive';
export { NysAccordionitemDirective } from './lib/ui/nys-accordionitem.directive';
export { NysAlertDirective } from './lib/ui/nys-alert.directive';
export { NysAvatarDirective } from './lib/ui/nys-avatar.directive';
export { NysBacktotopDirective } from './lib/ui/nys-backtotop.directive';
export { NysBadgeDirective } from './lib/ui/nys-badge.directive';
export { NysBreadcrumbsDirective } from './lib/ui/nys-breadcrumbs.directive';
export { NysButtonDirective } from './lib/ui/nys-button.directive';
export { NysDividerDirective } from './lib/ui/nys-divider.directive';
export { NysDropdownmenuDirective } from './lib/ui/nys-dropdownmenu.directive';
export { NysDropdownmenuitemDirective } from './lib/ui/nys-dropdownmenuitem.directive';
export { NysGlobalfooterDirective } from './lib/ui/nys-globalfooter.directive';
export { NysGlobalheaderDirective } from './lib/ui/nys-globalheader.directive';
export { NysIconDirective } from './lib/ui/nys-icon.directive';
export { NysModalDirective } from './lib/ui/nys-modal.directive';
export { NysPaginationDirective } from './lib/ui/nys-pagination.directive';
export { NysRadiobuttonDirective } from './lib/ui/nys-radiobutton.directive';
export { NysSkipnavDirective } from './lib/ui/nys-skipnav.directive';
export { NysStepDirective } from './lib/ui/nys-step.directive';
export { NysStepperDirective } from './lib/ui/nys-stepper.directive';
export { NysTabDirective } from './lib/ui/nys-tab.directive';
export { NysTabgroupDirective } from './lib/ui/nys-tabgroup.directive';
export { NysTabpanelDirective } from './lib/ui/nys-tabpanel.directive';
export { NysTableDirective } from './lib/ui/nys-table.directive';
export { NysTooltipDirective } from './lib/ui/nys-tooltip.directive';
export { NysUnavfooterDirective } from './lib/ui/nys-unavfooter.directive';
export { NysUnavheaderDirective, type NysUnavheaderLanguage } from './lib/ui/nys-unavheader.directive';
export { NysVideoDirective } from './lib/ui/nys-video.directive';

// Convenience aggregate
export { NYS_DIRECTIVES, NysAngularModule } from './lib/nys-angular.module';
