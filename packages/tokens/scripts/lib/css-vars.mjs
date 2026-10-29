/**
 * Parsing, resolving and normalizing CSS custom properties. Used by
 * css-diff.mjs to compare two Terrazzo builds by meaning rather than by text:
 * "#000", "#000000" and "rgb(0 0 0)" all count as the same value.
 */

// ---------------------------------------------------------------------------
// Parsing a stylesheet
// ---------------------------------------------------------------------------

/**
 * Parse a stylesheet into its rule blocks and the custom properties each declares.
 *
 * @returns {Array<{ selector: string, declarations: Map<string, string> }>}
 *   Rules nested in at-rules (e.g. @media) get the at-rule prepended to their selector.
 */
export function parseBlocks(cssText) {
  const cssWithoutComments = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const openPreludes = []; // selectors and at-rules of the blocks we are inside
  let currentText = "";

  for (const character of cssWithoutComments) {
    if (character === "{") {
      openPreludes.push(currentText.trim());
      currentText = "";
      continue;
    }

    if (character === "}") {
      const prelude = openPreludes.pop();
      const blockBody = currentText;
      currentText = "";

      const isAtRuleOrStray = prelude === undefined || prelude.startsWith("@");
      if (isAtRuleOrStray) {
        continue;
      }

      const declarations = new Map();
      for (const declaration of splitTopLevel(blockBody, ";")) {
        const colonIndex = declaration.indexOf(":");
        if (colonIndex === -1) {
          continue;
        }
        const propertyName = declaration.slice(0, colonIndex).trim();
        if (propertyName.startsWith("--")) {
          const propertyValue = declaration.slice(colonIndex + 1).trim();
          declarations.set(propertyName, propertyValue);
        }
      }

      const enclosingAtRules = openPreludes.filter((openPrelude) => openPrelude.startsWith("@"));
      const selector = [...enclosingAtRules, normalizeSelector(prelude)].join(" ");
      blocks.push({ selector, declarations });
      continue;
    }

    currentText += character;
  }

  return blocks;
}

/**
 * Normalize a selector list so equivalent lists compare equal: trimmed,
 * single-spaced, double quotes, and sorted.
 *
 * "[data-theme='x'],\n.t-x" → '.t-x, [data-theme="x"]'
 */
export function normalizeSelector(selectorList) {
  const selectors = [];
  for (const selector of selectorList.split(",")) {
    const normalized = selector.trim().replace(/\s+/g, " ").replace(/'/g, '"');
    if (normalized !== "") {
      selectors.push(normalized);
    }
  }
  selectors.sort();
  return selectors.join(", ");
}

/** Split text on a delimiter, ignoring delimiters inside parentheses or quotes. */
export function splitTopLevel(text, delimiter) {
  const pieces = [];
  let parenthesisDepth = 0;
  let openQuote = null;
  let currentPiece = "";

  for (const character of text) {
    if (openQuote) {
      if (character === openQuote) {
        openQuote = null;
      }
    } else if (character === '"' || character === "'") {
      openQuote = character;
    } else if (character === "(") {
      parenthesisDepth += 1;
    } else if (character === ")") {
      parenthesisDepth -= 1;
    } else if (parenthesisDepth === 0 && character === delimiter) {
      pieces.push(currentPiece);
      currentPiece = "";
      continue;
    }
    currentPiece += character;
  }

  if (currentPiece.trim() !== "") {
    pieces.push(currentPiece);
  }
  return pieces;
}

// ---------------------------------------------------------------------------
// Resolving var() references
// ---------------------------------------------------------------------------

/**
 * Replace every var() in a value with what it refers to, recursively.
 *
 * @param {string} value
 * @param {Map<string, string>} scope  custom property name → raw value
 * @param {Set<string>} propertiesBeingResolved  guards against reference loops
 * @returns {string}  the value with references resolved. A reference that can't
 *   be resolved is kept as `var(--name)` so it still compares.
 */
export function resolveValue(value, scope, propertiesBeingResolved = new Set()) {
  let result = "";
  let position = 0;

  while (position < value.length) {
    const referenceStart = value.indexOf("var(", position);
    if (referenceStart === -1) {
      result += value.slice(position);
      break;
    }
    result += value.slice(position, referenceStart);

    // Find the parenthesis that closes this var(
    let parenthesisDepth = 0;
    let referenceEnd = referenceStart + 3; // the "(" of "var("
    while (referenceEnd < value.length) {
      const character = value[referenceEnd];
      if (character === "(") {
        parenthesisDepth += 1;
      } else if (character === ")") {
        parenthesisDepth -= 1;
        if (parenthesisDepth === 0) {
          break;
        }
      }
      referenceEnd += 1;
    }

    const referenceArguments = value.slice(referenceStart + 4, referenceEnd);
    const [nameArgument, ...fallbackPieces] = splitTopLevel(referenceArguments, ",");
    const referencedProperty = nameArgument.trim();
    const fallback = fallbackPieces.length > 0 ? fallbackPieces.join(",").trim() : null;

    const canResolve = scope.has(referencedProperty) && !propertiesBeingResolved.has(referencedProperty);
    if (canResolve) {
      const nextPropertiesBeingResolved = new Set(propertiesBeingResolved);
      nextPropertiesBeingResolved.add(referencedProperty);
      result += resolveValue(scope.get(referencedProperty), scope, nextPropertiesBeingResolved);
    } else if (fallback !== null) {
      result += resolveValue(fallback, scope, propertiesBeingResolved);
    } else {
      result += `var(${referencedProperty})`;
    }

    position = referenceEnd + 1;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

/**
 * Parse a CSS color into channels from 0 to 1, or return null if it isn't a
 * format we recognize. Supports hex (3, 4, 6, 8 digits), rgb()/rgba(),
 * color(srgb …) and `transparent`.
 *
 * @returns {{ red: number, green: number, blue: number, alpha: number } | null}
 */
export function parseColor(text) {
  const color = text.trim().toLowerCase();

  const hexMatch = color.match(/^#([0-9a-f]{3,8})$/);
  if (hexMatch) {
    let hexDigits = hexMatch[1];
    const isShortForm = hexDigits.length === 3 || hexDigits.length === 4;
    if (isShortForm) {
      hexDigits = [...hexDigits].map((digit) => digit + digit).join("");
    }
    if (hexDigits.length !== 6 && hexDigits.length !== 8) {
      return null;
    }
    const readChannel = (offset) => parseInt(hexDigits.slice(offset, offset + 2), 16) / 255;
    return {
      red: readChannel(0),
      green: readChannel(2),
      blue: readChannel(4),
      alpha: hexDigits.length === 8 ? readChannel(6) : 1,
    };
  }

  const rgbMatch = color.match(/^rgba?\((.*)\)$/);
  if (rgbMatch) {
    const channels = rgbMatch[1].split(/[\s,/]+/).filter((channel) => channel !== "");
    if (channels.length < 3) {
      return null;
    }
    const readChannel = (channel) => {
      if (channel.endsWith("%")) {
        return parseFloat(channel) / 100;
      }
      return parseFloat(channel) / 255;
    };
    return {
      red: readChannel(channels[0]),
      green: readChannel(channels[1]),
      blue: readChannel(channels[2]),
      alpha: parseAlpha(channels[3]),
    };
  }

  const srgbMatch = color.match(/^color\(\s*srgb\s+(.*)\)$/);
  if (srgbMatch) {
    const channels = srgbMatch[1].split(/[\s/]+/).filter((channel) => channel !== "");
    const readChannel = (channel) => {
      if (channel.endsWith("%")) {
        return parseFloat(channel) / 100;
      }
      return parseFloat(channel);
    };
    return {
      red: readChannel(channels[0]),
      green: readChannel(channels[1]),
      blue: readChannel(channels[2]),
      alpha: parseAlpha(channels[3]),
    };
  }

  if (color === "transparent") {
    return { red: 0, green: 0, blue: 0, alpha: 0 };
  }

  return null;
}

function parseAlpha(alphaText) {
  if (alphaText === undefined || alphaText === "none") {
    return 1;
  }
  if (alphaText.endsWith("%")) {
    return parseFloat(alphaText) / 100;
  }
  return parseFloat(alphaText);
}

/**
 * A color as 8-bit hex (8 digits only when not opaque). Two colors are the
 * same when their keys match.
 */
export function colorKey(color) {
  const toHexPair = (channel) => {
    const clampedChannel = Math.min(1, Math.max(0, channel));
    return Math.round(clampedChannel * 255)
      .toString(16)
      .padStart(2, "0");
  };

  let key = `#${toHexPair(color.red)}${toHexPair(color.green)}${toHexPair(color.blue)}`;
  if (color.alpha < 1) {
    key += toHexPair(color.alpha);
  }
  return key;
}

/** If the whole value is one color, return it parsed; otherwise null. */
export function singleColor(value) {
  return parseColor(value.trim());
}

/**
 * Perceived difference between two colors: Euclidean distance in OKLab, scaled
 * by 100 so that about 1 is just noticeable. Alpha is not included.
 */
export function deltaE(firstColor, secondColor) {
  const [firstLightness, firstA, firstB] = toOklab(firstColor);
  const [secondLightness, secondA, secondB] = toOklab(secondColor);
  const distance = Math.hypot(firstLightness - secondLightness, firstA - secondA, firstB - secondB);
  return distance * 100;
}

function toOklab(color) {
  const toLinear = (channel) => {
    if (channel <= 0.04045) {
      return channel / 12.92;
    }
    return ((channel + 0.055) / 1.055) ** 2.4;
  };
  const linearRed = toLinear(color.red);
  const linearGreen = toLinear(color.green);
  const linearBlue = toLinear(color.blue);

  const longCone = Math.cbrt(0.4122214708 * linearRed + 0.5363325363 * linearGreen + 0.0514459929 * linearBlue);
  const mediumCone = Math.cbrt(0.2119034982 * linearRed + 0.6806995451 * linearGreen + 0.1073969566 * linearBlue);
  const shortCone = Math.cbrt(0.0883024619 * linearRed + 0.2817188376 * linearGreen + 0.6299787005 * linearBlue);

  return [
    0.2104542553 * longCone + 0.793617785 * mediumCone - 0.0040720468 * shortCone,
    1.9779984951 * longCone - 2.428592205 * mediumCone + 0.4505937099 * shortCone,
    0.0259040371 * longCone + 0.7827717662 * mediumCone - 0.808675766 * shortCone,
  ];
}

// ---------------------------------------------------------------------------
// Normalizing values
// ---------------------------------------------------------------------------

/** "0.6250rem" → "0.625rem", "0px" → "0"; anything that isn't a number is returned as is. */
function normalizeNumber(word) {
  const numberMatch = word.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
  if (!numberMatch) {
    return word;
  }
  const number = parseFloat(numberMatch[1]);
  const unit = numberMatch[2].toLowerCase();
  if (number === 0 && unit !== "%") {
    return "0";
  }
  return `${Number(number.toFixed(6))}${unit}`;
}

/** Split on spaces, keeping parenthesized groups and quoted strings whole. */
function splitIntoWords(text) {
  const singleSpaced = text.replace(/\s+/g, " ");
  const words = [];
  for (const word of splitTopLevel(singleSpaced, " ")) {
    const trimmedWord = word.trim();
    if (trimmedWord !== "") {
      words.push(trimmedWord);
    }
  }
  return words;
}

/**
 * Normalize a resolved value so that format-only differences compare equal:
 * colors become 8-bit hex, numbers lose trailing zeros, quotes become double
 * quotes. Comma-separated lists (shadows, font stacks) are normalized per item.
 */
export function normalizeValue(value) {
  const normalizedItems = [];

  for (const item of splitTopLevel(value, ",")) {
    const normalizedWords = [];
    for (const word of splitIntoWords(item.trim())) {
      const color = parseColor(word);
      if (color) {
        normalizedWords.push(colorKey(color));
      } else if (/^["']/.test(word)) {
        normalizedWords.push(`"${word.slice(1, -1)}"`);
      } else {
        normalizedWords.push(normalizeNumber(word));
      }
    }
    normalizedItems.push(normalizedWords.join(" "));
  }

  return normalizedItems.join(", ");
}
