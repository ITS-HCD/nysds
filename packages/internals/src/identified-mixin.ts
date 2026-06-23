import { LitElement } from "lit";
import { generateId } from "./id";

export type Constructor<T = object> = new (...args: any[]) => T;

/** Surface added by {@link IdentifiedMixin}. */
export declare class IdentifiedInterface {
  /** Prefix used for auto-generated ids. Defaults to the element's tag name. */
  protected get idPrefix(): string;
  /** Assign an auto-generated id if the consumer did not supply one. */
  protected ensureId(): void;
}

/**
 * Minimal mixin that gives an element stable auto-generated ids. This is the
 * lightweight base for presentational components that need consistent id
 * generation but do NOT reflect a host-level role/state via ElementInternals
 * (so they don't pay for that machinery). Components that DO need host
 * role/state should use {@link ReflectsAriaMixin} instead.
 */
export const IdentifiedMixin = <T extends Constructor<LitElement>>(Base: T) => {
  class Identified extends Base {
    protected get idPrefix(): string {
      return this.localName || "nys-element";
    }

    protected ensureId(): void {
      if (!this.id) this.id = generateId(this.idPrefix);
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.ensureId();
    }
  }
  return Identified as unknown as Constructor<IdentifiedInterface> & T;
};

/**
 * Concrete base class: `extends NysElement` for id-only presentational
 * components. Declared as a pure const so bundlers tree-shake it (and the mixin
 * chain it would pull) out of any package that doesn't use it.
 */
export const NysElement = /*@__PURE__*/ IdentifiedMixin(LitElement);
