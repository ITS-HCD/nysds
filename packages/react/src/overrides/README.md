# Wrapper overrides

This directory holds hand-written wrappers that replace a generated one.
It is empty at launch.

To override a component, add `<ClassName>.ts` here — for example
`NysTextinput.ts`. On the next `npm run cem`, the React CEM plugin
(`packages/codegen/cem-plugins/react.mjs`) skips generating that
component and the generated barrel re-exports this file instead.

An override must export the same names the generated file exports: the
component (`NysTextinput`), its props type (`NysTextinputProps`), and
the element type (`NysTextinputElement`). Start from the generated file
in `../generated/` and keep the `"use client"` directive.
