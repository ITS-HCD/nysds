# How the Angular package is built — step by step, and why

`@nysds/angular` ships Angular wrapper components for every NYSDS custom
element. Nothing in `src/` is written by hand: the whole package is
**generated from the Custom Elements Manifest and then compiled with
ng-packagr**. This document walks the pipeline end to end and explains why
every step — and every line of generated code — exists.

```
packages/nys-*/src/*.ts          (the Lit components — the source of truth)
        │
        │  1. npm run cem  (@custom-elements-manifest/analyzer)
        ▼
custom-elements.json             (machine-readable API: tags, props, events)
        │
        │  2. src/scripts/cem-angular-plugin.mjs  (runs inside step 1)
        ▼
packages/angular/src/lib/*.component.ts   (generated wrappers + utils)
packages/angular/src/public-api.ts        (generated barrel)
packages/angular/package.json             (dependencies kept in sync)
        │
        │  3. npm run build -w @nysds/angular  (ng-packagr)
        ▼
packages/angular/dist/           (FESM2022 bundle + flattened .d.ts — what apps consume)
```

---

## What a custom element exposes — and where each piece lands in Angular

A custom element is a complete little framework of its own: it has a tag, two
parallel data APIs (attributes *and* properties), DOM events, slots, methods,
shadow-DOM styling hooks, and its own render loop. Angular has a different
vocabulary — selectors, inputs, outputs, content projection, forms, change
detection. The wrapper's entire job is translating between the two. This
table is the map; the subsections after it explain the entries that aren't
obvious.

| Custom-element surface | Angular concept | Mechanism in the wrapper |
| --- | --- | --- |
| Tag name (`nys-accordion`) | Component `selector` | Wrapper attaches *to* the element; no extra DOM |
| JS **properties** (typed: booleans, numbers, arrays) | Inputs | `inputs: [...]` + `proxyInputs` prototype accessors |
| HTML **attributes** (strings, presence booleans) | — (left alone) | Lit's attribute converters handle them; see 2b′ |
| `CustomEvent`s (`nys-change`, with `detail`) | Outputs | `outputs: [...]` + `proxyOutputs` (`fromEvent`) |
| Slots (default + named light DOM) | Content projection | `<ng-content>` passes children through untouched |
| Element registration (`customElements.define`) | Module import side effect | Wrapper imports its element's subpath module |
| Form behavior (`value`/`checked` + change events) | `ControlValueAccessor` | Generated CVA per control kind |
| Public **methods** (`el.focus()`, etc.) | *Not mapped* | Reach the element via a template ref — see below |
| Element class types (`.d.ts`) | Template type-checking | `import type` + `Pick<>` declaration merging |
| Lit's async render loop | Change detection | `cdr.detach()` + `runOutsideAngular` |
| Shadow-DOM styling (CSS custom properties, `::part`) | *Nothing to map* | Crosses the shadow boundary via global CSS |

### 2b′. Properties vs attributes — the duality that drives the design

Every custom element speaks two languages at once:

- **Attributes** are what you write in HTML: always strings, lowercase,
  presence-based for booleans (`<nys-accordionitem expanded>`). Lit parses
  them through per-property converters (`"3"` → `3`, presence → `true`).
- **Properties** are the JS API on the element instance: fully typed —
  real booleans and numbers, and the only channel that can carry rich data
  at all (`unavheader.languages` is a `Language[]`; there is no attribute
  syntax for that).

Angular's `[binding]` syntax targets **properties** — which is exactly what
you want — but the moment a directive on that element declares an input with
the same name, Angular reroutes the value to the *directive instance* instead
of the DOM property. So the wrapper must pick one side of the duality and
commit: it claims every property as an input and forwards each write to the
element property (`proxyInputs`, 2c). Attributes it deliberately leaves
alone — a static attribute the wrapper doesn't recognize passes through to
the DOM as a plain attribute, where Lit's converter picks it up as usual
(`aria-*`, `data-*`, `class`, `id`-as-attribute all keep working).

Two consequences worth internalizing:

- **Booleans must be property-bound.** `<nys-accordion bordered>` in an
  Angular template is a *static input binding* — the string `""` — delivered
  through the proxy to `el.bordered`, and `""` is falsy. Write
  `[bordered]="true"`. (In plain HTML the same attribute works, because there
  Lit's presence-based converter handles it. The difference is who gets to
  interpret the attribute first.)
- **Rich data just works.** `[languages]="langArray"` hands the actual array
  to the element property — no serialization, no attribute involved. This is
  something the attribute API could never express, and a big part of why the
  wrapper proxies properties rather than reflecting everything to attributes.

### Events: why a DOM event needs an Angular output at all

`(nys-change)="..."` on a plain element would work without any wrapper —
Angular falls back to a native `addEventListener`. The wrapper still declares
every element event as an output for two reasons: **typing** (the merged
interface declares `"nys-change": Observable<CustomEvent>`, so `$event` is a
`CustomEvent` under `strictTemplates`, not `any`) and **shadowing safety**
(the same rule as inputs — once a directive sits on the element, a declared
output with a matching name takes precedence, so declaring them makes the
behavior explicit rather than dependent on what the wrapper happens not to
declare). The `fromEvent` observable subscribes on the element itself, so
nothing is lost to shadow-DOM retargeting, and `detail` arrives intact.

### Slots: mapped by *not* transforming anything

Slots need no Angular feature beyond transparent content projection. The
wrapper's whole template is `<ng-content></ng-content>`, so the consumer's
children become real light-DOM children of the custom element — which is
precisely what `<slot>` machinery expects. Named slots
(`<div slot="footer">`) work because `slot` is just an attribute on those
children and Angular passes it through. The mapping decision here is the
*absence* of one: any wrapper markup between the consumer's children and the
element would break slot assignment.

### Methods: deliberately not proxied

Elements expose imperative API too — `focus()`, `NysIcon.updateComplete`,
etc. Stencil's generated wrappers proxy these; ours don't, on purpose: the
wrapper sits *on* the element, so the element instance is always one
`ElementRef` away:

```ts
@ViewChild("firstName", { read: ElementRef })
private firstNameRef!: ElementRef<NysTextinput>;

focusFirstName(): void {
  this.firstNameRef.nativeElement.focus();
}
```

One subtlety: a bare template ref (`#firstName`) on a component-bearing
element resolves to the *wrapper component instance*, not the DOM element —
that's Angular's default for components. The wrapper's proxied getters make
it read like the element for **properties**, but methods aren't proxied onto
it, hence the explicit `{ read: ElementRef }`. Proxying methods too would
double the generated surface for no capability gain.

### Styling: the boundary Angular never crosses

NYSDS components style themselves inside shadow DOM and expose CSS custom
properties (`--nys-*`) and parts as their theming API. None of that needs a
wrapper mapping: custom properties inherit straight through shadow
boundaries from any global stylesheet (the demo imports
`@nysds/styles` once, globally), and `::part()` selectors work from global
CSS too. What does *not* work is putting those selectors in an Angular
component's own `styles` — Angular's emulated view encapsulation scopes them
with attribute selectors that can't reach into shadow roots. Theme at the
app's global-styles level.

---

## Step 1 — `npm run cem`: build the Custom Elements Manifest

**What happens:** `@custom-elements-manifest/analyzer` parses every component
package's TypeScript and produces `custom-elements.json` — a standardized
description of each custom element: its tag name, class name, public
properties (with types), events, and slots.

**Why it's required:** the Angular wrappers need to know, for every element,
*exactly* which properties and events exist. Reading that from the manifest —
instead of maintaining it by hand — means the wrappers can never drift from
the components. When a component gains a property, rerunning `npm run cem`
regenerates the wrapper with the new input. This is the same mechanism the
React wrappers use; Angular is not special here.

**Practical rule:** never edit anything in `packages/angular/src/`. It is
overwritten on every `npm run cem`. Change the *generator*
(`src/scripts/cem-angular-plugin.mjs`) instead.

## Step 2 — the generator: what each piece of a wrapper does

For each custom element in the manifest, `cem-angular-plugin.mjs` writes one
standalone Angular component. Here is the anatomy of a generated wrapper and
the reason behind every part.

### 2a. Why wrappers exist at all

Angular *can* use custom elements directly: add `CUSTOM_ELEMENTS_SCHEMA`,
side-effect-import each element package, and bind with `[prop]` /
`(nys-event)`. That works — but you give up:

- **Template type-checking.** With the schema, any property name and any
  value type is accepted silently. A typo like `[singelSelect]` compiles.
- **Automatic registration.** Someone has to remember the
  `import "@nysds/nys-accordion";` side-effect import for every element used.
  Forget one and the tag renders as inert unknown HTML — no error.
- **Angular forms.** `[(ngModel)]` and `formControlName` only work with a
  `ControlValueAccessor`, which something has to provide.

The wrapper solves all three: importing `NysAccordionComponent` registers the
element (the wrapper module imports it), inputs are typed against the real
element class, and form components implement `ControlValueAccessor`.

### 2b. Selector = the tag name, template = `<ng-content>`

```ts
@Component({
  selector: "nys-accordion",
  template: "<ng-content></ng-content>",
  ...
})
```

The wrapper does **not** render a `<nys-accordion>` inside itself. Angular
attaches the component *to* the `<nys-accordion>` element the consumer wrote,
so the DOM contains exactly one element — the custom element itself.
`<ng-content>` passes the consumer's children straight through into the
element's light DOM, where the element's own `<slot>`s pick them up. Any
other template would double-wrap the DOM or break slotting.

### 2c. `inputs: [...]` + `proxyInputs` — forwarding properties to the element

This is the most important piece, and it's the bug the previous
implementation had. **When a directive/component on an element declares an
input, Angular delivers `[binding]` values to the component instance — not to
the DOM element.** The old wrappers declared `@Input() singleSelect: any;`
and stopped there: `[singleSelect]="true"` set a field on the wrapper class
that nothing ever read. The custom element never saw the value.

The fix (the same pattern Ionic/Stencil generates) is in
`src/lib/utils.ts`:

```ts
Object.defineProperty(prototype, name, {
  get() { return this.el[name]; },
  set(value) { this.z.runOutsideAngular(() => (this.el[name] = value)); },
});
```

Every input becomes a getter/setter on the wrapper's **prototype** that reads
and writes the underlying element's property. Defined once per class (via the
`@ProxyCmp` decorator), not once per instance, because prototypes are shared.

Why `runOutsideAngular`: setting a Lit reactive property schedules the
element's own async re-render. That scheduling would otherwise be observed by
zone.js and trigger a pointless Angular change-detection pass for work Angular
has no part in.

Why plain accessors instead of Angular signal inputs: the wrapper's job is to
move a value from a template binding onto a DOM property, synchronously, with
no view of its own to update. A signal adds indirection without adding
anything the wrapper can use.

### 2d. Typed inputs without parsing types

```ts
import type { NysAccordion as NysAccordionElement } from "@nysds/nys-accordion";
...
export declare interface NysAccordionComponent
  extends Pick<NysAccordionElement, "bordered" | "headingLevel" | "id" | "singleSelect"> {}
```

Two tricks here:

- **`import type` + `Pick`**: instead of copying type text out of the
  manifest (fragile — types can reference other types), the wrapper imports
  the element *class* type from the component package and picks the input
  properties off it. The types are therefore always literally identical to the
  component's own, and `[headingLevel]="'h7'"` is a template type error.
- **`export declare interface` merging**: TypeScript merges the interface
  into the class, so the component *type* has every element property — but no
  runtime fields are emitted. That matters: a real class field like
  `singleSelect = undefined` would shadow the prototype accessor from 2c and
  break the forwarding.

### 2e. `outputs: [...]` + `proxyOutputs` — events

```ts
proxyOutputs(this, this.el, ["nys-change", "nys-focus", "nys-blur"]);
// utils.ts:
events.forEach((eventName) => (instance[eventName] = fromEvent(el, eventName)));
```

`(nys-change)="..."` on an element with a matching declared output binds to
the *output*, not to the DOM event — same shadowing rule as inputs. So the
wrapper declares each of the element's events as an output and assigns an
rxjs `fromEvent` observable to it. Angular subscribes to whatever
`Subscribable` sits on an output property, and the handler receives the
original `CustomEvent`, `detail` and all.

Event names keep their hyphenated form (`(nys-change)`, not `(nysChange)`) so
Angular templates match the documented event names and plain-HTML examples.

### 2f. `changeDetector.detach()` and `OnPush`

The wrapper's view is a single `<ng-content>` — there is literally nothing
for Angular change detection to update. Detaching removes the wrapper from
the CD tree entirely; the custom element re-renders itself when its
properties change. This also makes the wrappers zoneless-friendly: the demo
app runs `provideZonelessChangeDetection()` with no zone.js at all.

### 2g. The import line — and why per-element subpath exports exist

```ts
import type { NysAccordionItem } from "@nysds/nys-accordion/nys-accordionitem";
import "@nysds/nys-accordion/nys-accordionitem";
```

The bare import is a **side effect**: executing the element's module calls
`customElements.define()`. Using the wrapper is what registers the element —
no separate "load the element" step for consumers.

Historically this was awkward: there is no `@nysds/nys-accordionitem`
package — child elements live inside their parent's package — and the
packages only exported one entry (`"."`). The old generator therefore mapped
every child element back to its parent package and imported the whole thing,
and the React config kept a hand-maintained `tagToPackageMap` for the same
reason.

Now every component package declares one export **per element**, e.g. in
`packages/nys-accordion/package.json`:

```json
"exports": {
  ".":                    { "types": "./dist/index.d.ts",             "import": "./dist/nys-accordion.js" },
  "./nys-accordion":      { "types": "./dist/nys-accordion.d.ts",     "import": "./dist/nys-accordion.js" },
  "./nys-accordionitem":  { "types": "./dist/nys-accordionitem.d.ts", "import": "./dist/nys-accordionitem.js" },
  "./package.json": "./package.json"
}
```

Two pieces of automation keep this true without anyone maintaining it:

- `src/scripts/sync-package-exports.mjs` (runs in `npm run build:packages`)
  scans each package's `src/nys-*.ts` element files and rewrites the
  `exports` map.
- `packageEntries()` in the root `vite.config.js` gives every element file
  its own rollup entry, so `dist/nys-accordionitem.js` actually exists. The
  package-named bundle (`dist/nys-accordion.js`) still builds from
  `src/index.ts` and registers *all* elements in the package, so the `"."`
  import behaves exactly as before.

The wrapper import rule is then trivial: if the element file is named after
the package, import the package root; otherwise import
`@nysds/<package>/<element>`. No mapping table.

### 2h. `ControlValueAccessor` — Angular forms support

`ControlValueAccessor` (CVA) is the adapter Angular forms use to talk to any
control: forms call `writeValue()` to push the model into the view, and the
control calls the registered `onChange` to push user edits back. Native
inputs get CVAs from `FormsModule`; custom elements need their own — that is
what makes `[(ngModel)]` and `formControlName` work on `<nys-textinput>`.

The generator keeps a small config map (`FORM_COMPONENTS`) because three
facts are not derivable from the manifest:

1. **Which property holds the value** — `value` for text-like controls,
   `checked` for checkbox/toggle.
2. **Which event signals a change.** This is per-component and was the source
   of a real bug: the old wrappers listened for `nys-change` on every form
   control, but `nys-textinput`, `nys-textarea`, and `nys-datepicker` only
   fire `nys-input` — so `ngModel` on those controls simply never updated.
   The map now records the event each component actually fires.
3. **Radio semantics.** For radios, the Angular model holds the *selected
   value*, not a boolean, so the radio CVA is generated differently:
   `writeValue(v)` computes `checked = (v === el.value)` — which also
   un-checks the siblings when the model changes — and the change handler
   reports `el.value` only when the element is checked. This mirrors
   Angular's own `RadioControlValueAccessor`.

Each form wrapper also wires `nys-blur` → `onTouched()` (so `touched` state
and "required" validation display work) and `setDisabledState()` →
`el.disabled` (so `form.disable()` reaches the element).

The provider block is the standard Angular registration:

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NysTextinputComponent), multi: true }]
```

`NG_VALUE_ACCESSOR` is a multi-provider that `NgModel`/`FormControlName`
inject to find the control they sit on; `forwardRef` is needed because the
provider references the class inside its own decorator, before the class
exists.

### 2i. The generated barrel and aggregate

- `src/public-api.ts` re-exports every wrapper. This is ng-packagr's entry
  point (see step 3).
- `src/lib/nysds-components.ts` exports `NYSDS_COMPONENTS`, an array of every
  wrapper class, so an app can write
  `imports: [...NYSDS_COMPONENTS]` instead of listing 49 classes.

### 2j. `package.json` dependency sync

The generator rewrites `dependencies` in `packages/angular/package.json` to
list every `@nysds/nys-*` package it generated an import for, at the current
version. Why: the wrappers *runtime-import* those packages, so installing
`@nysds/angular` must install the elements. Automating it means adding a
component can never leave the Angular package with a missing dependency.
(`@nysds/react` has the same list for the same reason.)

## Step 3 — `ng-packagr`: compile like an Angular library

**What happens:** `npm run build -w @nysds/angular` runs
`ng-packagr -p ng-packagr.json`, producing `dist/` with a FESM2022 bundle
(`dist/fesm2022/nysds-angular.mjs`), a single flattened `dist/index.d.ts`,
and a dist `package.json`.

**Why not vite/tsc like every other package:** Angular components cannot be
published as plain compiled JavaScript. Decorators like `@Component` must be
compiled by Angular's compiler (`ngtsc`), and libraries must be compiled in
**partial compilation mode**: the output contains declarations
(`ɵɵngDeclareComponent`) that the *consuming app's* Angular CLI finalizes
with its own Angular version (the "linker"). This is what lets one published
package work across multiple Angular versions. ng-packagr is the official
tool that produces this format (the Angular Package Format); nothing else in
the repo's toolchain can.

Details worth knowing:

- **`ng-packagr.json`** points at the entry file (`src/public-api.ts` — the
  APF convention for a library's public surface) and whitelists the
  `@nysds/*` runtime dependencies via `allowedNonPeerDependencies`.
  ng-packagr refuses regular `dependencies` by default because bundling a
  dependency an app also uses can duplicate it; our element packages are safe
  (they're side-effect modules, external to the bundle) so they are
  explicitly allowed.
- **`@angular/*` are peerDependencies**, never dependencies: the library must
  use the *app's* Angular, not drag in a second copy (two Angular cores in
  one app is a hard failure).
- **`module` / `typings` in `packages/angular/package.json`** point into
  `dist/`, because this repo publishes the package folder itself (not the
  `dist/` folder, which is the other common Angular convention). Before this
  existed the published package had *no entry points at all* — consumers
  could not import it.
- **tsconfig quirk:** `packages/angular/tsconfig.lib.json` keeps its own
  TypeScript version (`~5.8.x` in devDependencies) because each Angular major
  supports a narrow TS range, independent of the repo root's TS version.

## Consuming the package (see `demo/`)

```ts
import { NYSDS_COMPONENTS } from "@nysds/angular"; // or individual components

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ...NYSDS_COMPONENTS],
  ...
})
```

Rules of thumb, each a direct consequence of the design above:

- **Property-bind booleans**: `[bordered]="true"`, not `bordered`. A bare
  static attribute passes the *string* `""` through the input proxy to the
  element property, and `""` is falsy.
- **Events keep their real names**: `(nys-change)="..."`; `$event` is the
  original `CustomEvent` (use `$event.detail`).
- **Forms just work** on the nine form controls, template-driven or reactive,
  because of the generated CVAs (2h).
- **No `CUSTOM_ELEMENTS_SCHEMA`, no manual element imports** — importing the
  wrapper is the registration.
- Works zoneless: the demo bootstraps with `provideZonelessChangeDetection()`.

The demo app (`packages/angular/demo`) renders every component against the
**local** builds — `@nysds/angular` and each `@nysds/nys-*` resolve through
the npm workspace to `packages/*/dist`:

```bash
npm run build:packages          # build tokens/styles/components + wrappers
npm start -w @nysds/angular-demo   # http://localhost:4200
```

## The regeneration workflow

When a component's API changes:

```bash
npm run cem                      # 1. re-analyze → regenerate wrappers (React + Angular)
npm run build:packages           # 2. sync exports maps, rebuild all dists (incl. @nysds/angular)
```

Everything in between — subpath exports, wrapper code, the Angular package's
dependency list, the public-api barrel — is derived, never hand-maintained.

## Appendix: the old confusions, answered

- **"Why did we load APIs separately?"** The old wrappers imported whole
  parent packages (there was no way to import a child element), and nothing
  registered elements for you when using tags directly. Now each wrapper
  imports exactly its own element via subpath exports, and using a wrapper is
  the registration.
- **"Why the component-name mapping tables?"** `tagToPackageMap` existed
  because child elements (e.g. `nys-accordionitem`) have no package of their
  own, so generators had to guess the parent package. The per-element export
  layout makes the mapping mechanical (React still uses the table only to
  find the parent folder; Angular derives it from the manifest's file paths).
- **"Why didn't `[input]` bindings do anything?"** Because declared inputs
  shadow element properties and the old wrappers never forwarded them (2c).
- **"Why didn't `ngModel` work on text inputs?"** Wrong change event in the
  old CVA — `nys-change` instead of `nys-input` (2h).
