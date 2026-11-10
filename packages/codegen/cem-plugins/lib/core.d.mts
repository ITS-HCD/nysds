/**
 * Types for `core.mjs`. Hand-written; keep in sync with the implementation.
 * The TypeScript public API re-exports these, so this file is the single
 * place the metadata types are declared.
 */

export declare const NYS_PREFIX: string;
export declare const NYS_BLUR_EVENT: string;

export interface FormControlMeta {
  kind: "value" | "checked" | "files";
  changeEvent: string;
  inputEvent?: string;
}

export interface PropMeta {
  name: string;
  attribute?: string;
  type: string;
  default?: string;
  description?: string;
  isBoolean: boolean;
  isNumber: boolean;
  isPrimitive: boolean;
}

export interface EventMeta {
  name: string;
  typeText: string;
  reactProp: string;
  angularOutput: string;
  description?: string;
}

export interface SlotMeta {
  name: string;
  description?: string;
}

export interface ComponentMeta {
  tag: string;
  className: string;
  packageName: string;
  subpath: string;
  modulePath: string;
  description?: string;
  props: PropMeta[];
  events: EventMeta[];
  slots: SlotMeta[];
  formControl?: FormControlMeta;
}

export interface ManifestModule {
  path: string;
  declarations?: unknown[];
  [key: string]: unknown;
}

export interface Manifest {
  modules: ManifestModule[];
  [key: string]: unknown;
}

export declare function pascalize(name: string): string;
export declare function tagToClass(tag: string, manifest?: Manifest): string;
export declare function classToAngularClass(className: string): string;
export declare function eventToReactProp(eventName: string): string;
export declare function eventToAngularOutput(eventName: string): string;
export declare function tagToSubpath(tag: string): string;
export declare function tagToPackage(modulePath: string): string;

export declare function isPublicMember(member: unknown): boolean;
export declare function isPublicProp(member: unknown): boolean;
export declare function isExposedEvent(event: unknown): boolean;

export declare function parseFormControlTag(comment: string): FormControlMeta;

export declare function normalizeTypeText(text: unknown): string | undefined;
export declare function listComponents(manifest: Manifest): ComponentMeta[];
