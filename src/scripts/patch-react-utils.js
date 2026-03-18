import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../../packages/react/react-utils.js");

const patched = `import { useEffect, useRef } from "react";

export function useProperties(targetElement, propName, value) {
  useEffect(() => {
    if (
      value !== undefined &&
      targetElement.current &&
      targetElement.current[propName] !== value
    ) {
      try {
        targetElement.current[propName] = value;
      } catch (e) {
        console.warn(e);
      }
    }
  }, [value, targetElement]);
}

export function useEventListener(targetElement, eventName, eventHandler) {
  // Store the latest handler in a ref so we never need to re-subscribe
  // just because the consumer passed a new function reference.
  const savedHandler = useRef(eventHandler);
  useEffect(() => {
    savedHandler.current = eventHandler;
  }, [eventHandler]);

  useEffect(() => {
    const element = targetElement.current;
    if (!element || eventHandler === undefined) return;

    // Stable wrapper — identity never changes, so add/remove are always paired.
    const listener = (event) => savedHandler.current(event);

    element.addEventListener(eventName, listener);

    return () => {
      element.removeEventListener(eventName, listener);
    };
    // Only re-subscribe when the element or event name changes.
    // Handler changes are handled via the savedHandler ref above.
  }, [eventName, targetElement]);
}
`;

writeFileSync(outPath, patched, "utf-8");
console.log("✅  packages/react/react-utils.js patched successfully.");