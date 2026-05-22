/*
 * Typed CustomEvent helpers for the NYSDS Angular directives.
 *
 * Each NYSDS form component dispatches a `nys-*` CustomEvent with a
 * component-specific detail payload. These aliases let directive `@Output()`s
 * declare the event type so consumers get IDE intellisense on `$event.detail`.
 *
 * Stubbed by hand for the first directives; Task 8's CEM-driven generator will
 * eventually own this file.
 */

/** Generic detail shape — `id` is always present on NYSDS events. */
export interface NysEventDetail<T extends object = Record<string, unknown>> {
  id: string;
}

/** Fired by text-like inputs whenever the value changes. */
export type NysInputEvent<T = string> = CustomEvent<{ id: string; value: T }>;

/** Generic value-change event (used by select, combobox, radiogroup, datepicker). */
export type NysChangeEvent<T = string> = CustomEvent<{ id: string; value: T }>;

/** Fired by checkbox / toggle (boolean state). */
export type NysCheckedChangeEvent = CustomEvent<{
  id: string;
  checked: boolean;
  name?: string;
  value?: string;
}>;

/** Fired by `nys-fileinput`. */
export type NysFilesChangeEvent = CustomEvent<{ id: string; files: File[] }>;

/** Validation lifecycle events shared across FACE components. */
export type NysErrorEvent = CustomEvent<{ id: string; message: string }>;
export type NysErrorClearEvent = CustomEvent<{ id: string }>;

/** Plain `nys-focus` / `nys-blur` events carry no detail. */
export type NysFocusEvent = Event;
export type NysBlurEvent = Event;
