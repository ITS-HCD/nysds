import { LitElement } from "lit";
import { generateId } from "./id";

export type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Public/protected surface added by {@link ReflectsAriaMixin}. Declared
 * separately so consuming components and the composed FormControl layer get
 * correct types.
 */
export declare class ReflectsAriaInterface {
  /** Lazily-attached ElementInternals, or null in non-DOM (SSR) contexts. */
  protected readonly internals: ElementInternals | null;
  /** Prefix used for auto-generated ids. Defaults to the element's tag name. */
  protected get idPrefix(): string;
  /** Default implicit role applied to the host via internals. Override per component. */
  protected get defaultRole(): string | null;
  /** Apply the default role (and any static semantics) to the host. */
  protected reflectDefaultSemantics(): void;
  /** Set a host-level ARIA state property via internals, with attribute fallback. */
  protected setHostAria(name: string, value: string | null): void;
  /** Assign an auto-generated id if the consumer did not supply one. */
  protected ensureId(): void;
}

/**
 * Mixin that gives an element ElementInternals-based accessibility semantics:
 * a default role, host-level ARIA state reflection, and stable id generation —
 * without form association. Use for presentational components. For name/
 * description association, import the `associateHost` / `associateControl`
 * helpers directly (they tree-shake out of components that don't use them).
 */
export const ReflectsAriaMixin = <T extends Constructor<LitElement>>(
  Base: T,
) => {
  class ReflectsAria extends Base {
    private __internals: ElementInternals | null = null;

    protected get internals(): ElementInternals | null {
      if (this.__internals) return this.__internals;
      // Guard for SSR / environments without attachInternals.
      if (typeof this.attachInternals === "function") {
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      }
      return this.__internals;
    }

    protected get idPrefix(): string {
      return this.localName || "nys-element";
    }

    protected get defaultRole(): string | null {
      return null;
    }

    protected ensureId(): void {
      if (!this.id) this.id = generateId(this.idPrefix);
    }

    protected setHostAria(name: string, value: string | null): void {
      const rec = this.internals as unknown as Record<string, unknown> | null;
      if (rec && name in rec) {
        rec[name] = value;
        return;
      }
      // Fallback: reflect onto a host attribute.
      const attr = ariaAttr(name);
      if (value === null) this.removeAttribute(attr);
      else this.setAttribute(attr, value);
    }

    protected reflectDefaultSemantics(): void {
      const role = this.defaultRole;
      if (role) this.setHostAria("role", role);
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.ensureId();
      this.reflectDefaultSemantics();
    }
  }
  return ReflectsAria as unknown as Constructor<ReflectsAriaInterface> & T;
};

// Map an ARIAMixin property name (e.g. "ariaRequired", "role") to its host
// attribute equivalent ("aria-required", "role").
function ariaAttr(name: string): string {
  if (name === "role") return "role";
  const stripped = name.replace(/^aria/, "");
  return "aria-" + stripped.charAt(0).toLowerCase() + stripped.slice(1);
}

/** Concrete base class: `extends NysReflectsAriaElement` for presentational components. */
export class NysReflectsAriaElement extends ReflectsAriaMixin(LitElement) {}
