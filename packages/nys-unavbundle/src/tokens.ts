/**
 * The generated token stylesheet, as a string.
 *
 * Read from `@nysds/tokens`' build output rather than `@nysds/styles`: the
 * latter also ships a global `nys-*:not(:defined) { visibility: hidden }` rule,
 * which would hide unrelated NYSDS elements on a host page that never loaded
 * their definitions.
 */
import tokens from "../../tokens/dist/tokens.css?inline";

export default tokens;
