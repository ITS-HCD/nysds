/** @type {import("stylelint").Config} */
export default {
  rules: {
    // Color
    "color-named": "never",
    "color-hex-length": "long",
    "color-function-notation": "legacy",
    "color-function-alias-notation": null,
    "alpha-value-notation": "number",

    // Selector
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "selector-not-notation": "simple",

    // Property
    "custom-property-pattern": null,
    "property-no-vendor-prefix": null,

    // Declaration
    "declaration-empty-line-before": null,
    "declaration-block-no-redundant-longhand-properties": null,

    // Block
    "block-no-empty": true,
  },
  extends: ["stylelint-config-standard-scss"],
};
