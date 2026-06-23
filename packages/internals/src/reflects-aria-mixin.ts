import { LitElement } from "lit";
import {
  IdentifiedMixin,
  type Constructor,
  type IdentifiedInterface,
} from "./identified-mixin";

export type { Constructor };

/**
 * Public/protected surface added by {@link ReflectsAriaMixin}, on top of
 * {@link IdentifiedInterface}. Declared separately so consuming components and
 * the composed FormControl layer get correct types.
 */
export declare class ReflectsAriaInterface extends IdentifiedInterface {
  /** Lazily-attached ElementInternals, or null in non-DOM (SSR) contexts. */
  protected readonly internals: ElementInternals | null;
  /** Default implicit role applied to the host via internals. Override per component. */
  protected get defaultRole(): string | null;
  /** Apply the default role (and any static semantics) to the host. */
  protected reflectDefaultSemantics(): void;
  /** Set a host-level ARIA state property via internals, with attribute fallback. */
  protected setHostAria(name: string, value: string | null): void;
}

/**
 * Mixin that adds ElementInternals-based accessibility semantics on top of
 * {@link IdentifiedMixin}: a default host role and host-level ARIA state
 * reflection. Use for presentational components that the host element itself
 * should expose a role/state for (e.g. a separator). Components that only need
 * id generation should use {@link IdentifiedMixin} / NysElement instead. For
 * name/description association, import the `associateHost` / `associateControl`
 * helpers directly (they tree-shake out of components that don't use them).
 */
export const ReflectsAriaMixin = <T extends Constructor<LitElement>>(
  Base: T,
) => {
  class ReflectsAria extends IdentifiedMixin(Base) {
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

    protected get defaultRole(): string | null {
      return null;
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
      super.connectedCallback(); // IdentifiedMixin assigns the auto id
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

/**
 * Concrete base class for components that reflect a host role/state. Declared as
 * a pure const so bundlers tree-shake it out of packages that don't use it.
 */
export const NysReflectsAriaElement =
  /*@__PURE__*/ ReflectsAriaMixin(LitElement);
