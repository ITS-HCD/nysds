/**
 * Mapping rules for scripts/figma-pull.mjs: how variables in the NYSDS Figma
 * file become DTCG tokens in src/tokens.json and src/themes/*.json.
 *
 * Figma is the source of truth for values and descriptions of every token whose
 * CSS name matches a Figma variable. Tokens with no Figma variable keep their
 * code value and are flagged in reports/figma-code-drift.md.
 */
export default {
  /**
   * Collections whose variables map to CSS custom properties. `prefix` is
   * prepended to the variable name (the Color collection's names start at the
   * hue, e.g. "p-color-unpublished/blue/600" → --nys-color-blue-600).
   * When two collections map to the same CSS name, the higher `priority` wins
   * (Semantic is the published collection).
   */
  collections: {
    Semantic: { priority: 2 },
    Color: { prefix: "color", priority: 1 },
    "Space and Size": { priority: 1 },
    Typography: { priority: 1 },
  },

  /**
   * Mode used when resolving through a collection with several modes.
   * Theme is overridden per agency theme below.
   */
  modes: {
    Theme: "NYS",
    "UI Fidelity": "High",
    Responsive: "Mobile",
  },

  /** Figma Theme mode → theme context in src/resolver.json. */
  themes: {
    admin: "Admin (NYS)",
    business: "Business (NYS)",
    environment: "Environment (NYS)",
    health: "Health (NYS)",
    local: "Local (NYS)",
    safety: "Safety (NYS)",
    transportation: "Transportation (NYS)",
  },

  /**
   * Figma-only variables to publish as new tokens: CSS name → token path.
   * Everything else Figma has that code doesn't is reported, not emitted.
   * @type {Record<string, string>}
   */
  add: {},

  /** Figma numbers are px. These CSS names stay px; every other dimension becomes rem. */
  pxDimensions: [/-(1px|2px)$/, /^--nys-border-width-/, /^--nys-radius-(xs|sm|round)$/],
  remBase: 16,

  /** Figma font style names (STRING variables) → CSS font-weight. */
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  /** Figma holds one family name; CSS gets the full stack. */
  fontFallbacks: {
    "Proxima Nova": [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
    ],
    "Noto Serif": ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
    Oswald: ["Arial", "sans-serif"],
    "Roboto Mono": ["Bitstream Vera Sans Mono", "Consolas", "Courier", "monospace"],
    "D Sari": ["Arial", "sans-serif"],
  },
};
