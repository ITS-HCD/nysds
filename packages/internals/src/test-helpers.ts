// Regression guard for issue #1819: a component that renders a <nys-*> child
// in its own template (shadow DOM or light DOM) without importing that
// child's package leaves the child as an inert, un-upgraded element whenever
// the component is used standalone. An un-upgraded custom element has no
// semantics for axe to flag, so those audits silently pass against nothing —
// this bit nys-unavheader (see #1632) and is not caught by axe alone.
//
// Test-only utility. Not exported from the package's side-effect-bearing
// runtime surface in any way that reaches production bundles: nothing in
// component source imports it, so bundlers tree-shake it out of every
// component's own dist build.

/**
 * Walks `host`'s shadow DOM and light DOM (recursing into every nested shadow
 * root it finds) and returns the lowercase tag name of every `<nys-*>`
 * element encountered that is NOT a registered custom element
 * (`customElements.get(tagName)` returns undefined).
 *
 * `host`'s own tag is never reported — a component always "renders" itself.
 * Duplicate tag names are reported once.
 *
 * @param host - The component under test, already attached via `fixture()`
 *   (or otherwise connected — an unconnected host's shadow DOM may not have
 *   rendered yet).
 * @returns Sorted array of unregistered `nys-*` tag names. Empty when every
 *   rendered child is upgraded — assert `.to.deep.equal([])` (or
 *   `.to.be.empty`) on the result.
 *
 * @example
 * ```ts
 * import { findUnregisteredChildren } from "@nysds/internals";
 *
 * it("registers every nys-* element it renders", async () => {
 *   const el = await fixture<NysAlert>(
 *     html`<nys-alert heading="Test" dismissible></nys-alert>`,
 *   );
 *   expect(findUnregisteredChildren(el)).to.deep.equal([]);
 * });
 * ```
 */
export function findUnregisteredChildren(host: Element): string[] {
  const ownTag = host.tagName.toLowerCase();
  const unregistered = new Set<string>();

  const scan = (root: Element | ShadowRoot) => {
    root.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (
        tag.startsWith("nys-") &&
        tag !== ownTag &&
        !customElements.get(tag)
      ) {
        unregistered.add(tag);
      }
      // Recurse into nested shadow roots so a grandchild component's own
      // un-upgraded children are caught too (e.g. nys-checkbox -> nys-label
      // -> nys-tooltip).
      if (el.shadowRoot) {
        scan(el.shadowRoot);
      }
    });
  };

  if (host.shadowRoot) scan(host.shadowRoot);
  scan(host); // light-DOM children: light-DOM components (nys-radiobutton,
  // nys-iconlist, nys-processlist, ...) and consumer-slotted content alike.

  return [...unregistered].sort();
}
