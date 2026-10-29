/**
 * Rules for scripts/figma-to-dtcg.mjs: how the Figma Variables API response in
 * figma/variables.json becomes DTCG tokens in src/tokens.json and src/themes/*.json.
 */
export default {
  /**
   * Collections whose variables become tokens.
   * - prefix: prepended to the variable name (Color names start at the hue,
   *   e.g. "p-color-unpublished/blue/600" → color.blue.600 → --nys-color-blue-600)
   * - layer: leading token path segment ("primitive.…", "applied.…"); dropped
   *   from the CSS name by scripts/lib/variable-name.mjs
   * - priority: when several collections define the same CSS name, the value and
   *   description come from the highest priority (Semantic is the published
   *   collection); the token path comes from the lowest (the primitive).
   */
  collections: {
    Semantic: { layer: "applied", priority: 2 },
    Color: { layer: "primitive", prefix: "color", priority: 1 },
    "Space and Size": { priority: 1 },
    Typography: { priority: 1 },
  },

  /** Leading name words that are two path segments ("font-size/md" → font.size.md). */
  splitPrefixes: ["font", "border", "form", "icon"],

  /**
   * Figma variables that are not published as tokens (listed in the drift report).
   * Anything else in the collections above is published automatically.
   */
  exclude: [
    /^--nys-$/, // unnamed "Header" text variable
    /^--nys-color-none$/,
    /^--nys-color-gray-/, // duplicates of neutral-*
    /^--nys-color-link-visited/,
    /^--nys-font-(size|lineheight|letterspacing)-heading-/, // code uses font-*-h1…h6
    /^--nys-font-weight-(brand|display|heading|body|ui|delete)(-|$)/, // Figma font styles
    /^--nys-font-weight-(semi-bold|regular-italic)$/,
    /^--nys-font-family-(placeholder|mono|scribble|hand-drawn)$/,
    /^--nys-type-(size|family)-/, // Typography-internal intermediates
    /^--nys-max-content-width$/,
  ],

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

  /** Figma numbers are px. These CSS names stay px; every other dimension becomes rem. */
  pxDimensions: [/-(1px|2px)$/, /^--nys-border-width-/, /^--nys-radius-(xs|sm|round)$/],
  remBase: 16,

  /**
   * Token $type by CSS name, for FLOAT/STRING variables (COLOR is always "color";
   * other FLOATs are "dimension").
   */
  types: [
    [/^--nys-font-weight-/, "fontWeight"],
    [/^--nys-font-family-/, "fontFamily"],
  ],

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
