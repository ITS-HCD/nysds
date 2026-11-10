/** Value a form-associated control submits. Mirrors `ElementInternals.setFormValue`. */
export type FormValue = Parameters<ElementInternals["setFormValue"]>[0];

/**
 * Which ARIA relationship to wire between a control (or host) and the elements
 * that provide its accessible name / description / error message.
 */
export type AriaRelation = "labelledby" | "describedby" | "errormessage";

/** A list of association targets, tolerant of null/undefined entries. */
export type AriaTargets = Array<Element | null | undefined>;

/**
 * How a form component binds its value: the name of the public property that
 * frameworks read and write. Declared by each component's `@formControl`
 * JSDoc tag and validated by `@nysds/codegen`.
 */
export type FormControlKind = "value" | "checked" | "files";
