// shift.ts
// --------

// A small helper to clamp a value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

type Rect = { left: number; top: number; width: number; height: number };
type Coords = { x: number; y: number };

/**
 * A direct replacement for Floating UI's `shift()` middleware.
 *
 * @param trigger  The reference DOMRect.
 * @param tooltip  The floating DOMRect.
 * @param placement 'top' | 'bottom' | 'left' | 'right'
 * @returns         `{ x, y }` final coordinates.
 */
export function shift(
  trigger: DOMRect,
  tooltip: DOMRect,
  placement: 'top' | 'bottom' | 'left' | 'right'
): Coords {
  // 1) Compute the base (CSS-driven) position
  let x = trigger.left;
  let y = trigger.top;

  switch (placement) {
    case 'top':
      x += (trigger.width - tooltip.width) / 2;
      y -= tooltip.height;
      break;
    case 'bottom':
      x += (trigger.width - tooltip.width) / 2;
      y += trigger.height;
      break;
    case 'left':
      x -= tooltip.width;
      y += (trigger.height - tooltip.height) / 2;
      break;
    case 'right':
      x += trigger.width;
      y += (trigger.height - tooltip.height) / 2;
      break;
  }

  // 2) Simple viewport overflow detection
  const overflow = {
    top:    Math.max(0, 0 - y),
    bottom: Math.max(0, y + tooltip.height - window.innerHeight),
    left:   Math.max(0, 0 - x),
    right:  Math.max(0, x + tooltip.width - window.innerWidth),
  };

  // 3) Shift (clamp) on both axes
  // Determine axes
  const mainAxis   = placement === 'left' || placement === 'right' ? 'x' : 'y';
  const crossAxis  = mainAxis === 'x' ? 'y' : 'x';

  let main = mainAxis === 'x' ? x : y;
  let cross = crossAxis === 'x' ? x : y;

  // clamp main axis
  {
    const minSide = mainAxis === 'y' ? 'top' : 'left';
    const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
    const min = main + overflow[minSide];
    const max = main - overflow[maxSide];
    main = clamp(min, main, max);
  }
  // clamp cross axis
  {
    const minSide = crossAxis === 'y' ? 'top' : 'left';
    const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
    const min = cross + overflow[minSide];
    const max = cross - overflow[maxSide];
    cross = clamp(min, cross, max);
  }

  // 4) Re-assemble
  return {
    x: mainAxis === 'x' ? main : cross,
    y: mainAxis === 'y' ? main : cross,
  };
}
