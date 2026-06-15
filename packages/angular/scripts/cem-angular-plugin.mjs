/**
 * Custom Elements Manifest plugin that generates the Angular wrapper-component
 * files for NYSDS web components. Wired into
 * `custom-elements-manifest.config.mjs` so generation runs as part of
 * `npm run cem` (during `cem analyze`), reading the in-memory manifest rather
 * than re-parsing `custom-elements.json` from disk. The same core is also
 * exported as `generateAngularComponents` for the standalone
 * `generate-components.mjs` CLI wrapper.
 *
 * Three categories are generated, each from a config table below:
 *
 *  1. UI wrappers (`GENERATED_TAGS`) → `src/lib/ui/<tag>.component.ts`
 *     Thin `@Component`s with one typed `@Input()` per CEM field and one
 *     `@Output()` per CEM event.
 *
 *  2. Form components (`FORM_COMPONENTS`) → `src/lib/form/<tag>.component.ts`
 *     `ControlValueAccessor`s that extend `NysControlValueAccessorBase` so the
 *     element participates in `ngModel` / Reactive Forms. Two shapes:
 *       - `cva`   — simple single-value controls (text, select, checkbox, …)
 *       - `group` — checkbox/radio groups that read & write their child
 *                   `<nys-*>` elements
 *
 *  3. Form-associated button (`FORM_COMPONENTS` kind `button`) →
 *     `src/lib/ui/nys-button.component.ts`
 *     CEM-derived `@Input()`s plus the `requestSubmit()` bridge that keeps
 *     `(ngSubmit)` firing across Angular's template boundary.
 *
 * For form components the value + disabled state are owned by Angular forms
 * (`writeValue` / `setDisabledState` on the base), so those properties are
 * intentionally excluded from the generated passthrough `@Input()`s.
 *
 * Every generated file carries a "GENERATED — do not edit" banner pointing
 * back to this plugin.
 *
 * Components (rather than Directives) so consumer templates don't need
 * `CUSTOM_ELEMENTS_SCHEMA` — the Component selector satisfies Angular's
 * template type checker for the underlying custom-element tag. The host
 * element IS the custom element: the browser upgrades the host when Angular
 * creates it, so property bindings flow straight through.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Default output directory for UI wrappers: `packages/angular/src/lib/ui`. */
export const DEFAULT_UI_OUT_DIR = resolve(__dirname, '..', 'src', 'lib', 'ui');
/** Default output directory for form components: `packages/angular/src/lib/form`. */
export const DEFAULT_FORM_OUT_DIR = resolve(__dirname, '..', 'src', 'lib', 'form');

/**
 * Thin UI tags this generator owns. Everything not listed here or in
 * `FORM_COMPONENTS` (e.g. special-case UI like nys-modal, nys-unavheader) is
 * hand-written. To promote a wrapper to generator-managed, move its tag here
 * AND delete the hand-written file so the next run regenerates it.
 */
export const GENERATED_TAGS = new Set([
  'nys-accordion',
  'nys-alert',
  'nys-avatar',
  'nys-backtotop',
  'nys-badge',
  'nys-divider',
  'nys-dropdownmenuitem',
  'nys-globalfooter',
  'nys-icon',
  'nys-radiobutton',
  'nys-skipnav',
  'nys-step',
  'nys-stepper',
  'nys-tab',
  'nys-tabgroup',
  'nys-tabpanel',
  'nys-table',
  'nys-unavfooter',
  'nys-video',
]);

/**
 * Form tags this generator owns, keyed by the value semantics that can't be
 * read from the CEM. `kind` selects the emitted shape:
 *
 *  - `cva`    single-value ControlValueAccessor. `valueProperty` is the element
 *             property carrying the bound value; `changeEvent` is the `nys-*`
 *             event that signals a change; `extract` chooses how the value is
 *             pulled from the event detail (`value` default, `checked`, `files`).
 *  - `group`  ControlValueAccessor over child `<nys-*>` elements. `childTag` is
 *             the child element queried; `multiple` toggles `string[]` (checkbox
 *             group) vs `string` (radio group) semantics.
 *  - `button` form-associated UI wrapper with the `requestSubmit()` bridge.
 */
export const FORM_COMPONENTS = {
  // Simple single-value ControlValueAccessors
  'nys-textinput': { kind: 'cva', valueProperty: 'value', changeEvent: 'nys-input', valueType: 'string' },
  'nys-textarea': { kind: 'cva', valueProperty: 'value', changeEvent: 'nys-input', valueType: 'string' },
  'nys-select': { kind: 'cva', valueProperty: 'value', changeEvent: 'nys-change', valueType: 'string' },
  'nys-combobox': { kind: 'cva', valueProperty: 'value', changeEvent: 'nys-change', valueType: 'string' },
  'nys-datepicker': { kind: 'cva', valueProperty: 'value', changeEvent: 'nys-input', valueType: 'Date | string | undefined' },
  'nys-checkbox': { kind: 'cva', valueProperty: 'checked', changeEvent: 'nys-change', valueType: 'boolean', extract: 'checked' },
  'nys-toggle': { kind: 'cva', valueProperty: 'checked', changeEvent: 'nys-change', valueType: 'boolean', extract: 'checked' },
  'nys-fileinput': { kind: 'cva', valueProperty: 'value', changeEvent: 'nys-change', valueType: 'File[]', extract: 'files' },
  // Group ControlValueAccessors (read/write child elements)
  'nys-checkboxgroup': { kind: 'group', childTag: 'nys-checkbox', changeEvent: 'nys-change', valueType: 'string[]', multiple: true },
  'nys-radiogroup': { kind: 'group', childTag: 'nys-radiobutton', changeEvent: 'nys-change', valueType: 'string', multiple: false },
  // Form-associated button
  'nys-button': { kind: 'button' },
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** `nys-tab` → `NysTab`; `nys-dropdownmenuitem` → `NysDropdownmenuitem`. */
function pascalFromTag(tag) {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** `nys-tab` → `NysTabComponent`. */
function classNameFromTag(tag) {
  return `${pascalFromTag(tag)}Component`;
}

/** `nys-change` → `nysChange`; `nys-close` → `nysClose`. */
function camelFromEvent(name) {
  const parts = name.split('-');
  return (
    parts[0] +
    parts
      .slice(1)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')
  );
}

/** Resolve a CEM type text into a TypeScript type string. Falls back to `any`. */
function resolveType(typeText) {
  if (!typeText) return 'any';
  return typeText.trim();
}

/** Filter to public @property fields the wrapper should expose. */
function isExposedField(member) {
  if (member.kind !== 'field') return false;
  if (!member.name) return false;
  if (member.name.startsWith('_')) return false; // Lit @state
  if (member.privacy === 'private' || member.privacy === 'protected') return false;
  if (member.static) return false;
  return true;
}

/** Filter to documented events. */
function isExposedEvent(event) {
  return Boolean(event?.name);
}

/** Exposed @property fields for a declaration, minus any excluded names. */
function exposedFields(decl, exclude = []) {
  const skip = new Set(exclude);
  return (decl?.members ?? []).filter(isExposedField).filter((m) => !skip.has(m.name));
}

/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

const BANNER_HEAD = `// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from \`custom-elements.json\` by
// \`packages/angular/scripts/cem-angular-plugin.mjs\`, which runs automatically
// during \`npm run cem\` (wired into custom-elements-manifest.config.mjs). It is
// also available standalone via \`npm run generate --workspace=@nysds/angular\`.`;

const BANNER_FOOT = `// ============================================================================`;

/** Assemble a generated-file banner from the shared head + a per-kind body. */
function banner(bodyLines) {
  return [BANNER_HEAD, ...bodyLines, BANNER_FOOT].join('\n');
}

const UI_BANNER = banner([
  '// Modify the plugin (or promote this tag out of GENERATED_TAGS to hand-edit)',
  '// instead of editing this file.',
  '//',
  '// Emitted as Angular Components so consumer templates don\'t need',
  '// CUSTOM_ELEMENTS_SCHEMA — the Component selector satisfies Angular\'s',
  '// template type checker for the underlying custom-element tag. The host',
  '// element IS the custom element (the browser upgrades it when Angular',
  '// creates the host), so property bindings flow straight through.',
]);

const FORM_BANNER = banner([
  '// Modify the plugin (or promote this tag out of FORM_COMPONENTS to hand-edit)',
  '// instead of editing this file.',
  '//',
  '// ControlValueAccessor wrapper: extends NysControlValueAccessorBase so the',
  '// underlying custom element participates in ngModel / Reactive Forms. Typed',
  '// @Input()s are derived from the CEM; the form value and disabled state are',
  '// owned by Angular forms (writeValue / setDisabledState on the base), so they',
  '// are intentionally excluded from the generated passthrough inputs.',
]);

const BUTTON_BANNER = banner([
  '// Modify the plugin (or promote this tag out of FORM_COMPONENTS to hand-edit)',
  '// instead of editing this file.',
  '//',
  '// Form-associated wrapper. The web component\'s form association does not',
  '// survive Angular\'s template boundary, so this wrapper walks to the enclosing',
  '// <form> and calls requestSubmit() on click when type === \'submit\', keeping',
  '// (ngSubmit) firing the way Angular consumers expect. Typed @Input()s (all',
  '// CEM fields except the special `type`) are derived from the manifest.',
]);

/* -------------------------------------------------------------------------- */
/* Field / event rendering                                                    */
/* -------------------------------------------------------------------------- */

function renderInput(member) {
  const type = resolveType(member.type?.text);
  const docLines = [];
  if (member.description) {
    docLines.push(...member.description.split('\n').map((l) => `   * ${l}`));
  }
  if (member.default !== undefined) {
    docLines.push(`   * @default ${member.default}`);
  }
  const jsdoc = docLines.length
    ? ['  /**', ...docLines, '   */'].join('\n') + '\n'
    : '';
  return `${jsdoc}  @Input() set ${member.name}(value: ${type}) {
    this.renderer.setProperty(this.elementRef.nativeElement, '${member.name}', value);
  }`;
}

function renderOutput(event) {
  const name = camelFromEvent(event.name);
  const description = event.description
    ? `  /** ${event.description.replace(/\*\//g, '*\\/')} */\n`
    : '';
  return `${description}  @Output() readonly ${name} = new EventEmitter<CustomEvent>();

  @HostListener('${event.name}', ['$event'])
  protected _emit_${name}(event: Event): void {
    this.${name}.emit(event as CustomEvent);
  }`;
}

/** Build a summary JSDoc block from CEM summary/description, or a fallback. */
function summaryDoc(tag, decl, fallback) {
  const summary = decl?.summary || decl?.description || '';
  if (summary) {
    return `\n/**\n * Wrapper component for \`<${tag}>\`.\n *\n${summary
      .split('\n')
      .map((l) => ` * ${l}`)
      .join('\n')}\n */`;
  }
  return `\n${fallback}`;
}

/* -------------------------------------------------------------------------- */
/* UI wrapper source                                                          */
/* -------------------------------------------------------------------------- */

function buildUiComponentSource(tag, decl) {
  const className = classNameFromTag(tag);

  const fields = (decl.members ?? []).filter(isExposedField);
  const events = (decl.events ?? []).filter(isExposedEvent);

  const needsRenderer = fields.length > 0;
  const needsHostListener = events.length > 0;
  const needsInput = fields.length > 0;
  const needsOutput = events.length > 0;

  const coreImports = ['Component'];
  if (needsRenderer) coreImports.push('ElementRef', 'Renderer2', 'inject');
  if (needsInput) coreImports.push('Input');
  if (needsOutput) coreImports.push('EventEmitter', 'Output');
  if (needsHostListener) coreImports.push('HostListener');
  coreImports.sort();

  const bodyParts = [];
  if (needsRenderer) {
    bodyParts.push(
      `  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);\n  private readonly renderer: Renderer2 = inject(Renderer2);`,
    );
  }
  if (fields.length) bodyParts.push(fields.map(renderInput).join('\n\n'));
  if (events.length) bodyParts.push(events.map(renderOutput).join('\n\n'));
  const body = bodyParts.join('\n\n');

  return `${UI_BANNER}
import { ${coreImports.join(', ')} } from '@angular/core';
${summaryDoc(tag, decl, `/** Wrapper component for \`<${tag}>\`. */`)}
@Component({
  selector: '${tag}',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class ${className} {${body ? '\n' + body + '\n' : ''}}
`;
}

/* -------------------------------------------------------------------------- */
/* Form (ControlValueAccessor) source                                         */
/* -------------------------------------------------------------------------- */

/** Provider block registering the component as an NG_VALUE_ACCESSOR. */
function cvaProviders(className) {
  return `  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ${className}),
      multi: true,
    },
  ],`;
}

function buildCvaComponentSource(tag, decl, cfg) {
  const className = classNameFromTag(tag);
  // Angular forms own the bound value + disabled state via the base class.
  const inputs = exposedFields(decl, [cfg.valueProperty, 'disabled']).map(renderInput);

  const coreImports = ['Component', 'HostListener', 'forwardRef'];
  if (inputs.length) coreImports.push('Input');
  coreImports.sort();

  let extractPart = '';
  if (cfg.extract === 'checked') {
    extractPart = `  protected override extractValue(event: Event): boolean {
    return Boolean((event as CustomEvent).detail?.checked);
  }`;
  } else if (cfg.extract === 'files') {
    extractPart = `  protected override extractValue(event: Event): File[] {
    return ((event as CustomEvent).detail?.files as File[]) ?? [];
  }`;
  }

  const handleChange = `  @HostListener('${cfg.changeEvent}', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }`;

  const bodyParts = [`  protected readonly valueProperty = '${cfg.valueProperty}';`];
  if (inputs.length) bodyParts.push(inputs.join('\n\n'));
  if (extractPart) bodyParts.push(extractPart);
  bodyParts.push(handleChange);

  const fallbackDoc = `/**
 * Angular \`ControlValueAccessor\` for \`<${tag}>\`.
 *
 * Bridges \`ngModel\` / Reactive Forms with the element's \`${cfg.valueProperty}\`
 * property and its \`${cfg.changeEvent}\` event. \`nys-blur\` drives \`onTouched\`
 * via the base class.
 */`;

  return `${FORM_BANNER}
import { ${coreImports.join(', ')} } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';
${summaryDoc(tag, decl, fallbackDoc)}
@Component({
  selector: '${tag}',
  standalone: true,
  template: '<ng-content></ng-content>',
${cvaProviders(className)}
})
export class ${className} extends NysControlValueAccessorBase<${cfg.valueType}> {
${bodyParts.join('\n\n')}
}
`;
}

function buildGroupComponentSource(tag, decl, cfg) {
  const className = classNameFromTag(tag);
  const inputs = exposedFields(decl, ['disabled']).map(renderInput);

  const coreImports = ['Component', 'HostListener', 'forwardRef'];
  if (inputs.length) coreImports.push('Input');
  coreImports.sort();

  // extractValue: collect checked children (multiple) or read the event detail (single).
  const extractPart = cfg.multiple
    ? `  protected override extractValue(_event: Event): string[] {
    return Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLElement>('${cfg.childTag}'),
    )
      .filter((child) => Boolean((child as unknown as { checked?: boolean }).checked))
      .map((child) => (child as unknown as { value?: string }).value ?? '');
  }`
    : `  protected override extractValue(event: Event): string {
    return ((event as CustomEvent).detail?.value as string) ?? '';
  }`;

  // writeValue: toggle each child's checked based on the bound value.
  const writePart = cfg.multiple
    ? `  override writeValue(value: string[] | null | undefined): void {
    const selected = new Set(value ?? []);
    const children = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      '${cfg.childTag}',
    );
    children.forEach((child) => {
      const childValue = (child as unknown as { value?: string }).value ?? '';
      this.renderer.setProperty(child, 'checked', selected.has(childValue));
    });
  }`
    : `  override writeValue(value: string): void {
    const children = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      '${cfg.childTag}',
    );
    children.forEach((child) => {
      const childValue = (child as unknown as { value?: string }).value;
      this.renderer.setProperty(child, 'checked', childValue === value);
    });
  }`;

  const disabledPart = `  override setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled,
    );
    const children = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(
      '${cfg.childTag}',
    );
    children.forEach((child) => {
      this.renderer.setProperty(child, 'disabled', isDisabled);
    });
  }`;

  const handleChange = `  @HostListener('${cfg.changeEvent}', ['$event'])
  override handleChange(event: Event): void {
    super.handleChange(event);
  }`;

  const bodyParts = [`  protected readonly valueProperty = '__unused__';`];
  if (inputs.length) bodyParts.push(inputs.join('\n\n'));
  bodyParts.push(extractPart, writePart, disabledPart, handleChange);

  const valueNote = cfg.multiple
    ? `Value is \`string[]\` — the \`value\` of every checked \`<${cfg.childTag}>\` child.`
    : `Value is the \`value\` of the selected \`<${cfg.childTag}>\` child.`;
  const fallbackDoc = `/**
 * Angular \`ControlValueAccessor\` for \`<${tag}>\`.
 *
 * ${valueNote} Reads on the bubbling \`${cfg.changeEvent}\` fired by a child and
 * writes by toggling each child's \`checked\`. The group does not expose the
 * selection on its own public API, so the wrapper walks the children directly.
 */`;

  return `${FORM_BANNER}
import { ${coreImports.join(', ')} } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { NysControlValueAccessorBase } from '../shared/nys-control-value-accessor.base';
${summaryDoc(tag, decl, fallbackDoc)}
@Component({
  selector: '${tag}',
  standalone: true,
  template: '<ng-content></ng-content>',
${cvaProviders(className)}
})
export class ${className} extends NysControlValueAccessorBase<${cfg.valueType}> {
${bodyParts.join('\n\n')}
}
`;
}

function buildButtonComponentSource(tag, decl) {
  const className = classNameFromTag(tag);
  // `type` is handled specially (typed input with default + attribute reflection
  // + submit bridge); every other field is a plain passthrough.
  const inputs = exposedFields(decl, ['type']).map(renderInput);

  const fallbackDoc = `/**
 * Wrapper component for \`<${tag}>\`.
 *
 * Walks up to the enclosing \`<form>\` and calls \`requestSubmit()\` on click when
 * \`type === 'submit'\`, so \`(ngSubmit)\` keeps firing the way Angular consumers
 * expect.
 */`;

  return `${BUTTON_BANNER}
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
${summaryDoc(tag, decl, fallbackDoc)}
@Component({
  selector: '${tag}',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class ${className} implements OnInit {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input() type: 'submit' | 'button' | 'reset' = 'button';

${inputs.join('\n\n')}

  ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'type', this.type);
  }

  @HostListener('click')
  protected handleClick(): void {
    if (this.type !== 'submit') return;
    const form = this.findParentForm(this.elementRef.nativeElement);
    if (form) form.requestSubmit();
  }

  private findParentForm(el: HTMLElement | null): HTMLFormElement | null {
    let node: HTMLElement | null = el;
    while (node?.parentElement) {
      node = node.parentElement;
      if (node.tagName === 'FORM') return node as HTMLFormElement;
    }
    return null;
  }
}
`;
}

/** Dispatch a form-component config to the right source builder. */
function buildFormComponentSource(tag, decl, cfg) {
  switch (cfg.kind) {
    case 'cva':
      return buildCvaComponentSource(tag, decl, cfg);
    case 'group':
      return buildGroupComponentSource(tag, decl, cfg);
    case 'button':
      return buildButtonComponentSource(tag, decl);
    default:
      throw new Error(`Unknown form component kind '${cfg.kind}' for ${tag}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Core                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Generate every Angular wrapper for the tags in `GENERATED_TAGS` and
 * `FORM_COMPONENTS` found in the supplied manifest. Works with any object
 * shaped like a Custom Elements Manifest (`{ modules: [{ declarations: [...] }] }`)
 * — whether the in-memory manifest passed by the CEM plugin pipeline or one
 * parsed from disk.
 *
 * @param {object} manifest  Custom Elements Manifest.
 * @param {object} [options]
 * @param {string} [options.uiOutDir]   UI wrapper output dir (defaults to `src/lib/ui`).
 * @param {string} [options.formOutDir] Form component output dir (defaults to `src/lib/form`).
 * @returns {{ generated: {tag: string, outPath: string}[], skipped: {tag: string, reason: string}[] }}
 */
export function generateAngularComponents(
  manifest,
  { uiOutDir = DEFAULT_UI_OUT_DIR, formOutDir = DEFAULT_FORM_OUT_DIR } = {},
) {
  // Index every declaration by tag.
  const byTag = new Map();
  for (const mod of manifest.modules ?? []) {
    for (const decl of mod.declarations ?? []) {
      if (decl.tagName) byTag.set(decl.tagName, decl);
    }
  }

  const generated = [];
  const skipped = [];

  const emit = (tag, source, outDir) => {
    const outPath = resolve(outDir, `${tag}.component.ts`);
    writeFileSync(outPath, source);
    generated.push({ tag, outPath });
  };

  // UI wrappers
  for (const tag of GENERATED_TAGS) {
    const decl = byTag.get(tag);
    if (!decl) {
      skipped.push({ tag, reason: 'not found in CEM' });
      continue;
    }
    emit(tag, buildUiComponentSource(tag, decl), uiOutDir);
  }

  // Form components (+ form-associated button)
  for (const [tag, cfg] of Object.entries(FORM_COMPONENTS)) {
    const decl = byTag.get(tag);
    if (!decl) {
      skipped.push({ tag, reason: 'not found in CEM' });
      continue;
    }
    // The button is a UI-dir wrapper; CVA/group components live in the form dir.
    const outDir = cfg.kind === 'button' ? uiOutDir : formOutDir;
    emit(tag, buildFormComponentSource(tag, decl, cfg), outDir);
  }

  return { generated, skipped };
}

/** Pretty-print the result of `generateAngularComponents`. */
export function reportResult({ generated, skipped }, { prefix = '' } = {}) {
  console.log(`${prefix}Generated ${generated.length} Angular component files:`);
  for (const { tag } of generated) console.log(`${prefix}  - ${tag}`);
  if (skipped.length) {
    console.log(`${prefix}Skipped:`);
    for (const { tag, reason } of skipped) {
      console.log(`${prefix}  - ${tag} (${reason})`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* CEM plugin                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Custom Elements Manifest plugin. Hooks `packageLinkPhase` (after the manifest
 * is fully linked) and writes the Angular wrapper components from the in-memory
 * manifest.
 *
 * @param {object} [options]
 * @param {string} [options.uiOutDir]   UI wrapper output dir override.
 * @param {string} [options.formOutDir] Form component output dir override.
 * @returns {{ name: string, packageLinkPhase: (ctx: { customElementsManifest: object }) => void }}
 */
export function customElementAngularPlugin(options = {}) {
  return {
    name: 'nysds-angular-components',
    packageLinkPhase({ customElementsManifest }) {
      const result = generateAngularComponents(customElementsManifest, options);
      reportResult(result, { prefix: '[nysds-angular] ' });
    },
  };
}

export default customElementAngularPlugin;
