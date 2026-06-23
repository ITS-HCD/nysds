import { generateId } from "./id";
import type { AriaRelation, AriaTargets } from "./types";

// Host-level ElementInternals element-reference reflection properties.
// There is no element-reference equivalent for aria-errormessage in the ARIA
// element-reflection spec, so "errormessage" is intentionally absent here and
// always uses the IDREF path on the native control.
const HOST_ELEMENT_REF_PROP: Partial<Record<AriaRelation, string>> = {
  labelledby: "ariaLabelledByElements",
  describedby: "ariaDescribedByElements",
};

// Host-level string ARIA reflection used as the fallback when element-reference
// reflection is unavailable.
const HOST_STRING_PROP: Partial<Record<AriaRelation, string>> = {
  labelledby: "ariaLabel",
  describedby: "ariaDescription",
};

/**
 * Feature-detect ARIA element-reference reflection on ElementInternals
 * (e.g. `internals.ariaDescribedByElements`). When false, callers fall back to
 * string reflection or IDREF attributes.
 */
export function supportsElementRefs(internals: ElementInternals): boolean {
  return "ariaDescribedByElements" in internals;
}

function ariaAttr(relation: AriaRelation): string {
  return relation === "errormessage" ? "aria-errormessage" : `aria-${relation}`;
}

function compact(targets: AriaTargets): Element[] {
  return targets.filter((t): t is Element => !!t);
}

function ensureIds(targets: Element[]): string[] {
  return targets.map((el) => {
    if (!el.id) el.id = generateId("nys-ref");
    return el.id;
  });
}

/**
 * Associate a native control (e.g. the `<input>` rendered inside a component's
 * shadow root) with sibling target elements via IDREF attributes.
 *
 * IDREFs resolve within the control's own shadow root, so this is correct and
 * universally supported across browsers — the right tool for form controls that
 * wrap a real focusable element. Missing target ids are auto-assigned. Passing
 * an empty/all-nullish target list removes the attribute.
 */
export function associateControl(
  control: HTMLElement,
  relation: AriaRelation,
  targets: AriaTargets,
): void {
  const live = compact(targets);
  const attr = ariaAttr(relation);
  if (live.length) control.setAttribute(attr, ensureIds(live).join(" "));
  else control.removeAttribute(attr);
}

/**
 * Associate the HOST element's accessible name/description with target elements
 * using ElementInternals ARIA element references, which are designed to cross
 * the shadow boundary (host semantics → shadow-internal nodes).
 *
 * Falls back to string ARIA reflection (`internals.ariaLabel` /
 * `internals.ariaDescription`) — and finally to a host attribute — using
 * `fallback` or the targets' text content. Only "labelledby" and "describedby"
 * are meaningful at host level. Use this for presentational components and
 * custom controls that have no inner native focusable element.
 */
export function associateHost(
  host: HTMLElement,
  internals: ElementInternals,
  relation: AriaRelation,
  targets: AriaTargets,
  fallback?: string,
): void {
  const live = compact(targets);
  const refProp = HOST_ELEMENT_REF_PROP[relation];
  const rec = internals as unknown as Record<string, unknown>;

  if (refProp && supportsElementRefs(internals)) {
    rec[refProp] = live.length ? live : null;
    return;
  }

  // Fallback: string ARIA reflection on the host.
  const stringProp = HOST_STRING_PROP[relation];
  if (!stringProp) return;

  const value =
    fallback ??
    (live.length
      ? live
          .map((el) => el.textContent?.trim() ?? "")
          .filter(Boolean)
          .join(" ")
      : "");

  if (stringProp in rec) {
    rec[stringProp] = value || null;
  } else if (value) {
    host.setAttribute(
      relation === "labelledby" ? "aria-label" : "aria-description",
      value,
    );
  } else {
    host.removeAttribute(
      relation === "labelledby" ? "aria-label" : "aria-description",
    );
  }
}
