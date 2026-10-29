# Figma ↔ code token drift

Generated 2026-10-24T22:58:25.348Z by `scripts/css-diff.mjs --drift`.

Figma file `xNdGOyHyVVHWlQIyEQEL9t`. Before: snapshot `pre-pull`; after: `post-pull`.

Figma is the source of truth: every **Value differs** row is now the Figma value in `tokens.css`.
Fill in **Team resolution** (e.g. "Figma correct", "fix in Figma", "intentional").

| Section | Count |
|---|---|
| Value differs (code changed to Figma) | 0 |
| Follows a changed alias | 0 |
| In code, missing in Figma (src/tokens.manual.json) | 38 |
| In Figma, excluded (figma.config.mjs) | 73 |
| Possible renames | 6 |
| Type/unit mismatches (kept code) | 0 |

## Value differs

| CSS var | Context | Figma variable | Code (before) | Figma (now) | ΔE | Code raw | Figma raw | Team resolution |
|---|---|---|---|---|---|---|---|---|

## In code, missing in Figma

Kept from `src/tokens.manual.json`. Add them to Figma (then delete them there) or deprecate them.

| CSS var | Token | Value | Team resolution |
|---|---|---|---|
| `--nys-gutter-xs` | `gutter.xs` | `1.25rem` | |
| `--nys-gutter-sm` | `gutter.sm` | `1.25rem` | |
| `--nys-gutter-md` | `gutter.md` | `2rem` | |
| `--nys-gutter-lg` | `gutter.lg` | `2rem` | |
| `--nys-gutter-xl` | `gutter.xl` | `4rem` | |
| `--nys-shadow-raised` | `shadow.raised` | `0px 4px 6px -1px #0000001a, 0px 4px 6px -1px #00000003` | |
| `--nys-shadow-overlay` | `shadow.overlay` | `0px 25px 50px -12px #0000004d` | |
| `--nys-font-family-alt` | `font.family.alt` | `"Oswald", "Arial", sans-serif` | |
| `--nys-font-family-monospace` | `font.family.monospace` | `"Roboto Mono Web", "Bitstream Vera Sans Mono", "Consolas", "Courier", monospace` | |
| `--nys-font-size-body-lg` | `font.size.body-lg` | `1.125rem` | |
| `--nys-font-size-h1` | `font.size.h1` | `2.5rem` | |
| `--nys-font-size-h2` | `font.size.h2` | `2rem` | |
| `--nys-font-size-h3` | `font.size.h3` | `1.75rem` | |
| `--nys-font-size-h4` | `font.size.h4` | `1.375rem` | |
| `--nys-font-size-h5` | `font.size.h5` | `1.375rem` | |
| `--nys-font-size-h6` | `font.size.h6` | `1.125rem` | |
| `--nys-font-weight-thin` | `font.weight.thin` | `100` | |
| `--nys-font-weight-medium` | `font.weight.medium` | `500` | |
| `--nys-font-weight-semibold` | `font.weight.semibold` | `600` | |
| `--nys-font-weight-extrabold` | `font.weight.extrabold` | `800` | |
| `--nys-font-weight-black` | `font.weight.black` | `900` | |
| `--nys-font-lineheight-h1` | `font.lineheight.h1` | `2.5rem` | |
| `--nys-font-lineheight-h2` | `font.lineheight.h2` | `2.25rem` | |
| `--nys-font-lineheight-h3` | `font.lineheight.h3` | `2rem` | |
| `--nys-font-lineheight-h4` | `font.lineheight.h4` | `2rem` | |
| `--nys-font-lineheight-h5` | `font.lineheight.h5` | `1.75rem` | |
| `--nys-font-lineheight-h6` | `font.lineheight.h6` | `1.75rem` | |
| `--nys-font-letterspacing-negative-200` | `font.letterspacing.negative-200` | `-0.02rem` | |
| `--nys-font-letterspacing-h1` | `font.letterspacing.h1` | `0rem` | |
| `--nys-font-letterspacing-h2` | `font.letterspacing.h2` | `0.0008rem` | |
| `--nys-font-letterspacing-h3` | `font.letterspacing.h3` | `0.0008rem` | |
| `--nys-font-letterspacing-h4` | `font.letterspacing.h4` | `0.0011rem` | |
| `--nys-font-letterspacing-h5` | `font.letterspacing.h5` | `0.0011rem` | |
| `--nys-font-letterspacing-h6` | `font.letterspacing.h6` | `0.0017rem` | |
| `--nys-font-decoration-thickness-regular` | `font.decoration.thickness.regular` | `7%` | |
| `--nys-font-decoration-thickness-strong` | `font.decoration.thickness.strong` | `14%` | |
| `--nys-decoration-thickness-regular` | `decoration.thickness.regular` | `7%` | |
| `--nys-decoration-thickness-strong` | `decoration.thickness.strong` | `14%` | |

## In Figma, excluded

Not published: matched by `exclude` in `figma.config.mjs`. Remove a pattern to publish it.

| CSS var (derived) | Figma variable | Type | Value | Team resolution |
|---|---|---|---|---|
| `--nys-` | Typography / Header | STRING | `{headerText}` | |
| `--nys-color-gray-10` | Semantic / !-nys/color/gray/10 | COLOR | `{primitive.color.neutral.10}` | |
| `--nys-color-gray-50` | Semantic / !-nys/color/gray/50 | COLOR | `{primitive.color.neutral.50}` | |
| `--nys-color-gray-100` | Semantic / !-nys/color/gray/100 | COLOR | `{primitive.color.neutral.100}` | |
| `--nys-color-gray-200` | Semantic / !-nys/color/gray/200 | COLOR | `{primitive.color.neutral.200}` | |
| `--nys-color-gray-300` | Semantic / !-nys/color/gray/300 | COLOR | `{primitive.color.neutral.300}` | |
| `--nys-color-gray-400` | Semantic / !-nys/color/gray/400 | COLOR | `{primitive.color.neutral.400}` | |
| `--nys-color-gray-500` | Semantic / !-nys/color/gray/500 | COLOR | `{primitive.color.neutral.500}` | |
| `--nys-color-gray-600` | Semantic / !-nys/color/gray/600 | COLOR | `{primitive.color.neutral.600}` | |
| `--nys-color-gray-700` | Semantic / !-nys/color/gray/700 | COLOR | `{primitive.color.neutral.700}` | |
| `--nys-color-gray-800` | Semantic / !-nys/color/gray/800 | COLOR | `{primitive.color.neutral.800}` | |
| `--nys-color-gray-900` | Semantic / !-nys/color/gray/900 | COLOR | `{primitive.color.neutral.900}` | |
| `--nys-color-link-visited` | Semantic / !-nys/color-@/link-visited | COLOR | `{primitive.color.health-purple.700}` | |
| `--nys-color-link-visited-reverse` | Semantic / !-nys/color-@/link-visited-reverse | COLOR | `{primitive.color.health-purple.300}` | |
| `--nys-color-link-visited-strong` | Semantic / !-nys/color-@/link-visited-strong | COLOR | `{primitive.color.health-purple.800}` | |
| `--nys-color-none` | Color / p-color-unpublished/none | COLOR | `#ffffff00` | |
| `--nys-font-family-hand-drawn` | Typography / p-type-unpublished/#-font-family/hand drawn | STRING | `Comic Sans MS` | |
| `--nys-font-family-mono` | Typography / p-type-unpublished/#-font-family/mono | STRING | `Roboto Mono` | |
| `--nys-font-family-placeholder` | Semantic / !-nys/font-family/placeholder | STRING | `{font.family.sans}` | |
| `--nys-font-family-scribble` | Typography / p-type-unpublished/#-font-family/scribble | STRING | `Redacted Script` | |
| `--nys-font-letterspacing-heading-h1` | Semantic / !-nys/font-letterspacing/heading/h1 | FLOAT | `{font.letterspacing.0}` | |
| `--nys-font-letterspacing-heading-h2` | Semantic / !-nys/font-letterspacing/heading/h2 | FLOAT | `{font.letterspacing.100}` | |
| `--nys-font-letterspacing-heading-h3` | Semantic / !-nys/font-letterspacing/heading/h3 | FLOAT | `{font.letterspacing.100}` | |
| `--nys-font-letterspacing-heading-h4` | Semantic / !-nys/font-letterspacing/heading/h4 | FLOAT | `{font.letterspacing.200}` | |
| `--nys-font-letterspacing-heading-h5` | Semantic / !-nys/font-letterspacing/heading/h5 | FLOAT | `{font.letterspacing.200}` | |
| `--nys-font-letterspacing-heading-h6` | Semantic / !-nys/font-letterspacing/heading/h6 | FLOAT | `{font.letterspacing.300}` | |
| `--nys-font-lineheight-heading-h1` | Semantic / !-nys/font-lineheight/heading/h1 | FLOAT | `2.5rem` | |
| `--nys-font-lineheight-heading-h2` | Semantic / !-nys/font-lineheight/heading/h2 | FLOAT | `2.25rem` | |
| `--nys-font-lineheight-heading-h3` | Semantic / !-nys/font-lineheight/heading/h3 | FLOAT | `2rem` | |
| `--nys-font-lineheight-heading-h4` | Semantic / !-nys/font-lineheight/heading/h4 | FLOAT | `2rem` | |
| `--nys-font-lineheight-heading-h5` | Semantic / !-nys/font-lineheight/heading/h5 | FLOAT | `1.75rem` | |
| `--nys-font-lineheight-heading-h6` | Semantic / !-nys/font-lineheight/heading/h6 | FLOAT | `1.75rem` | |
| `--nys-font-size-heading-h1` | Semantic / !-nys/font-size/heading/h1 | FLOAT | `{font.size.5xl}` | |
| `--nys-font-size-heading-h2` | Semantic / !-nys/font-size/heading/h2 | FLOAT | `{font.size.4xl}` | |
| `--nys-font-size-heading-h3` | Semantic / !-nys/font-size/heading/h3 | FLOAT | `{font.size.3xl}` | |
| `--nys-font-size-heading-h4` | Semantic / !-nys/font-size/heading/h4 | FLOAT | `{font.size.2xl}` | |
| `--nys-font-size-heading-h5` | Semantic / !-nys/font-size/heading/h5 | FLOAT | `{font.size.xl}` | |
| `--nys-font-size-heading-h6` | Semantic / !-nys/font-size/heading/h6 | FLOAT | `{font.size.lg}` | |
| `--nys-font-weight-body-bold` | Semantic / !-nys/font-weight/body/Bold | STRING | `{font.weight.bold}` | |
| `--nys-font-weight-body-light` | Semantic / !-nys/font-weight/body/Light | STRING | `{font.weight.light}` | |
| `--nys-font-weight-body-regular` | Semantic / !-nys/font-weight/body/Regular | STRING | `{font.weight.regular}` | |
| `--nys-font-weight-body-regular-italic` | Semantic / !-nys/font-weight/body/Regular Italic | STRING | `Regular Italic` | |
| `--nys-font-weight-brand` | Semantic / !-nys/font-weight/brand | STRING | `{font.weight.regular}` | |
| `--nys-font-weight-delete-body-bold` | Typography / p-type-unpublished/#-font-weight/DELETE/body/Bold | STRING | `Bold` | |
| `--nys-font-weight-delete-display-regular` | Typography / p-type-unpublished/#-font-weight/DELETE/display/Regular | STRING | `Regular` | |
| `--nys-font-weight-delete-heading-bold` | Typography / p-type-unpublished/#-font-weight/DELETE/heading/Bold | STRING | `Bold` | |
| `--nys-font-weight-delete-heading-regular` | Typography / p-type-unpublished/#-font-weight/DELETE/heading/Regular | STRING | `Regular` | |
| `--nys-font-weight-display-bold` | Semantic / !-nys/font-weight/display/Bold | STRING | `{font.weight.bold}` | |
| `--nys-font-weight-display-light` | Semantic / !-nys/font-weight/display/Light | STRING | `{font.weight.light}` | |
| `--nys-font-weight-display-regular` | Semantic / !-nys/font-weight/display/Regular | STRING | `{font.weight.regular}` | |
| `--nys-font-weight-heading-bold` | Semantic / !-nys/font-weight/heading/Bold | STRING | `{font.weight.bold}` | |
| `--nys-font-weight-heading-light` | Semantic / !-nys/font-weight/heading/Light | STRING | `{font.weight.light}` | |
| `--nys-font-weight-heading-regular` | Semantic / !-nys/font-weight/heading/Regular | STRING | `{font.weight.regular}` | |
| `--nys-font-weight-regular-italic` | Typography / p-type-unpublished/#-font-weight/Regular Italic | STRING | `Regular Italic` | |
| `--nys-font-weight-semi-bold` | Typography / p-type-unpublished/#-font-weight/Semi Bold | STRING | `Semibold` | |
| `--nys-font-weight-ui-bold` | Semantic / !-nys/font-weight/ui/Bold | STRING | `{font.weight.bold}` | |
| `--nys-font-weight-ui-light` | Semantic / !-nys/font-weight/ui/Light | STRING | `{font.weight.light}` | |
| `--nys-font-weight-ui-regular` | Semantic / !-nys/font-weight/ui/Regular | STRING | `{font.weight.regular}` | |
| `--nys-font-weight-ui-regular-italic` | Semantic / !-nys/font-weight/ui/Regular Italic | STRING | `Regular Italic` | |
| `--nys-font-weight-ui-semi-bold` | Semantic / !-nys/font-weight/ui/Semi Bold | STRING | `Semibold` | |
| `--nys-max-content-width` | Space and Size / p-space-unpublished/max-content-width | FLOAT | `80rem` | |
| `--nys-type-family-body` | Typography / p-typography-unpubished/@-type-family/body | STRING | `{font.family.sans}` | |
| `--nys-type-family-display` | Typography / p-typography-unpubished/@-type-family/display | STRING | `{font.family.sans}` | |
| `--nys-type-family-heading` | Typography / p-typography-unpubished/@-type-family/heading | STRING | `{font.family.sans}` | |
| `--nys-type-family-ui` | Typography / p-typography-unpubished/@-type-family/ui | STRING | `{font.family.sans}` | |
| `--nys-type-size-display-lg` | Typography / p-typography-unpubished/@-type-size/display/lg | FLOAT | `{font.size.8xl}` | |
| `--nys-type-size-display-md` | Typography / p-typography-unpubished/@-type-size/display/md | FLOAT | `{font.size.7xl}` | |
| `--nys-type-size-display-sm` | Typography / p-typography-unpubished/@-type-size/display/sm | FLOAT | `{font.size.6xl}` | |
| `--nys-type-size-display-xl` | Typography / p-typography-unpubished/@-type-size/display/xl | FLOAT | `{font.size.9xl}` | |
| `--nys-type-size-heading-h1` | Typography / p-typography-unpubished/@-type-size/heading/h1 | FLOAT | `{font.size.5xl}` | |
| `--nys-type-size-heading-h2` | Typography / p-typography-unpubished/@-type-size/heading/h2 | FLOAT | `{font.size.4xl}` | |
| `--nys-type-size-ui-lg` | Typography / p-typography-unpubished/@-type-size/ui/lg | FLOAT | `{font.size.lg}` | |
| `--nys-type-size-ui-md` | Typography / p-typography-unpubished/@-type-size/ui/md | FLOAT | `{font.size.md}` | |

## Possible renames

A manual token and an excluded Figma variable with similar names and the same value — likely the same token named differently.

| Code CSS var | Figma variable | Value | Team resolution |
|---|---|---|---|
| `--nys-font-lineheight-h1` | Semantic / !-nys/font-lineheight/heading/h1 (`--nys-font-lineheight-heading-h1`) | `2.5rem` | |
| `--nys-font-lineheight-h2` | Semantic / !-nys/font-lineheight/heading/h2 (`--nys-font-lineheight-heading-h2`) | `2.25rem` | |
| `--nys-font-lineheight-h3` | Semantic / !-nys/font-lineheight/heading/h3 (`--nys-font-lineheight-heading-h3`) | `2rem` | |
| `--nys-font-lineheight-h4` | Semantic / !-nys/font-lineheight/heading/h4 (`--nys-font-lineheight-heading-h4`) | `2rem` | |
| `--nys-font-lineheight-h5` | Semantic / !-nys/font-lineheight/heading/h5 (`--nys-font-lineheight-heading-h5`) | `1.75rem` | |
| `--nys-font-lineheight-h6` | Semantic / !-nys/font-lineheight/heading/h6 (`--nys-font-lineheight-heading-h6`) | `1.75rem` | |

## Type/unit mismatches

None.

## Not synced

- Theme modes with no theme in code: **Community (External)**
