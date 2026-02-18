/** @type {import("stylelint").Config} */
export default {
  rules: {
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "color-function-alias-notation": null,
    "color-function-notation": "legacy",
    "alpha-value-notation": "number",
    "selector-not-notation": "simple",
    "property-no-vendor-prefix": null,
    "declaration-empty-line-before": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "color-hex-length": "long",
    "color-named": "never",
  },
  extends: ["stylelint-config-standard-scss"],
};
