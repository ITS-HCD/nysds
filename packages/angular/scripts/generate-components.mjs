#!/usr/bin/env node
/**
 * Generates Angular wrapper-component files for the "thin" UI tags from
 * `custom-elements.json`. Form (CVA) components and special-case UI components
 * remain hand-written — this script only touches tags listed in
 * `GENERATED_TAGS` below.
 *
 * Output: `packages/angular/src/lib/ui/<tag>.component.ts`
 *
 * Each generated file:
 *  - declares `@Component({ selector: '<tag>', standalone: true,
 *    template: '<ng-content></ng-content>' })`
 *  - exposes one `@Input()` setter per CEM field, using `Renderer2.setProperty`
 *    so non-string values (objects, arrays) bind correctly
 *  - exposes one `@Output()` EventEmitter per CEM event, named in camelCase
 *    (e.g. `nys-change` → `nysChange`), wired via `@HostListener`
 *  - carries a "GENERATED — do not edit" banner pointing back to this script
 *
 * Components (rather than Directives) so consumer templates don't need
 * `CUSTOM_ELEMENTS_SCHEMA` — the Component selector satisfies Angular's
 * template type checker for the underlying custom-element tag. The host
 * element IS the custom element: the browser upgrades the host when Angular
 * creates it, so property bindings flow straight through.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..', '..');
const CEM_PATH = resolve(REPO_ROOT, 'custom-elements.json');
const OUT_DIR = resolve(__dirname, '..', 'src', 'lib', 'ui');

/**
 * Tags this generator owns. Everything else (form CVA + special-case UI) is
 * hand-written. To promote a wrapper to generator-managed, move its tag
 * here AND delete the hand-written file so the next run regenerates it.
 */
const GENERATED_TAGS = new Set([
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

/* -------------------------------------------------------------------------- */
/* Code generation                                                            */
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

function buildComponentSource(tag, decl) {
  const pascal = pascalFromTag(tag);
  const className = `${pascal}Component`;

  const fields = (decl.members ?? []).filter(isExposedField);
  const events = (decl.events ?? []).filter(isExposedEvent);

  const needsRenderer = fields.length > 0;
  const needsHostListener = events.length > 0;
  const needsInput = fields.length > 0;
  const needsOutput = events.length > 0;

  const coreImports = ['Component'];
  if (needsRenderer) {
    coreImports.push('ElementRef', 'Renderer2', 'inject');
  }
  if (needsInput) coreImports.push('Input');
  if (needsOutput) coreImports.push('EventEmitter', 'Output');
  if (needsHostListener) coreImports.push('HostListener');
  coreImports.sort();

  const summary = decl.summary || decl.description || '';
  const summaryDoc = summary
    ? `\n/**\n * Wrapper component for \`<${tag}>\`.\n *\n${summary
        .split('\n')
        .map((l) => ` * ${l}`)
        .join('\n')}\n */`
    : `\n/** Wrapper component for \`<${tag}>\`. */`;

  const bodyParts = [];
  if (needsRenderer) {
    bodyParts.push(
      `  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);\n  private readonly renderer: Renderer2 = inject(Renderer2);`,
    );
  }
  if (fields.length) {
    bodyParts.push(fields.map(renderInput).join('\n\n'));
  }
  if (events.length) {
    bodyParts.push(events.map(renderOutput).join('\n\n'));
  }
  const body = bodyParts.join('\n\n');

  return `// ============================================================================
// GENERATED — Do not edit by hand.
//
// Regenerated from \`custom-elements.json\` by
// \`packages/angular/scripts/generate-components.mjs\` (run via
// \`npm run generate --workspace=@nysds/angular\`, or automatically as part of
// \`npm run cem\`). Modify the generator (or promote this tag out of
// GENERATED_TAGS to hand-edit) instead of editing this file.
//
// Emitted as Angular Components so consumer templates don't need
// CUSTOM_ELEMENTS_SCHEMA — the Component selector satisfies Angular's
// template type checker for the underlying custom-element tag. The host
// element IS the custom element (the browser upgrades it when Angular
// creates the host), so property bindings flow straight through.
// ============================================================================
import { ${coreImports.join(', ')} } from '@angular/core';
${summaryDoc}
@Component({
  selector: '${tag}',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class ${className} {${body ? '\n' + body + '\n' : ''}}
`;
}

/* -------------------------------------------------------------------------- */
/* Main                                                                       */
/* -------------------------------------------------------------------------- */

function main() {
  if (!existsSync(CEM_PATH)) {
    console.error(`custom-elements.json not found at ${CEM_PATH}`);
    console.error('Run `npm run cem` from the repo root first.');
    process.exit(1);
  }
  const cem = JSON.parse(readFileSync(CEM_PATH, 'utf8'));

  // Index every declaration by tag.
  const byTag = new Map();
  for (const mod of cem.modules ?? []) {
    for (const decl of mod.declarations ?? []) {
      if (decl.tagName) byTag.set(decl.tagName, decl);
    }
  }

  const generated = [];
  const skipped = [];

  for (const tag of GENERATED_TAGS) {
    const decl = byTag.get(tag);
    if (!decl) {
      skipped.push({ tag, reason: 'not found in CEM' });
      continue;
    }
    const source = buildComponentSource(tag, decl);
    const outPath = resolve(OUT_DIR, `${tag}.component.ts`);
    writeFileSync(outPath, source);
    generated.push({ tag, outPath });
  }

  console.log(`Generated ${generated.length} component files:`);
  for (const { tag } of generated) console.log(`  - ${tag}`);
  if (skipped.length) {
    console.log(`Skipped:`);
    for (const { tag, reason } of skipped) console.log(`  - ${tag} (${reason})`);
  }
}

main();
