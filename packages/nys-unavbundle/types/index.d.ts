/**
 * Hand-maintained: the bundle is built with esbuild (no `tsc --emitDeclarationOnly`
 * pass) because it compiles other packages' sources, which a composite project
 * reference cannot express.
 *
 * The element classes are typed structurally rather than re-exported from
 * `@nysds/nys-unavheader` / `@nysds/nys-unavfooter`: those are build-time
 * devDependencies here — their code is inlined — so a consumer of this package
 * has no reason to have them installed.
 */

/** Constructor for `<nys-unavheader>`, already registered by loading this module. */
export declare const NysUnavHeader: CustomElementConstructor;

/** Constructor for `<nys-unavfooter>`, already registered by loading this module. */
export declare const NysUnavFooter: CustomElementConstructor;

/**
 * Inject the NYSDS design tokens as the first `<style>` in `<head>`.
 * Called automatically when the bundle loads; exported for callers that set
 * `window.NYS_UNAV_SKIP_TOKENS` and want to control the timing themselves.
 */
export declare function injectTokens(): void;

declare global {
  interface Window {
    /** Set before the bundle loads to suppress automatic token injection. */
    NYS_UNAV_SKIP_TOKENS?: boolean;
  }
}
