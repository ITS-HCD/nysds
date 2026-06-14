let counter = 0;

/**
 * Generate a stable, collision-resistant id for a component instance.
 *
 * The format intentionally matches the legacy per-component pattern
 * (`${prefix}-${Date.now()}-${n}`) so existing tests/consumers that assert on
 * id shape continue to pass.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${counter++}`;
}
