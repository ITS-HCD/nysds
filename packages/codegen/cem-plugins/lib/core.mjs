/**
 * Shared rules for NYSDS code generation.
 *
 * This module is the single source of truth for naming rules, member and
 * event filters, `@formControl` parsing, package derivation, and component
 * metadata. It is plain JavaScript so the CEM plugins can run before
 * `@nysds/codegen` is built. The TypeScript sources in `src/manifest/`
 * re-export from this file and add no logic of their own; `core.d.mts`
 * carries the types.
 */

/** Prefix shared by every NYSDS custom element tag. */
export const NYS_PREFIX = "nys-";

/** Event that marks a form control as touched in framework wrappers. */
export const NYS_BLUR_EVENT = `${NYS_PREFIX}blur`;

// ---------------------------------------------------------------------------
// Naming rules (README.md section 4.1 is normative)
// ---------------------------------------------------------------------------

/**
 * Mechanical PascalCase of a tag. Inner capitals in a segment are kept.
 * Use `tagToClass` with a manifest when the real class name matters:
 * class names in the manifest can capitalize differently.
 */
export function pascalize(name) {
  return name
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join("");
}

/**
 * Tag to class name. With a manifest, returns the manifest
 * `declaration.name`, which is authoritative. Without one, falls back to
 * mechanical PascalCase.
 */
export function tagToClass(tag, manifest) {
  if (manifest) {
    for (const component of listComponents(manifest)) {
      if (component.tag === tag) return component.className;
    }
  }
  return pascalize(tag);
}

/** Class name to Angular component class name. */
export function classToAngularClass(className) {
  return `${className}Component`;
}

/** Event name to React prop: `on` + PascalCase of the full event name. */
export function eventToReactProp(eventName) {
  return `on${pascalize(eventName)}`;
}

/** Event name to Angular output: camelCase of the full event name. */
export function eventToAngularOutput(eventName) {
  const parts = eventName.split("-");
  return (
    parts[0] +
    parts
      .slice(1)
      .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
      .join("")
  );
}

/** Tag to import subpath: the tag minus the prefix. */
export function tagToSubpath(tag) {
  return tag.startsWith(NYS_PREFIX) ? tag.slice(NYS_PREFIX.length) : tag;
}

/**
 * Manifest module path to package name. Derived, never a table:
 * `packages/nys-accordion/src/nys-accordionitem.ts` -> `@nysds/nys-accordion`.
 */
export function tagToPackage(modulePath) {
  const match = /(?:^|\/)packages\/([^/]+)\//.exec(modulePath);
  if (!match) {
    throw new Error(
      `Cannot derive a package name from module path "${modulePath}": expected a packages/<name>/ segment.`
    );
  }
  return `@nysds/${match[1]}`;
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

/** Lit and custom-element machinery that must never surface as a prop. */
const LIT_INTERNAL_MEMBERS = new Set([
  "updateComplete",
  "isUpdatePending",
  "hasUpdated",
  "renderRoot",
  "renderOptions",
  "shadowRootOptions",
  "elementProperties",
  "elementStyles",
  "styles",
  "properties",
  "observedAttributes",
  "formAssociated",
]);

/**
 * True when a manifest member is part of the public API: not static, not
 * underscore- or hash-prefixed, not `privacy: private | protected`, not
 * deprecated, and not Lit machinery.
 */
export function isPublicMember(member) {
  if (!member || typeof member.name !== "string" || member.name.length === 0) {
    return false;
  }
  if (member.static) return false;
  if (member.name.startsWith("_") || member.name.startsWith("#")) return false;
  if (member.privacy === "private" || member.privacy === "protected") {
    return false;
  }
  if (member.deprecated) return false;
  if (LIT_INTERNAL_MEMBERS.has(member.name)) return false;
  return true;
}

/** True for a public, non-deprecated field. */
export function isPublicProp(member) {
  return member?.kind === "field" && isPublicMember(member);
}

/** True when an event should surface in wrappers and snippets. */
export function isExposedEvent(event) {
  if (!event || typeof event.name !== "string" || event.name.length === 0) {
    return false;
  }
  if (event.deprecated) return false;
  return true;
}

// ---------------------------------------------------------------------------
// @formControl parsing
// ---------------------------------------------------------------------------

const FORM_CONTROL_KINDS = new Set(["value", "checked", "files"]);
const EVENT_NAME_RE = new RegExp(`^${NYS_PREFIX}[a-z][a-zA-Z-]*$`);

/**
 * Parses the `@formControl <kind> <changeEvent> [inputEvent]` JSDoc tag
 * body. Throws on a malformed tag; the caller adds the file path.
 */
export function parseFormControlTag(comment) {
  const parts = String(comment ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length < 2 || parts.length > 3) {
    throw new Error(
      `@formControl expects "<kind> <changeEvent> [inputEvent]"; got "${String(comment ?? "").trim()}"`
    );
  }
  const [kind, changeEvent, inputEvent] = parts;
  if (!FORM_CONTROL_KINDS.has(kind)) {
    throw new Error(
      `@formControl kind must be "value", "checked", or "files"; got "${kind}"`
    );
  }
  for (const eventName of [changeEvent, inputEvent]) {
    if (eventName !== undefined && !EVENT_NAME_RE.test(eventName)) {
      throw new Error(
        `@formControl event "${eventName}" must be a ${NYS_PREFIX}* event name`
      );
    }
  }
  return inputEvent ? { kind, changeEvent, inputEvent } : { kind, changeEvent };
}

// ---------------------------------------------------------------------------
// Component metadata
// ---------------------------------------------------------------------------

/** Collapses whitespace in a manifest type text and trims a leading pipe. */
export function normalizeTypeText(text) {
  if (typeof text !== "string") return undefined;
  const collapsed = text.replace(/\s+/g, " ").replace(/^\|\s*/, "").trim();
  return collapsed.length > 0 ? collapsed : undefined;
}

const PRIMITIVE_PARTS = new Set([
  "string",
  "number",
  "boolean",
  "null",
  "undefined",
]);

function isPrimitiveType(typeText) {
  if (!typeText) return false;
  return typeText
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .every(
      (part) =>
        PRIMITIVE_PARTS.has(part) ||
        /^".*"$/.test(part) ||
        /^'.*'$/.test(part) ||
        /^-?\d+(\.\d+)?$/.test(part)
    );
}

function isNumberType(typeText) {
  if (!typeText) return false;
  const parts = typeText
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    parts.includes("number") &&
    parts.every((part) => part === "number" || part === "null" || part === "undefined")
  );
}

/**
 * Reads every NYSDS component out of a custom elements manifest and returns
 * uniform metadata: naming, public props, exposed events, slots, and the
 * `formControl` block when the manifest carries one. Sorted by tag.
 */
export function listComponents(manifest) {
  const components = [];
  for (const mod of manifest?.modules ?? []) {
    for (const decl of mod.declarations ?? []) {
      if (decl.kind !== "class") continue;
      const tag = decl.tagName;
      if (typeof tag !== "string" || !tag.startsWith(NYS_PREFIX)) continue;

      const attributeByField = new Map();
      for (const attr of decl.attributes ?? []) {
        if (attr.fieldName && attr.name) {
          attributeByField.set(attr.fieldName, attr.name);
        }
      }

      const props = (decl.members ?? []).filter(isPublicProp).map((member) => {
        const type = normalizeTypeText(member.type?.text);
        return {
          name: member.name,
          attribute: member.attribute ?? attributeByField.get(member.name),
          type: type ?? "unknown",
          default: member.default,
          description: member.description,
          isBoolean: type === "boolean",
          isNumber: isNumberType(type),
          isPrimitive: isPrimitiveType(type),
        };
      });

      const events = (decl.events ?? []).filter(isExposedEvent).map((event) => ({
        name: event.name,
        typeText: normalizeTypeText(event.type?.text) ?? "CustomEvent",
        reactProp: eventToReactProp(event.name),
        angularOutput: eventToAngularOutput(event.name),
        description: event.description,
      }));

      const slots = (decl.slots ?? [])
        .filter((slot) => typeof slot?.name === "string")
        .map((slot) => ({ name: slot.name, description: slot.description }));

      const component = {
        tag,
        className: decl.name,
        packageName: tagToPackage(mod.path),
        subpath: tagToSubpath(tag),
        modulePath: mod.path,
        description: decl.description,
        props,
        events,
        slots,
      };
      if (decl.formControl) component.formControl = decl.formControl;
      components.push(component);
    }
  }
  components.sort((a, b) => a.tag.localeCompare(b.tag));
  return components;
}
