# Migrate to @nysds/react and @nysds/angular

**Status:** Draft for the 1.21.0 release, written 2026-09-02 against
`enhancement/nysds-codegen`. Publish through the docs site alongside the
`/get-started/react/` and `/get-started/angular/` pages.

NYSDS 1.21.0 ships two dedicated framework packages, `@nysds/react` and
`@nysds/angular`, generated from the design system's custom elements
manifest. They replace every earlier framework integration path:

| You're using | Status | Move to |
|---|---|---|
| `@nysds/components/react` (subpath wrappers) | Deprecated in 1.21.0, removed in 1.22.0 | `@nysds/react` |
| `@nysds/angular@1.18.2` (or its alphas) from npm | Broken publish, deprecated on npm | `@nysds/angular@1.21.0+` |
| Raw `nys-*` tags in Angular with `CUSTOM_ELEMENTS_SCHEMA` | Works, but no type checking and no forms support | `@nysds/angular` |
| Wrappers built from the `enhancement/react-angular-implementation` or `feature/angular-support` branches | Superseded; branches will be deleted | `@nysds/react` / `@nysds/angular` |

Versions are lockstep: `@nysds/react@1.21.0` and `@nysds/angular@1.21.0`
pair with `@nysds/components@1.21.0`, and each wrapper installs its
`@nysds/nys-*` component packages automatically.

## React: from @nysds/components/react

### 1. Swap the dependency

```sh
npm install @nysds/react
npm uninstall @nysds/components   # unless you still use it directly
```

If other code imports `@nysds/components` for the raw web components or
`custom-elements.json`, keep it; only the `/react` subpath is going
away.

### 2. Update imports

Component names are unchanged. Only the package specifier changes:

```diff
-import { NysButton, NysTextinput } from "@nysds/components/react";
+import { NysButton, NysTextinput } from "@nysds/react";
```

Subpath imports are new and keep the dependency graph narrow:

```tsx
import { NysTextinput } from "@nysds/react/textinput";
```

### 3. Load styles

Import the stylesheet once at your app's entry point if you don't
already:

```tsx
import "@nysds/styles";
```

### 4. What changed underneath

Prop and event names are the same (`label`, `onNysChange`,
`onNysInput`), so most code compiles without edits. Behavior improves:

- **Properties, not attributes.** The old wrappers set primitive props
  as attributes, so a controlled input that re-set the same value after
  user typing didn't round-trip. The new wrappers (built on
  `@lit/react`) set properties. Delete any workarounds that forced a
  re-render or re-set `value` through a ref.
- **Typed events.** Handlers receive typed events with typed `detail`
  (`NysTextinputInputEvent` and friends, exported by each component
  package). The old wrappers' `.d.ts` files had broken type imports;
  suppressions (`// @ts-expect-error`, `skipLibCheck` scoped to these
  wrappers) can come out.
- **Next.js works out of the box.** Every wrapper carries
  `"use client"`. Remove hand-written client-boundary shim files whose
  only job was re-exporting NYSDS wrappers.
- **React 18 and 19** are both supported and covered in CI.
- **React Hook Form:** the package ships a `useNysField` helper for
  binding a controller field to a wrapper. See the package README.

### 5. If you used nysds-jsx.d.ts

The old `@nysds/components/react` folder shipped `nysds-jsx.d.ts` with
JSX type registrations some Vue and Preact setups referenced. That file
is not part of `@nysds/react`. Equivalent typings come from
`@nysds/react`'s own declarations; if your setup needs standalone JSX
registrations for raw tags, tell the NYSDS team — a `@nysds/codegen`
JSX output exists as an option if there's demand.

## Angular: from @nysds/angular@1.18.2

The 1.18.2 package (and both alphas) on npm contained unbuilt source
with no entry points, so nothing imported from it ever worked. Treat
this as a fresh install, not an upgrade:

```sh
npm uninstall @nysds/angular
npm install @nysds/angular@^1.21.0
```

Remove anything you added to make 1.18.2 resolve — path mappings in
`tsconfig.json`, deep imports into the package's `src/`, or a vendored
copy. Then follow the setup in the next section.

Angular `>=20` is required (20, 21, and 22 are tested in CI, zone and
zoneless).

## Angular: from raw tags with CUSTOM_ELEMENTS_SCHEMA

If you followed the earlier docs-site snippet — import
`@nysds/components` for its side effects and add
`CUSTOM_ELEMENTS_SCHEMA` — the wrappers replace all of it.

### 1. Install

```sh
npm install @nysds/angular
```

### 2. Remove the schema, import the components

The wrapper selectors are the tags themselves, so your templates don't
change. Standalone component:

```diff
 @Component({
   standalone: true,
-  schemas: [CUSTOM_ELEMENTS_SCHEMA],
+  imports: [NysTextinputComponent, NysButtonComponent],
   templateUrl: "./form.component.html",
 })
```

NgModule apps import `NysAngularModule` once instead.

Remove the side-effect import of `@nysds/components` from `main.ts`;
each wrapper imports its own `@nysds/nys-*` element.

### 3. Update event bindings

Bind the camelCase outputs instead of the raw DOM event names:

```diff
-<nys-textinput label="Email" (nys-change)="onChange($event)"></nys-textinput>
+<nys-textinput label="Email" (nysChange)="onChange($event)"></nys-textinput>
```

The `$event` is the full `CustomEvent`, now typed — read your payload
from `$event.detail` as before.

### 4. Delete hand-rolled forms glue

Every form component now provides `ControlValueAccessor`, so
`[(ngModel)]`, `formControlName`, and Signal Forms `[formField]` work
directly — including `nys-checkboxgroup` and `nys-radiogroup` at group
level. Remove custom directives or `@ViewChild` bridges that copied
values in and out of the elements:

```html
<nys-textinput label="Email" formControlName="email"></nys-textinput>
```

`FormControl({ disabled: true })` disables the element,
`markAsTouched()` follows `nys-blur`, and `required` participates in
Angular validation. To surface Angular validation errors through the
component's own error display, use the opt-in `nysControlErrors`
directive (see the package README).

### 5. What you gain

Because the wrappers are real Angular components, template type-checking
now covers every binding — `[labell]="x"` is a compile error instead of
a silently ignored attribute. Expect the first build after migrating to
surface typos the schema previously swallowed.

## From the superseded branches

If you built against artifacts from `enhancement/react-angular-implementation`
or `feature/angular-support` (local tarballs, git installs, or copied
wrapper files), discard them and install the published 1.21.0 packages.
The branches are deleted after 1.21.0 ships. Key differences to expect:

- React wrappers import per-component `@nysds/nys-*` packages, not the
  `@nysds/components` bundle.
- Angular inputs actually forward to the element, and outputs actually
  emit; code that worked around silent bindings can go.
- CVA change events match each component's real event (`nys-input`
  versus `nys-change` per component), so form models stop receiving
  stale or garbage values.

## Timeline

| Release | What happens |
|---|---|
| 1.21.0 | `@nysds/react`, `@nysds/angular`, `@nysds/codegen` publish. `@nysds/components/react` is deprecated but still works. |
| 1.22.0 | `@nysds/components/react` and the root `./react` export are removed. |
| 2.0 | Deprecated component events (`nys-fileRemove` and other WS1 legacy shapes) stop firing. |

Migrate React imports before 1.22.0. Everything else can move at your
own pace within 1.x.
