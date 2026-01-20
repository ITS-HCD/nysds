# NYSDS JSDoc Enhancement PRD

**Version:** 1.0  
**Date:** January 19, 2026  
**Status:** Ready for Implementation  
**Repo:** `/Users/plasticmind/Sites/nys/nysds-mcp`

---

## Executive Summary

This PRD outlines the systematic enhancement of JSDoc documentation across all 26 NYSDS web components. The goal is to enrich the Custom Elements Manifest (CEM) with comprehensive property descriptions, events, slots, CSS custom properties, and usage examples—transforming it from a thin technical reference into a rich AI-consumable knowledge base that powers both the MCP server and the 11ty reference site.

---

## Background & Motivation

### Current State Analysis

| Aspect | Status | Notes |
|--------|--------|-------|
| **Components** | 26 total | 24 public, 2 private (stepper, errormessage internal) |
| **Class-level JSDoc** | ✅ 100% | Basic descriptions present |
| **Property JSDoc** | ❌ None | Relying solely on `@property` decorators |
| **Event JSDoc** | ❌ None | Events dispatched but not documented with `@fires` |
| **CSS Custom Properties** | ❌ None | Not documented in JSDoc (only in SCSS/11ty docs) |
| **Slot Documentation** | ❌ None | No `@slot` tags |
| **Usage Examples** | ❌ None | No `@example` tags |

### What the CEM Currently Captures

The `@custom-elements-manifest/analyzer` extracts:
- Class descriptions (from JSDoc)
- Properties (from `@property` decorators)
- Attributes (from `reflect: true`)
- Types (from TypeScript)
- Default values
- Events (detected from `dispatchEvent` calls, but without descriptions)

### What's Missing for MCP Server & AI Integration

1. **Property descriptions** — AI needs to understand *when* and *how* to use each prop
2. **Event documentation** — `@fires` tags with descriptions for each custom event
3. **CSS Custom Properties** — `@cssprop` tags for theming/customization
4. **Slot documentation** — `@slot` tags for content projection
5. **Usage examples** — `@example` tags with common patterns
6. **Accessibility guidance** — Actionable a11y information in descriptions
7. **Design system context** — When to use vs. when to choose alternatives

---

## Objectives

### Primary Goals

1. **Enrich CEM output** so AI assistants can generate correct, accessible NYSDS markup
2. **Create single source of truth** that serves both MCP server and 11ty reference site
3. **Enable intelligent code generation** through RFC 2119 keywords (MUST, SHOULD, AVOID)
4. **Document all public API surfaces** including events, slots, and CSS custom properties

### Success Metrics

| Metric | Target |
|--------|--------|
| Property descriptions | 100% of public properties documented |
| Event documentation | 100% of custom events have `@fires` tags |
| CSS custom properties | 100% of theming variables documented |
| Slot documentation | 100% of slots have `@slot` tags |
| Usage examples | At least 2 `@example` blocks per component |

---

## Technical Approach

### JSDoc Enhancement Pattern

Each component should follow this comprehensive JSDoc structure:

```typescript
/**
 * @element nys-button
 * @summary A button component supporting multiple styles, sizes, and icons.
 *
 * @description
 * The `<nys-button>` component is a reusable button that can act as a native
 * button or a link. It is form-associated and supports keyboard accessibility.
 * Use `filled` variant for primary actions, `outline` for secondary, `ghost` for
 * uncommon actions, and `text` for inline actions.
 *
 * @slot prefix-icon - Content before the label (typically an icon via nys-icon)
 * @slot suffix-icon - Content after the label (typically an icon via nys-icon)
 * @slot circle-icon - Icon content for circle mode buttons
 *
 * @cssprop [--nys-button-color] - Text color of label
 * @cssprop [--nys-button-color--hover] - Text color on hover
 * @cssprop [--nys-button-color--active] - Text color when active/pressed
 * @cssprop [--nys-button-background-color] - Background color
 * @cssprop [--nys-button-background-color--hover] - Background color on hover
 * @cssprop [--nys-button-background-color--active] - Background color when active
 * @cssprop [--nys-button-border-color] - Border color
 * @cssprop [--nys-button-border-color--hover] - Border color on hover
 * @cssprop [--nys-button-border-color--active] - Border color when active
 *
 * @fires nys-click - Fired when the button is clicked (mouse or keyboard)
 * @fires nys-focus - Fired when the button receives focus
 * @fires nys-blur - Fired when the button loses focus
 *
 * @example Basic button
 * ```html
 * <nys-button label="Submit" variant="filled"></nys-button>
 * ```
 *
 * @example Button with icons
 * ```html
 * <nys-button label="Previous" prefixIcon="chevron_left"></nys-button>
 * <nys-button label="Next" suffixIcon="chevron_right"></nys-button>
 * ```
 *
 * @example Link-style button
 * ```html
 * <nys-button label="Visit NY.gov" href="https://www.ny.gov/" target="_blank"></nys-button>
 * ```
 */
export class NysButton extends LitElement {
  /**
   * The visible text label displayed on the button.
   * Use clear, action-oriented text like "Submit Application" or "Save Draft".
   * For icon-only buttons with `circle` mode, this becomes the aria-label.
   */
  @property({ type: String }) label = "";

  /**
   * Controls button height and padding.
   * - `sm`: 40px height, compact spacing. Use for dense UIs or secondary actions.
   * - `md`: 48px height (default). Use for most standard interactions.
   * - `lg`: 56px height. Use for prominent CTAs or mobile-first designs.
   * @default "md"
   */
  @property({ type: String, reflect: true }) size: "sm" | "md" | "lg" = "md";

  /**
   * Visual style variant affecting semantic meaning.
   * - `filled`: Primary actions (one per section maximum)
   * - `outline`: Secondary actions alongside a primary button
   * - `ghost`: Additional actions beyond primary/secondary
   * - `text`: Inline actions within text blocks. Avoid for navigation—use links.
   * @default "filled"
   */
  @property({ type: String, reflect: true }) variant:
    | "filled"
    | "outline"
    | "ghost"
    | "text" = "filled";

  /**
   * When true, renders the button for use on dark backgrounds.
   * Automatically adjusts colors for proper contrast.
   */
  @property({ type: Boolean, reflect: true }) inverted = false;

  /**
   * Name of a Material Symbol icon to display before the label.
   * View available icons at /components/icon/. Icons are not shown for `text` variant.
   * Example: `prefixIcon="chevron_left"`
   */
  @property({ type: String }) prefixIcon = "";

  /**
   * Name of a Material Symbol icon to display after the label.
   * Commonly used for dropdown indicators (`chevron_down`) or external links (`open_in_new`).
   */
  @property({ type: String }) suffixIcon = "";

  /**
   * When true, renders a compact circular button. Must provide `icon` prop.
   * The `label` or `icon` name becomes the aria-label for accessibility.
   * Note: `prefixIcon` and `suffixIcon` are ignored in circle mode.
   */
  @property({ type: Boolean, reflect: true }) circle = false;

  /**
   * Icon name for circle mode buttons. Required when `circle` is true.
   * Size automatically scales: sm=24px, md=32px, lg=40px.
   */
  @property({ type: String }) icon = "";

  /**
   * When true, prevents all interaction and applies disabled styling.
   * Avoid disabling buttons without explaining why—consider showing validation errors instead.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Button behavior in form context.
   * - `button`: Standard button, no form interaction (default)
   * - `submit`: Submits the nearest form when clicked
   * - `reset`: Resets all form inputs to default values
   * Always set explicitly; browsers default to `submit` which may cause unintended form submissions.
   * @default "button"
   */
  @property({ type: String, reflect: true }) type:
    | "submit"
    | "reset"
    | "button" = "button";

  /**
   * When set, renders the button as an `<a>` tag for navigation.
   * Use for navigation to other pages. For in-app actions, omit href and use events.
   */
  @property({ type: String }) href = "";

  /**
   * Where to open the linked URL when `href` is set.
   * Use `_blank` for external links (consider adding external link icon via `suffixIcon`).
   * @default "_self"
   */
  @property({ type: String, reflect: true }) target:
    | "_self"
    | "_blank"
    | "_parent"
    | "_top"
    | "framename" = "_self";

  /**
   * When true, button expands to fill container width.
   * Useful for mobile layouts or stacked button groups.
   */
  @property({ type: Boolean, reflect: true }) fullWidth = false;

  // ... additional properties follow same pattern
}
```

### Key Documentation Principles

#### 1. Use RFC 2119 Keywords for Actionable Guidance

AI systems extract actionable guidelines using these keywords:
- **MUST / must** — Required behavior
- **SHOULD / should** — Recommended practice
- **AVOID / avoid** — Discouraged patterns
- **USE / use** — Preferred approaches

```typescript
/**
 * Visual style variant affecting semantic meaning.
 * Use `filled` for primary actions—there should be only one per section.
 * Use `outline` for secondary actions alongside a primary button.
 * Avoid using multiple `filled` buttons in the same view.
 */
```

#### 2. Include Usage Context

AI needs to understand *when* to use each option:

```typescript
/**
 * Controls button height and padding.
 * - `sm`: 40px height. Use for dense UIs, table rows, or secondary actions.
 * - `md`: 48px height (default). Use for most standard interactions.
 * - `lg`: 56px height. Use for prominent CTAs, mobile-first, or marketing pages.
 */
```

#### 3. Document Accessibility Implications

```typescript
/**
 * Accessible label for screen readers when no visible label is present.
 * Must be provided for icon-only buttons (circle mode).
 * Screen readers announce this value, so use action-oriented text.
 */
@property({ type: String }) ariaLabel = "";
```

#### 4. Note Relationships Between Properties

```typescript
/**
 * When true, renders a compact circular button.
 * Requires: `icon` prop must be set.
 * Ignores: `prefixIcon`, `suffixIcon`, and visible `label`.
 * Accessibility: The `label` or `icon` name becomes the aria-label.
 */
@property({ type: Boolean, reflect: true }) circle = false;
```

---

## Data Sources

### Primary: 11ty Documentation Site

Location: `/Users/plasticmind/Sites/nys/nysds-site/src/content/components/`

Each component has a Markdown file containing:
- **Usage guidance** — When to use, when not to use
- **Do/Don't lists** — Best practices
- **Accessibility notes** — Screen reader behavior, keyboard support
- **CSS variables** — Full list with descriptions
- **Events** — Custom event documentation
- **Examples** — Code snippets for common patterns

**Example extraction from `button.md`:**

| Section | JSDoc Target |
|---------|--------------|
| `{% block usage %}` | Class-level `@description` |
| `{% block usagedo %}` | Property descriptions, examples |
| `{% block usagedont %}` | Property descriptions (what to avoid) |
| `{% block accessibility %}` | Class-level description, property descriptions |
| `{% block cssvariables %}` | `@cssprop` tags |
| `{% block events %}` | `@fires` tags |
| `{% block options %}` | Property descriptions |

### Secondary: SCSS Files

Location: `packages/{component}/src/{component}.scss`

Contains CSS custom property definitions with fallback values. Extract the public API (non-underscore-prefixed) variables:

```scss
/* In SCSS */
--_nys-button-color: var(--nys-button-color, var(--nys-color-text-reverse, #ffffff));
```

Document in JSDoc:
```typescript
/** @cssprop [--nys-button-color] - Text color of the button label */
```

### Tertiary: Component Source

Location: `packages/{component}/src/{component}.ts`

Review actual implementation for:
- Event dispatch patterns (for `@fires` accuracy)
- Slot usage in `render()` method (for `@slot` tags)
- Default values and type constraints

---

## Implementation Plan

### Phase 1: Template & Validation (Days 1-2)

1. **Create reference implementation** — Fully document `nys-button` as the gold standard
2. **Update CEM config** — Add custom plugin for any new tags if needed
3. **Validate CEM output** — Ensure enhanced JSDoc produces expected manifest structure
4. **Document the pattern** — Create internal guide for team consistency

### Phase 2: Form Components (Days 3-5)

High-complexity, high-usage components:
- `nys-textinput`
- `nys-textarea`
- `nys-select`
- `nys-checkbox` / `nys-checkboxgroup`
- `nys-radiobutton`
- `nys-toggle`
- `nys-fileinput`

### Phase 3: Display Components (Days 6-7)

- `nys-alert`
- `nys-badge`
- `nys-avatar`
- `nys-icon`
- `nys-tooltip`
- `nys-divider`
- `nys-modal`

### Phase 4: Navigation & Layout (Days 8-9)

- `nys-accordion` / `nys-accordionitem`
- `nys-pagination`
- `nys-stepper`
- `nys-skipnav`
- `nys-backtotop`

### Phase 5: Global Components (Day 10)

- `nys-globalheader`
- `nys-globalfooter`
- `nys-unavheader`
- `nys-unavfooter`
- `nys-label`
- `nys-errormessage`

### Phase 6: Verification & Commit (Day 11)

1. **Run CEM analyzer** — `npm run cem`
2. **Validate output** — Check `dist/custom-elements.json` structure
3. **Test MCP server** — Verify tools return enhanced documentation
4. **Commit changes** — Single commit per component or batched by phase

---

## Component Reference

### Full Component List with Priority

| Component | Priority | Complexity | 11ty Doc | Notes |
|-----------|----------|------------|----------|-------|
| `nys-button` | P0 | High | ✅ | Reference implementation |
| `nys-textinput` | P0 | High | ✅ | Form validation, masking |
| `nys-select` | P0 | High | ✅ | Options, search |
| `nys-checkbox` | P0 | Medium | ✅ | Includes checkboxgroup |
| `nys-radiobutton` | P0 | Medium | ✅ | Similar to checkbox |
| `nys-alert` | P0 | Medium | ✅ | Multiple types |
| `nys-modal` | P0 | High | ✅ | Focus management |
| `nys-textarea` | P1 | Medium | ✅ | Similar to textinput |
| `nys-toggle` | P1 | Low | ✅ | Simple boolean |
| `nys-fileinput` | P1 | Medium | ✅ | File handling |
| `nys-accordion` | P1 | Medium | ✅ | Parent/child pattern |
| `nys-pagination` | P1 | Medium | ✅ | Navigation logic |
| `nys-tooltip` | P1 | Medium | ✅ | Positioning |
| `nys-badge` | P2 | Low | ✅ | Simple display |
| `nys-avatar` | P2 | Medium | ✅ | Image/initials fallback |
| `nys-icon` | P2 | Low | ✅ | Icon library |
| `nys-divider` | P2 | Low | ✅ | Minimal props |
| `nys-stepper` | P2 | High | ✅ | Internal use mainly |
| `nys-backtotop` | P2 | Low | ✅ | Auto-behavior |
| `nys-skipnav` | P2 | Low | ✅ | A11y utility |
| `nys-globalheader` | P1 | High | ✅ | Agency branding |
| `nys-globalfooter` | P1 | Medium | ✅ | Agency branding |
| `nys-unavheader` | P2 | Medium | ✅ | Universal nav |
| `nys-unavfooter` | P2 | Medium | ✅ | Universal nav |
| `nys-label` | P2 | Low | ❌ | Internal utility |
| `nys-errormessage` | P2 | Low | ❌ | Internal utility |

---

## CSS Custom Properties per Component

### nys-button
```typescript
/** @cssprop [--nys-button-color] - Text color of label */
/** @cssprop [--nys-button-color--hover] - Text color when hovered */
/** @cssprop [--nys-button-color--active] - Text color when active */
/** @cssprop [--nys-button-background-color] - Background color */
/** @cssprop [--nys-button-background-color--hover] - Background on hover */
/** @cssprop [--nys-button-background-color--active] - Background when active */
/** @cssprop [--nys-button-border-color] - Border color */
/** @cssprop [--nys-button-border-color--hover] - Border on hover */
/** @cssprop [--nys-button-border-color--active] - Border when active */
```

*Note: Extract CSS custom properties from each component's SCSS file. Only document the public API variables (without underscore prefix).*

---

## Events per Component

### nys-button
```typescript
/** @fires nys-click - Fired when the button is clicked */
/** @fires nys-focus - Fired when the button receives focus */
/** @fires nys-blur - Fired when the button loses focus */
```

### nys-textinput
```typescript
/** @fires nys-input - Fired on each input, detail contains {id, value} */
/** @fires nys-focus - Fired when the input receives focus */
/** @fires nys-blur - Fired when the input loses focus (triggers validation) */
```

### nys-checkbox
```typescript
/** @fires nys-change - Fired when checked state changes, detail contains {id, name, value, checked} */
/** @fires nys-focus - Fired when the checkbox receives focus */
/** @fires nys-blur - Fired when the checkbox loses focus */
```

*Note: Review each component's source for `dispatchEvent` calls to document all events.*

---

## Slots per Component

### nys-button
```typescript
/** @slot prefix-icon - Custom icon before label (receives nys-icon) */
/** @slot suffix-icon - Custom icon after label (receives nys-icon) */
/** @slot circle-icon - Icon for circle mode */
```

### nys-textinput
```typescript
/** @slot description - Custom description content below label */
/** @slot startButton - Button at the start of the input */
/** @slot endButton - Button at the end of the input */
```

### nys-alert
```typescript
/** @slot - Default slot for alert body content */
```

*Note: Review each component's `render()` method for `<slot>` elements.*

---

## Git Workflow

### Branch Strategy

```
main
└── feature/jsdoc-enhancement
    ├── Commit: "docs(nys-button): enhance JSDoc with full CEM annotations"
    ├── Commit: "docs(nys-textinput): enhance JSDoc..."
    └── ...
```

### Commit Convention

```
docs({component}): enhance JSDoc with full CEM annotations

- Add property descriptions with usage guidance
- Add @fires tags for all custom events
- Add @cssprop tags for theming variables
- Add @slot tags for content projection
- Add @example blocks for common patterns
- Add @summary and @description for class-level docs
```

### Before Committing

1. Run `npm run cem` to regenerate manifest
2. Verify `dist/custom-elements.json` contains new documentation
3. Run `npm run lint` to catch any formatting issues
4. Test with MCP Inspector if available

---

## Validation Checklist

For each component, verify:

- [ ] Class has `@element`, `@summary`, `@description`
- [ ] All public properties have JSDoc descriptions
- [ ] All custom events have `@fires` tags
- [ ] All CSS custom properties have `@cssprop` tags
- [ ] All slots have `@slot` tags
- [ ] At least 2 `@example` blocks present
- [ ] RFC 2119 keywords used for actionable guidance
- [ ] Accessibility implications documented
- [ ] Property relationships/dependencies noted
- [ ] Default values mentioned where non-obvious
- [ ] CEM output validated after changes

---

## Appendix: Reference Implementation

See `packages/nys-button/src/nys-button.ts` after Phase 1 completion for the fully documented reference implementation.

---

## Appendix: Related Documentation

- [Effective Writing for AI](https://bennypowers.dev/cem/docs/mcp/writing-descriptions/) — Best practices for CEM descriptions
- [Tyler Forge MCP](https://github.com/tyler-technologies-oss/forge-mcp) — Reference implementation
- [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/) — CEM specification
- **NYSDS 11ty Docs:** `/Users/plasticmind/Sites/nys/nysds-site/src/content/components/`
- **MCP Server PRD:** `/Users/plasticmind/Sites/nys/nysds-mcp/PRD.md`
