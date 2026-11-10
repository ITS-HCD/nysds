# WS1: Component event and property contract

**Goal:** Every form component exposes the same, documented, typed contract so the framework generators need no per-component knowledge. Fix the inconsistencies that currently break Angular forms.
**Depends on:** WS0.
**Owns:** `packages/nys-{textinput,textarea,select,checkbox,radiobutton,toggle,fileinput,datepicker,combobox,button}/src/*.ts`, `packages/internals/src/*.ts`, the JSDoc on those classes. Nothing outside `packages/nys-*` and `packages/internals`.
**Branch:** one branch per component (`feat/fw-1-<component>`) so several agents can work in parallel. `packages/internals` changes go first on `feat/fw-1-internals`.

## The contract

Every form component (anything extending `NysFormControlElement`):

| Aspect | Rule |
|---|---|
| Committed value change | Fires `nys-change`. `detail` includes `id`, `name`, and the bound value under the key named by the component's `kind` (`value`, `checked`, or `files`). Always `bubbles: true, composed: true`. |
| Live input (text-like only) | Fires `nys-input` with the same detail shape as `nys-change`. `detail.value` is the component's `value`, never internal filter text. |
| Focus / blur | Fires `nys-focus` and `nys-blur` on the host, plain `Event`, `bubbles: true, composed: true`. Every form component fires both. |
| Bound value is public | The property named by `kind` is a public `@property`. Groups (`nys-radiogroup`, `nys-checkboxgroup`) expose `value` (`string` for radiogroup, `string[]` for checkboxgroup). Setting it programmatically updates children and the form value but does not fire `nys-change` (frameworks call `writeValue` without expecting an echo). |
| External error | `showError: boolean` and `errorMessage: string` are the only external error inputs. A component never overwrites a consumer-supplied `errorMessage`; it stores its own validation text separately and renders `errorMessage ?? internalMessage`. Same precedence in every component. |
| Metadata | Class JSDoc carries `@formControl <kind> <changeEvent> [inputEvent]` and one `@fires <event> {<TypeAlias>}` per event actually dispatched. No `@fires` for events the class doesn't dispatch itself. |
| Types | The package exports `Nys<Component><Event>Detail` interfaces and `Nys<Component><Event>Event = CustomEvent<Detail>` aliases from its `index.ts`. |
| Public surface | Anything not meant for consumers is `@state()`, `private`, or `protected`. No public `@property` with a leading underscore. |
| Event names | kebab-case, `nys-` prefix, lowercase. |

Non-form components keep their events but get the same `@fires {Type}` annotations and exported detail types.

## Compatibility rule for 1.x

Additive only. New events fire alongside existing ones. Where an event's detail gains a key, keep the old keys. Where an event is wrong (for example `nys-combobox`'s `nys-input.detail.value`), fix the value and note it in the changelog as a bug fix. Where an event is renamed (`nys-fileRemove`), fire both names for the rest of 1.x. There's no way to detect a listener on the old name, so the deprecation lives in the changelog and the JSDoc `@deprecated` tag; the old name goes away in 2.0.

## Per-component tasks

Each row is a self-contained unit of work. An agent takes one row, reads the component source and tests, applies the changes, updates JSDoc and exported types, updates or adds tests, and stops. The agent lists `cd packages/nys-<name> && npm test` for the user.

### internals (do first)

- Add `packages/internals/src/form-events.ts`: helpers `dispatchNysEvent(host, name, detail)` (always bubbles + composed) and `dispatchNysFocusBlur(host, "focus" | "blur")`. Export from `index.ts`.
- Add to `NysFormControlElement`: a protected `_externalErrorMessage` pattern, or document the precedence rule as a mixin helper `resolvedErrorMessage()` returning `this.errorMessage || this._validationMessage`. Pick whichever needs fewer per-component edits; document the choice in the PR.
- Add `FormControlKind = "value" | "checked" | "files"` to `types.ts` (used by codegen's parser for validation).

### nys-textinput

- `nys-input` is dispatched twice (L462, L543). Dispatch once per input.
- Add `nys-change` on native `change` (commit on blur/enter) with `{ id, name, value }`.
- `nys-input` detail: add `name`.
- Stop overwriting `errorMessage` in `_setValidityMessage`; use the internals precedence helper. Remove the `_originalErrorMessage` dance.
- JSDoc: `@formControl value nys-change nys-input`; `@fires nys-input {NysTextinputInputEvent}`, `@fires nys-change {NysTextinputChangeEvent}`, `@fires nys-focus {Event}`, `@fires nys-blur {Event}`.
- Export detail types and aliases.

### nys-textarea

- Same as textinput: add `nys-change`, add `name` to details, error precedence.
- `nys-select` and `nys-selectionchange` are legitimate; keep them, add `@fires` and types for both.
- `@formControl value nys-change nys-input`.

### nys-select

- `nys-change` detail: add `name`.
- Error precedence helper.
- `@formControl value nys-change`.
- `nys-option`: no form contract; keep the define guard from WS0.

### nys-checkbox

- `nys-focus`/`nys-blur`: use the internals helper so they bubble and compose. This is the one outright bug.
- `nys-change` detail already `{ id, checked, name, value }`. Keep.
- `nys-error` / `nys-error-clear` are internal group coordination. Mark them `@internal` in JSDoc so codegen skips them (WS2 honors `@internal`), or rename with a leading `_` convention if the team prefers. Same for `groupExist` and `showOtherError` if only the group sets them (make them `@state` if the group sets them via property; otherwise leave public and document).
- `@formControl checked nys-change`.

### nys-checkboxgroup

- Add public `value: string[]` (`@property({ attribute: false })`), derived from checked children, settable (sets children's `checked`).
- Fire `nys-change` from the group with `{ id, name, value: string[] }` whenever a child changes. Keep child events bubbling as they do today (don't stop propagation of `nys-change`).
- Fire `nys-focus`/`nys-blur` at group level: focus when focus enters any child from outside the group, blur when it leaves the group (use `focusin`/`focusout` with `relatedTarget` containment check).
- `@formControl value nys-change`.

### nys-radiobutton

- Remove `@fires nys-focus`, `@fires nys-blur`, `@fires nys-other-input` from JSDoc (the class doesn't dispatch them). Keep `@fires nys-change {NysRadiobuttonChangeEvent}`.
- No `@formControl` tag: the group is the form control. Add `@internal`-style note in JSDoc that standalone use outside a group is unsupported for framework bindings, or, if standalone is supported, give it `@formControl checked nys-change`. Check the component docs and decide; record the decision in the PR.

### nys-radiogroup

- Promote `selectedValue` to public `value: string` (`@property({ attribute: false })`). Setting it checks the matching child.
- `nys-change` from the group: detail `{ id, name, value }` where `value` is the selected value. Today it re-dispatches the child's detail; add `value` at group level while keeping the child's keys.
- `_showOtherError` → `@state` or rename to `showOtherError` if it must be public.
- `checkValidity()` should consult `internals` like siblings do, or document why not.
- `@formControl value nys-change`.

### nys-toggle

- `nys-change` detail: add `name` and `value` to match checkbox (`{ id, name, checked, value }`).
- `@formControl checked nys-change`.
- No validation surface is acceptable for a toggle; document it in JSDoc so the Angular CVA doesn't try to sync errors.

### nys-fileinput

- Add `nys-focus` (host `focusin` outside → inside).
- `nys-change` detail: keep `files` and `changedFiles` but make `detail.files` the raw `File[]` (matches the `files` property) and move the progress wrappers to `detail.items`. This is a detail-shape change; keep `changedFiles` as is, add `items`, and change `files` to `File[]` with a changelog entry. If the team rejects the change, add `detail.rawFiles: File[]` instead and note it.
- `@formControl files nys-change`.
- `nys-fileitem`: rename `nys-fileRemove` → `nys-file-remove`, fire both for one release.

### nys-datepicker

- Add `nys-change` `{ id, name, value }` on committed selection (calendar pick, valid typed date on blur, clear, today).
- Add `nys-focus`.
- `value` stays `string | Date | undefined` on the property but `detail.value` is always the `YYYY-MM-DD` string (document it). The CVA writes strings.
- `@formControl value nys-change nys-input`.

### nys-combobox

- `nys-input.detail.value` must be `this.value`, not `_filterText`. If consumers need filter text, add `detail.query`.
- Add per-property JSDoc for all 14 properties (the only form component with none).
- `@formControl value nys-change nys-input`.

### nys-button

- `type="submit"`: call `form.requestSubmit(submitterOrUndefined)`; `ElementInternals` form-associated elements can't be submitters, so keep `requestSubmit()` and instead call `setFormValue(this.value)` when `name` and `value` are set, so the button's value lands in `FormData`. Verify against the ElementInternals spec; if a form-associated custom element can't contribute as a submit button, document that `value` on `nys-button` is not submitted and remove the misleading JSDoc.
- `onClick` property: keep for HTML consumers but mark `@deprecated` in favor of `nys-click`, and mark it `attribute: false` (already). WS2 excludes `@deprecated` members from generated wrappers.
- `@fires nys-click {Event}`, focus, blur.

## Manifest verification (after all components)

Run `npm run cem` and check `custom-elements.json`:

- Every form component declaration has `formControl: { kind, changeEvent, inputEvent? }` (WS2's parser adds this; until WS2 lands, verify the raw `@formControl` text is present in the class JSDoc).
- Every `events[].type.text` is a named alias (`NysTextinputInputEvent`) or `Event`, never bare `CustomEvent`.
- `nys-checkboxgroup` has an `events` array.
- No event with a capital letter in its name.
- No member with a leading underscore and `privacy: "public"`.

Add `src/scripts/verify-form-contract.mjs` that asserts these against the manifest and wire it into `npm run cem` (fail the build on violation). This is the durable guard against contract drift.

## Acceptance criteria

- [ ] Contract table above holds for all ten form components; `verify-form-contract.mjs` passes
- [ ] Each component's tests cover: event fires with the documented detail; `bubbles` and `composed` are true; programmatic set of the bound property doesn't fire `nys-change`; `errorMessage` set by the consumer survives blur validation
- [ ] Changelog entries per component, tagged bug fix or enhancement
- [ ] Storybook stories still render; `npm run lint` clean
- [ ] `nys-checkbox` focus/blur bubble (regression test)

## Commands for the user to run

Per component: `cd packages/nys-<name> && npm test`. After all: `npm run build:all && npm run cem && node src/scripts/verify-form-contract.mjs`.
