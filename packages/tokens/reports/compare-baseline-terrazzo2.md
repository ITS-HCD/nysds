# baseline → terrazzo2

Generated 2026-10-24T22:48:07.301Z by `scripts/css-diff.mjs`.

| | Before | After |
|---|---|---|
| Snapshot | `baseline` | `terrazzo2` |
| Terrazzo | @terrazzo/cli@0.5.0 | @terrazzo/cli@2.10.0 |

| Result | Count |
|---|---|
| Removed vars | 0 |
| Added vars | 0 |
| Semantic value changes | 71 |
| Format-only changes | 12 |

## Structural notes

- `theme-admin.css` is no longer generated; compared against the admin block in tokens.css
- `theme-business.css` is no longer generated; compared against the business block in tokens.css
- `theme-environment.css` is no longer generated; compared against the environment block in tokens.css
- `theme-health.css` is no longer generated; compared against the health block in tokens.css
- `theme-local.css` is no longer generated; compared against the local block in tokens.css
- `theme-safety.css` is no longer generated; compared against the safety block in tokens.css
- `theme-transportation.css` is no longer generated; compared against the transportation block in tokens.css

## Semantic value changes

| CSS var | Context | Token | Source | Before | After | ΔE | Raw before | Raw after |
|---|---|---|---|---|---|---|---|---|
| `--nys-border-width-lg` | tokens.css :root | `applied.border.width.lg` | src/tokens.json | `4px` | `0.25rem` |  | `4px` | `var(--nys-size-50)` |
| `--nys-color-black-transparent-50` | tokens.css :root | `primitive.color.black-transparent.50` | src/tokens.json | `#00000003` | `#1b1b1b03` | 22.21 | `#00000003` | `#1b1b1b03` |
| `--nys-color-black-transparent-100` | tokens.css :root | `primitive.color.black-transparent.100` | src/tokens.json | `#0000001a` | `#1b1b1b1a` | 22.21 | `#0000001a` | `#1b1b1b1a` |
| `--nys-color-black-transparent-200` | tokens.css :root | `primitive.color.black-transparent.200` | src/tokens.json | `#00000033` | `#1b1b1b33` | 22.21 | `#00000033` | `#1b1b1b33` |
| `--nys-color-black-transparent-300` | tokens.css :root | `primitive.color.black-transparent.300` | src/tokens.json | `#0000004d` | `#1b1b1b4d` | 22.21 | `#0000004d` | `#1b1b1b4d` |
| `--nys-color-black-transparent-400` | tokens.css :root | `primitive.color.black-transparent.400` | src/tokens.json | `#00000066` | `#1b1b1b66` | 22.21 | `#00000066` | `#1b1b1b66` |
| `--nys-color-black-transparent-500` | tokens.css :root | `primitive.color.black-transparent.500` | src/tokens.json | `#00000080` | `#1b1b1b80` | 22.21 | `#00000080` | `#1b1b1b80` |
| `--nys-color-black-transparent-600` | tokens.css :root | `primitive.color.black-transparent.600` | src/tokens.json | `#00000099` | `#1b1b1b99` | 22.21 | `#00000099` | `#1b1b1b99` |
| `--nys-color-black-transparent-700` | tokens.css :root | `primitive.color.black-transparent.700` | src/tokens.json | `#000000b3` | `#1b1b1bb2` | 22.21 | `#000000b3` | `#1b1b1bb2` |
| `--nys-color-black-transparent-800` | tokens.css :root | `primitive.color.black-transparent.800` | src/tokens.json | `#000000cc` | `#1b1b1bcc` | 22.21 | `#000000cc` | `#1b1b1bcc` |
| `--nys-color-black-transparent-900` | tokens.css :root | `primitive.color.black-transparent.900` | src/tokens.json | `#000000e6` | `#1b1b1be5` | 22.21 | `#000000e6` | `#1b1b1be5` |
| `--nys-color-white-transparent-100` | tokens.css :root | `primitive.color.white-transparent.100` | src/tokens.json | `#ffffff1a` | `#ffffff03` | 0.00 | `#ffffff1a` | `var(--nys-color-white-transparent-50)` |
| `--nys-color-white-transparent-700` | tokens.css :root | `primitive.color.white-transparent.700` | src/tokens.json | `#ffffffb3` | `#ffffffb2` | 0.00 | `#ffffffb3` | `#ffffffb2` |
| `--nys-color-white-transparent-900` | tokens.css :root | `primitive.color.white-transparent.900` | src/tokens.json | `#ffffffe6` | `#ffffffe5` | 0.00 | `#ffffffe6` | `#ffffffe5` |
| `--nys-font-letterspacing-100` | tokens.css :root | `font.letterspacing.100` | src/tokens.json | `0.001rem` | `0.0008rem` |  | `0.001rem` | `0.0008rem` |
| `--nys-font-letterspacing-200` | tokens.css :root | `font.letterspacing.200` | src/tokens.json | `0.001rem` | `0.0011rem` |  | `0.001rem` | `0.0011rem` |
| `--nys-font-letterspacing-300` | tokens.css :root | `font.letterspacing.300` | src/tokens.json | `0.002rem` | `0.0017rem` |  | `0.002rem` | `0.0017rem` |
| `--nys-font-letterspacing-400` | tokens.css :root | `font.letterspacing.400` | src/tokens.json | `0.003rem` | `0.0028rem` |  | `0.003rem` | `0.0028rem` |
| `--nys-font-letterspacing-500` | tokens.css :root | `font.letterspacing.500` | src/tokens.json | `0.003rem` | `0.0031rem` |  | `0.003rem` | `0.0031rem` |
| `--nys-font-letterspacing-600` | tokens.css :root | `font.letterspacing.600` | src/tokens.json | `0.004rem` | `0.0035rem` |  | `0.004rem` | `0.0035rem` |
| `--nys-font-letterspacing-body-md` | tokens.css :root | `font.letterspacing.body.md` | src/tokens.json | `0.003rem` | `0.0028rem` |  | `var(--nys-font-letterspacing-400)` | `var(--nys-font-letterspacing-400)` |
| `--nys-font-letterspacing-body-sm` | tokens.css :root | `font.letterspacing.body.sm` | src/tokens.json | `0.003rem` | `0.0028rem` |  | `var(--nys-font-letterspacing-400)` | `var(--nys-font-letterspacing-400)` |
| `--nys-font-letterspacing-body-xs` | tokens.css :root | `font.letterspacing.body.xs` | src/tokens.json | `0.004rem` | `0.0035rem` |  | `var(--nys-font-letterspacing-600)` | `var(--nys-font-letterspacing-600)` |
| `--nys-font-letterspacing-display-lg` | tokens.css :root | `font.letterspacing.display.lg` | src/tokens.json | `-0.01rem` | `-0.0004rem` |  | `var(--nys-font-letterspacing-negative-100)` | `var(--nys-font-letterspacing-negative-100)` |
| `--nys-font-letterspacing-display-xl` | tokens.css :root | `font.letterspacing.display.xl` | src/tokens.json | `-0.01rem` | `-0.0004rem` |  | `var(--nys-font-letterspacing-negative-100)` | `var(--nys-font-letterspacing-negative-100)` |
| `--nys-font-letterspacing-h2` | tokens.css :root | `font.letterspacing.h2` | src/tokens.json | `0.001rem` | `0.0008rem` |  | `var(--nys-font-letterspacing-100)` | `var(--nys-font-letterspacing-100)` |
| `--nys-font-letterspacing-h3` | tokens.css :root | `font.letterspacing.h3` | src/tokens.json | `0.001rem` | `0.0008rem` |  | `var(--nys-font-letterspacing-100)` | `var(--nys-font-letterspacing-100)` |
| `--nys-font-letterspacing-h4` | tokens.css :root | `font.letterspacing.h4` | src/tokens.json | `0.001rem` | `0.0011rem` |  | `var(--nys-font-letterspacing-200)` | `var(--nys-font-letterspacing-200)` |
| `--nys-font-letterspacing-h5` | tokens.css :root | `font.letterspacing.h5` | src/tokens.json | `0.001rem` | `0.0011rem` |  | `var(--nys-font-letterspacing-200)` | `var(--nys-font-letterspacing-200)` |
| `--nys-font-letterspacing-h6` | tokens.css :root | `font.letterspacing.h6` | src/tokens.json | `0.002rem` | `0.0017rem` |  | `var(--nys-font-letterspacing-300)` | `var(--nys-font-letterspacing-300)` |
| `--nys-font-letterspacing-negative-100` | tokens.css :root | `font.letterspacing.negative-100` | src/tokens.json | `-0.01rem` | `-0.0004rem` |  | `-0.01rem` | `-0.0004rem` |
| `--nys-font-letterspacing-ui-lg` | tokens.css :root | `font.letterspacing.ui.lg` | src/tokens.json | `0.002rem` | `0.0017rem` |  | `var(--nys-font-letterspacing-300)` | `var(--nys-font-letterspacing-300)` |
| `--nys-font-letterspacing-ui-md` | tokens.css :root | `font.letterspacing.ui.md` | src/tokens.json | `0.003rem` | `0.0028rem` |  | `var(--nys-font-letterspacing-400)` | `var(--nys-font-letterspacing-400)` |
| `--nys-font-letterspacing-ui-sm` | tokens.css :root | `font.letterspacing.ui.sm` | src/tokens.json | `0.003rem` | `0.0028rem` |  | `var(--nys-font-letterspacing-400)` | `var(--nys-font-letterspacing-400)` |
| `--nys-font-letterspacing-ui-xl` | tokens.css :root | `font.letterspacing.ui.xl` | src/tokens.json | `0.001rem` | `0.0011rem` |  | `var(--nys-font-letterspacing-200)` | `var(--nys-font-letterspacing-200)` |
| `--nys-font-letterspacing-ui-xs` | tokens.css :root | `font.letterspacing.ui.xs` | src/tokens.json | `0.004rem` | `0.0035rem` |  | `var(--nys-font-letterspacing-600)` | `var(--nys-font-letterspacing-600)` |
| `--nys-font-lineheight-sm` | tokens.css :root | `font.lineheight.sm` | src/tokens.json | `1.375rem` | `1.4rem` |  | `1.375rem` | `1.4rem` |
| `--nys-color-theme-mid` | tokens.css .nys-theme-admin, [data-theme="admin"] | `applied.color.theme-mid` | src/tokens.json | `#c0623b` | `#d07954` | 6.43 | `var(--nys-color-admin-orange-500)` | `var(--nys-color-admin-orange-400)` |
| `--nys-color-theme-weak` | tokens.css .nys-theme-admin, [data-theme="admin"] | `applied.color.theme-weak` | src/tokens.json | `#f3d3c1` | `#e7b59c` | 8.08 | `var(--nys-color-admin-orange-100)` | `var(--nys-color-admin-orange-200)` |
| `--nys-color-theme-weaker` | tokens.css .nys-theme-admin, [data-theme="admin"] | `applied.color.theme-weaker` | src/tokens.json | `#f9e9e0` | `#f3d3c1` | 5.96 | `var(--nys-color-admin-orange-50)` | `var(--nys-color-admin-orange-100)` |
| `--nys-color-theme` | tokens.css .nys-theme-business, [data-theme="business"] | `applied.color.theme` | src/tokens.json | `#084b52` | `#0b5d66` | 6.10 | `var(--nys-color-business-teal-700)` | `var(--nys-color-business-teal-600)` |
| `--nys-color-theme-mid` | tokens.css .nys-theme-environment, [data-theme="environment"] | `applied.color.theme-mid` | src/tokens.json | `#5f7566` | `#7e9084` | 9.56 | `var(--nys-color-environment-green-500)` | `var(--nys-color-environment-green-400)` |
| `--nys-color-theme-weak` | tokens.css .nys-theme-environment, [data-theme="environment"] | `applied.color.theme-weak` | src/tokens.json | `#d9e1dd` | `#bac6bf` | 8.75 | `var(--nys-color-environment-green-100)` | `var(--nys-color-environment-green-200)` |
| `--nys-color-theme-weaker` | tokens.css .nys-theme-environment, [data-theme="environment"] | `applied.color.theme-weaker` | src/tokens.json | `#ecf0ee` | `#d9e1dd` | 4.93 | `var(--nys-color-environment-green-50)` | `var(--nys-color-environment-green-100)` |
| `--nys-color-theme-mid` | tokens.css .nys-theme-health, [data-theme="health"] | `applied.color.theme-mid` | src/tokens.json | `#736289` | `#8b7fa0` | 9.23 | `var(--nys-color-health-purple-500)` | `var(--nys-color-health-purple-400)` |
| `--nys-color-theme-weak` | tokens.css .nys-theme-health, [data-theme="health"] | `applied.color.theme-weak` | src/tokens.json | `#d3d5e3` | `#bbb8cc` | 8.50 | `var(--nys-color-health-purple-100)` | `var(--nys-color-health-purple-200)` |
| `--nys-color-theme-weaker` | tokens.css .nys-theme-health, [data-theme="health"] | `applied.color.theme-weaker` | src/tokens.json | `#e9eaf1` | `#d3d5e3` | 6.34 | `var(--nys-color-health-purple-50)` | `var(--nys-color-health-purple-100)` |
| `--nys-color-theme-mid` | tokens.css .nys-theme-local, [data-theme="local"] | `applied.color.theme-mid` | src/tokens.json | `#745e55` | `#8f7d75` | 10.30 | `var(--nys-color-local-brown-500)` | `var(--nys-color-local-brown-400)` |
| `--nys-color-theme-weak` | tokens.css .nys-theme-local, [data-theme="local"] | `applied.color.theme-weak` | src/tokens.json | `#ddd7d3` | `#c3b9b3` | 9.07 | `var(--nys-color-local-brown-100)` | `var(--nys-color-local-brown-200)` |
| `--nys-color-theme-weaker` | tokens.css .nys-theme-local, [data-theme="local"] | `applied.color.theme-weaker` | src/tokens.json | `#eeebe9` | `#ddd7d3` | 5.92 | `var(--nys-color-local-brown-50)` | `var(--nys-color-local-brown-100)` |
| `--nys-color-theme-mid` | tokens.css .nys-theme-safety, [data-theme="safety"] | `applied.color.theme-mid` | src/tokens.json | `#6f8391` | `#8697a3` | 6.82 | `var(--nys-color-safety-gray-500)` | `var(--nys-color-safety-gray-400)` |
| `--nys-color-theme-mid` | tokens.css .nys-theme-transportation, [data-theme="transportation"] | `applied.color.theme-mid` | src/tokens.json | `#4d83a4` | `#6e9ab5` | 7.97 | `var(--nys-color-transportation-blue-500)` | `var(--nys-color-transportation-blue-400)` |
| `--nys-color-theme-weak` | tokens.css .nys-theme-transportation, [data-theme="transportation"] | `applied.color.theme-weak` | src/tokens.json | `#d5e5eb` | `#b2ccd9` | 8.31 | `var(--nys-color-transportation-blue-100)` | `var(--nys-color-transportation-blue-200)` |
| `--nys-color-theme-weaker` | tokens.css .nys-theme-transportation, [data-theme="transportation"] | `applied.color.theme-weaker` | src/tokens.json | `#eaf2f5` | `#d5e5eb` | 4.53 | `var(--nys-color-transportation-blue-50)` | `var(--nys-color-transportation-blue-100)` |
| `--nys-color-theme-mid` | theme-admin.css | `applied.color.theme-mid` | src/tokens.json | `#c0623b` | `#d07954` | 6.43 | `var(--nys-color-admin-orange-500)` | `var(--nys-color-admin-orange-400)` |
| `--nys-color-theme-weak` | theme-admin.css | `applied.color.theme-weak` | src/tokens.json | `#f3d3c1` | `#e7b59c` | 8.08 | `var(--nys-color-admin-orange-100)` | `var(--nys-color-admin-orange-200)` |
| `--nys-color-theme-weaker` | theme-admin.css | `applied.color.theme-weaker` | src/tokens.json | `#f9e9e0` | `#f3d3c1` | 5.96 | `var(--nys-color-admin-orange-50)` | `var(--nys-color-admin-orange-100)` |
| `--nys-color-theme` | theme-business.css | `applied.color.theme` | src/tokens.json | `#084b52` | `#0b5d66` | 6.10 | `var(--nys-color-business-teal-700)` | `var(--nys-color-business-teal-600)` |
| `--nys-color-theme-mid` | theme-environment.css | `applied.color.theme-mid` | src/tokens.json | `#5f7566` | `#7e9084` | 9.56 | `var(--nys-color-environment-green-500)` | `var(--nys-color-environment-green-400)` |
| `--nys-color-theme-weak` | theme-environment.css | `applied.color.theme-weak` | src/tokens.json | `#d9e1dd` | `#bac6bf` | 8.75 | `var(--nys-color-environment-green-100)` | `var(--nys-color-environment-green-200)` |
| `--nys-color-theme-weaker` | theme-environment.css | `applied.color.theme-weaker` | src/tokens.json | `#ecf0ee` | `#d9e1dd` | 4.93 | `var(--nys-color-environment-green-50)` | `var(--nys-color-environment-green-100)` |
| `--nys-color-theme-mid` | theme-health.css | `applied.color.theme-mid` | src/tokens.json | `#736289` | `#8b7fa0` | 9.23 | `var(--nys-color-health-purple-500)` | `var(--nys-color-health-purple-400)` |
| `--nys-color-theme-weak` | theme-health.css | `applied.color.theme-weak` | src/tokens.json | `#d3d5e3` | `#bbb8cc` | 8.50 | `var(--nys-color-health-purple-100)` | `var(--nys-color-health-purple-200)` |
| `--nys-color-theme-weaker` | theme-health.css | `applied.color.theme-weaker` | src/tokens.json | `#e9eaf1` | `#d3d5e3` | 6.34 | `var(--nys-color-health-purple-50)` | `var(--nys-color-health-purple-100)` |
| `--nys-color-theme-mid` | theme-local.css | `applied.color.theme-mid` | src/tokens.json | `#745e55` | `#8f7d75` | 10.30 | `var(--nys-color-local-brown-500)` | `var(--nys-color-local-brown-400)` |
| `--nys-color-theme-weak` | theme-local.css | `applied.color.theme-weak` | src/tokens.json | `#ddd7d3` | `#c3b9b3` | 9.07 | `var(--nys-color-local-brown-100)` | `var(--nys-color-local-brown-200)` |
| `--nys-color-theme-weaker` | theme-local.css | `applied.color.theme-weaker` | src/tokens.json | `#eeebe9` | `#ddd7d3` | 5.92 | `var(--nys-color-local-brown-50)` | `var(--nys-color-local-brown-100)` |
| `--nys-color-theme-mid` | theme-safety.css | `applied.color.theme-mid` | src/tokens.json | `#6f8391` | `#8697a3` | 6.82 | `var(--nys-color-safety-gray-500)` | `var(--nys-color-safety-gray-400)` |
| `--nys-color-theme-mid` | theme-transportation.css | `applied.color.theme-mid` | src/tokens.json | `#4d83a4` | `#6e9ab5` | 7.97 | `var(--nys-color-transportation-blue-500)` | `var(--nys-color-transportation-blue-400)` |
| `--nys-color-theme-weak` | theme-transportation.css | `applied.color.theme-weak` | src/tokens.json | `#d5e5eb` | `#b2ccd9` | 8.31 | `var(--nys-color-transportation-blue-100)` | `var(--nys-color-transportation-blue-200)` |
| `--nys-color-theme-weaker` | theme-transportation.css | `applied.color.theme-weaker` | src/tokens.json | `#eaf2f5` | `#d5e5eb` | 4.53 | `var(--nys-color-transportation-blue-50)` | `var(--nys-color-transportation-blue-100)` |

## Format-only changes (examples)

Same resolved value, different CSS text.

| CSS var | Context | Before | After |
|---|---|---|---|
| `--nys-border-width-md` | tokens.css :root | `2px` | `var(--nys-size-2px)` |
| `--nys-border-width-sm` | tokens.css :root | `1px` | `var(--nys-size-1px)` |
| `--nys-color-black` | tokens.css :root | `#000000` | `#000` |
| `--nys-color-transparent` | tokens.css :root | `#ffffff00` | `#fff0` |
| `--nys-color-white` | tokens.css :root | `#ffffff` | `#fff` |
| `--nys-color-white-transparent-200` | tokens.css :root | `#ffffff33` | `#fff3` |
| `--nys-color-white-transparent-400` | tokens.css :root | `#ffffff66` | `#fff6` |
| `--nys-color-white-transparent-600` | tokens.css :root | `#ffffff99` | `#fff9` |
| `--nys-color-white-transparent-800` | tokens.css :root | `#ffffffcc` | `#fffc` |
| `--nys-font-letterspacing-0` | tokens.css :root | `0` | `0rem` |
