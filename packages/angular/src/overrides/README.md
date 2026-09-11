# Proxy overrides

This directory holds hand-written proxy components that replace a
generated one. It is empty at launch.

To override a component, add `<tag>.component.ts` here — for example
`nys-textinput.component.ts`. On the next `npm run cem`, the Angular CEM
plugin (`packages/codegen/cem-plugins/angular.mjs`) skips generating
that component and the generated barrel re-exports this file instead.

An override must export the same class name the generated file exports
(for example `NysTextinputComponent`), keep the same selector, and — for
form controls — keep the `NG_VALUE_ACCESSOR` provider so forms
integration keeps working. Start from the generated file in
`../generated/`.
