/**
 * `@nysds/nys-unavbundle` — the universal nav as a single drop-in script.
 *
 * ```html
 * <script src="https://unpkg.com/@nysds/nys-unavbundle"></script>
 * <nys-unavheader></nys-unavheader>
 * ...
 * <nys-unavfooter></nys-unavfooter>
 * ```
 *
 * Everything the two elements need is inlined: Lit, the shared internals, the
 * `nys-button` / `nys-textinput` / `nys-alert` / `nys-icon` components they
 * compose, and the design tokens their styles read. Icons are pruned at build
 * time to the set the nav can actually render — see `scripts/icon-allowlist.js`.
 */

import tokens from "./tokens";

// Side-effect imports: each module registers its own custom element, guarded by
// a `customElements.get()` check, so a page that already loads NYSDS keeps the
// definitions it registered first.
import "@nysds/nys-unavheader";
import "@nysds/nys-unavfooter";

/** Marks the injected `<style>`, so repeat loads of the script are a no-op. */
const TOKENS_STYLE_ID = "nys-unavbundle-tokens";

declare global {
  interface Window {
    /** Set before the script runs to suppress token injection entirely. */
    NYS_UNAV_SKIP_TOKENS?: boolean;
  }
}

/**
 * Put the NYSDS token variables on `:root`.
 *
 * The style goes in as the *first* child of `<head>` on purpose: the component
 * styles read these variables, but a host page that defines its own `--nys-*`
 * values — including a page already loading `@nysds/styles` — should win on
 * source order rather than fight us for it.
 */
export function injectTokens(): void {
  if (typeof document === "undefined") return;
  if (window.NYS_UNAV_SKIP_TOKENS) return;
  if (document.getElementById(TOKENS_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = TOKENS_STYLE_ID;
  style.textContent = tokens;

  const head = document.head;
  head.insertBefore(style, head.firstChild);
}

injectTokens();

export { NysUnavHeader } from "@nysds/nys-unavheader";
export { NysUnavFooter } from "@nysds/nys-unavfooter";
