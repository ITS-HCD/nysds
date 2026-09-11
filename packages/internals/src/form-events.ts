/**
 * Event-dispatch helpers for NYSDS components. Every `nys-*` contract event
 * crosses shadow boundaries, so these helpers hard-code `bubbles: true` and
 * `composed: true`. Components dispatch contract events through them instead
 * of calling `dispatchEvent` directly.
 */

/**
 * Dispatch a `nys-*` CustomEvent from a component host.
 *
 * Pass the full event name, including the `nys-` prefix (for example
 * `"nys-change"`). The event always bubbles and is composed, so delegated
 * listeners and listeners outside any shadow root receive it.
 */
export function dispatchNysEvent<T>(
  host: HTMLElement,
  name: string,
  detail: T,
): void {
  host.dispatchEvent(
    new CustomEvent<T>(name, { detail, bubbles: true, composed: true }),
  );
}

/**
 * Dispatch `nys-focus` or `nys-blur` from a component host.
 *
 * The contract uses a plain `Event` (no detail) for focus and blur, always
 * bubbling and composed. Pass the bare kind (`"focus"` or `"blur"`); the
 * helper adds the `nys-` prefix.
 */
export function dispatchNysFocusBlur(
  host: HTMLElement,
  kind: "focus" | "blur",
): void {
  host.dispatchEvent(
    new Event(`nys-${kind}`, { bubbles: true, composed: true }),
  );
}
