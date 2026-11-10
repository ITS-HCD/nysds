/**
 * CEM plugin: generates a typed Angular proxy `@Component` for every NYSDS
 * component into `packages/angular/src/generated/` (decision L7), plus the
 * barrel and `NysAngularModule`.
 *
 * The output directory is cleared and recreated on every run. A hand-written
 * file at `src/overrides/<tag>.component.ts` replaces the generated one.
 * Form components (manifest `formControl` block) extend the accessor base
 * class for their kind and provide `NG_VALUE_ACCESSOR`.
 */
import fs from "node:fs";
import path from "node:path";
import { listComponents, pascalize, classToAngularClass, NYS_BLUR_EVENT } from "./lib/core.mjs";

const GLOBAL_EVENT_TYPES = new Set([
  "Event",
  "CustomEvent",
  "UIEvent",
  "FocusEvent",
  "InputEvent",
  "KeyboardEvent",
  "MouseEvent",
  "PointerEvent",
  "TouchEvent",
  "WheelEvent",
  "AnimationEvent",
  "TransitionEvent",
  "ClipboardEvent",
  "DragEvent",
  "SubmitEvent",
]);

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** npm name of the Angular wrapper package; also its ng-packagr module id. */
const ANGULAR_PACKAGE = "@nysds/angular";

/**
 * Properties Angular or the platform already manage on any host element,
 * or read-only properties that cannot be set via setters.
 * `id` is reflected by the component and set by Angular as an attribute,
 * so the wrapper must not shadow it.
 */
const HOST_MANAGED_PROPS = new Set([
  "id",
  "title",
  "hidden",
  "tabIndex",
  "className",
  "style",
  "validity",
  "validationMessage",
  "ariaAttributes",
]);

/**
 * Platform and common library types that never need imports.
 */
const PLATFORM_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "null",
  "undefined",
  "any",
  "never",
  "void",
  "Event",
  "CustomEvent",
  "UIEvent",
  "FocusEvent",
  "InputEvent",
  "KeyboardEvent",
  "MouseEvent",
  "PointerEvent",
  "TouchEvent",
  "WheelEvent",
  "AnimationEvent",
  "TransitionEvent",
  "ClipboardEvent",
  "DragEvent",
  "SubmitEvent",
  "Array",
  "Object",
  "Date",
  "RegExp",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "Promise",
  "FileList",
  "ValidityState",
]);

/**
 * Check if a type looks like it can be safely imported from the component
 * package. Very conservative: only import if it's a known event type
 * or explicitly exported from the component package (which we don't have
 * a list for, so default to false for unknown types).
 */
function canImportType(typeText) {
  if (!typeText) return false;
  if (PLATFORM_TYPES.has(typeText)) return false;
  if (/^(HTML|SVG|XMLHttp|Blob|FormData|Worker|IDB|File)/.test(typeText)) {
    return false;
  }
  // For unknown types, default to false (use element property type instead)
  // Only import event types and types we know are exported from component packages
  return /Event$/.test(typeText);
}

/**
 * Check if a type is primitive or simple enough to use inline.
 * Handles unions of primitives (e.g., "number | null", "string | undefined").
 */
function isPrimitiveType(typeText) {
  if (!typeText) return true;
  // Remove whitespace and split by |
  const parts = typeText
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  // If any part is not a primitive keyword, it's not primitive
  return parts.every((part) =>
    /^(string|number|boolean|null|undefined|any|never|void|unknown)$/.test(part)
  );
}

/**
 * Extract custom type names from a type string that might need importing.
 */
function extractCustomTypes(typeText) {
  if (!typeText) return [];
  const customTypes = new Set();
  // Match bare identifiers
  const matches = typeText.match(/\b[A-Z][A-Za-z0-9]*\b/g) || [];
  for (const match of matches) {
    if (canImportType(match)) {
      customTypes.add(match);
    }
  }
  return [...customTypes];
}

/**
 * Shared accessor bases live in their own ng-packagr entry point. Wrappers
 * must reach them by bare specifier, never relatively: a TypeScript file
 * pulled into two entry points is compiled into both bundles, which would
 * give every form control its own copy of the accessor class.
 */
const FORMS_ENTRY_POINT = `${ANGULAR_PACKAGE}/forms`;

const ACCESSOR_BY_KIND = {
  value: { className: "NysValueAccessor", file: FORMS_ENTRY_POINT },
  checked: { className: "NysCheckedAccessor", file: FORMS_ENTRY_POINT },
  files: { className: "NysFilesAccessor", file: FORMS_ENTRY_POINT },
};

function resolveEventType(typeText) {
  if (IDENTIFIER_RE.test(typeText) && !GLOBAL_EVENT_TYPES.has(typeText)) {
    return { text: typeText, importName: typeText };
  }
  return { text: typeText, importName: undefined };
}

function docComment(description, indent) {
  if (!description) return [];
  const oneLine = description.replace(/\s+/g, " ").trim();
  return [`${indent}/** ${oneLine} */`];
}

function renderAngularWrapper(component, warnings) {
  const { tag, className, packageName, props, events, formControl } = component;
  const angularClass = classToAngularClass(className);
  const accessor = formControl ? ACCESSOR_BY_KIND[formControl.kind] : undefined;

  const usableProps = props.filter((prop) => !HOST_MANAGED_PROPS.has(prop.name));

  const coreImports = new Set(["ChangeDetectionStrategy", "Component", "ElementRef", "inject"]);
  if (usableProps.length > 0) coreImports.add("Input");
  if (events.length > 0) {
    coreImports.add("HostListener");
    coreImports.add("output");
  }
  if (accessor) coreImports.add("forwardRef");

  const typeImports = new Set();
  const bodyLines = [];

  const overrideModifier = accessor ? "override " : "";
  bodyLines.push(
    `  protected ${overrideModifier}readonly el: ElementRef<${className}> = inject(ElementRef);`
  );
  if (accessor) {
    bodyLines.push(
      `  protected override readonly changeEvent = "${formControl.changeEvent}";`
    );
    if (formControl.inputEvent) {
      bodyLines.push(
        `  protected override readonly inputEvent = "${formControl.inputEvent}";`
      );
    }
  }

  for (const prop of usableProps) {
    let type = prop.type;
    const hasComplexType = type && !isPrimitiveType(type);
    if (type === "unknown" || hasComplexType) {
      // Fall back to the element's own property type so the wrapper still
      // compiles and never widens to `any`. Complex types (like enums or
      // interfaces not in the manifest) fallback to the element's property type.
      const fallbackType = `${className}["${prop.name}"]`;
      if (type === "unknown" || !canImportType(type)) {
        type = fallbackType;
        warnings.push(
          `${tag}: property "${prop.name}" type cannot be imported; using ${type}`
        );
      } else {
        // Extract and import custom type names
        const customTypes = extractCustomTypes(type);
        for (const customType of customTypes) {
          if (canImportType(customType)) {
            typeImports.add(customType);
          }
        }
      }
    }
    let decorator = "@Input()";
    if (prop.isBoolean) {
      coreImports.add("booleanAttribute");
      decorator = "@Input({ transform: booleanAttribute })";
    } else if (prop.type === "number") {
      coreImports.add("numberAttribute");
      decorator = "@Input({ transform: numberAttribute })";
    }
    bodyLines.push(``);
    bodyLines.push(...docComment(prop.description, "  "));

    // Generate defensive setter logic for Signal Forms compatibility.
    // pattern: ignore empty arrays (formField metadata), null, undefined.
    // min/max: normalize undefined to null for (number | undefined) values.
    let setterBody = `this.el.nativeElement.${prop.name} = v;`;
    if (prop.name === "pattern") {
      setterBody = `if (v && v !== "" && (!Array.isArray(v) || v.length > 0)) { this.el.nativeElement.${prop.name} = v; }`;
    } else if ((prop.name === "min" || prop.name === "max" || prop.name === "maxlength" || prop.name === "minlength") && type.includes("null")) {
      // Normalize undefined to null for nullable numeric props
      setterBody = `this.el.nativeElement.${prop.name} = v ?? null;`;
    }

    bodyLines.push(
      `  ${decorator} set ${prop.name}(v: ${type}) { ${setterBody} }`
    );
    bodyLines.push(
      `  get ${prop.name}(): ${type} { return this.el.nativeElement.${prop.name}; }`
    );
  }

  if (events.length > 0) bodyLines.push(``);
  const listenerLines = [];
  const seenOutputs = new Set();
  for (const event of events) {
    // Two event names can map to one Angular output (a deprecated camelCase
    // alias like `nys-fileRemove` next to `nys-file-remove`). Keep the
    // first, which is the canonical name in manifest order.
    if (seenOutputs.has(event.angularOutput)) continue;
    seenOutputs.add(event.angularOutput);

    const { text, importName } = resolveEventType(event.typeText);
    if (importName) typeImports.add(importName);
    bodyLines.push(...docComment(event.description, "  "));
    bodyLines.push(`  readonly ${event.angularOutput} = output<${text}>();`);

    // Cast to typed event for internal use, but type parameter as Event for
    // typeCheckHostBindings compatibility (Angular 21+ strict mode).
    const cast = text !== "Event" ? `(e as ${text})` : "e";
    const extras = [`this.${event.angularOutput}.emit(${cast});`];
    if (accessor) {
      if (event.name === formControl.changeEvent) {
        // Files accessor reads from element, doesn't use event detail
        const handleArgs = formControl.kind === "files" ? "" : cast;
        extras.push(`this.handleChange(${handleArgs});`);
      } else if (event.name === formControl.inputEvent) {
        // Files accessor reads from element, doesn't use event detail
        const handleArgs = formControl.kind === "files" ? "" : cast;
        extras.push(`this.handleInput(${handleArgs});`);
      } else if (event.name === NYS_BLUR_EVENT) {
        extras.push(`this.handleBlur();`);
      }
    }
    listenerLines.push(
      `  @HostListener("${event.name}", ["$event"]) protected _on${pascalize(event.name)}(e: Event) { ${extras.join(" ")} }`
    );
  }
  if (listenerLines.length > 0) {
    bodyLines.push(``);
    bodyLines.push(...listenerLines);
  }

  const lines = [];
  lines.push(
    `// GENERATED by @nysds/codegen — do not edit. Override: src/overrides/${tag}.component.ts`
  );
  lines.push(
    `import { ${[...coreImports].sort().join(", ")} } from "@angular/core";`
  );
  if (accessor) {
    lines.push(`import { NG_VALUE_ACCESSOR } from "@angular/forms";`);
  }
  lines.push(`import "${packageName}";`);
  const allTypeImports = [className, ...[...typeImports].sort()];
  lines.push(`import type { ${allTypeImports.join(", ")} } from "${packageName}";`);
  if (accessor) {
    lines.push(`import { ${accessor.className} } from "${accessor.file}";`);
  }
  lines.push(``);
  lines.push(`@Component({`);
  lines.push(`  selector: "${tag}",`);
  lines.push(`  standalone: true,`);
  lines.push(`  template: "<ng-content></ng-content>",`);
  lines.push(`  changeDetection: ChangeDetectionStrategy.OnPush,`);
  if (accessor) {
    lines.push(`  providers: [`);
    lines.push(
      `    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ${angularClass}), multi: true },`
    );
    lines.push(`  ],`);
  }
  lines.push(`})`);

  let extendsClause = "";
  if (accessor) {
    const generic =
      formControl.kind === "value"
        ? `<${props.find((prop) => prop.name === "value")?.type ?? "string"}>`
        : "";
    extendsClause = ` extends ${accessor.className}${generic}`;
  }
  lines.push(`export class ${angularClass}${extendsClause} {`);
  lines.push(...bodyLines);
  lines.push(`}`);
  lines.push(``);
  return lines.join("\n");
}

/** The NgModule that re-exports every wrapper, in either import mode. */
function renderNgModule(moduleImports, moduleClasses) {
  return [
    `// GENERATED by @nysds/codegen — do not edit.`,
    `import { NgModule } from "@angular/core";`,
    ...moduleImports,
    ``,
    `const NYS_COMPONENTS = [`,
    ...moduleClasses.map((name) => `  ${name},`),
    `];`,
    ``,
    `@NgModule({`,
    `  imports: NYS_COMPONENTS,`,
    `  exports: NYS_COMPONENTS,`,
    `})`,
    `export class NysAngularModule {}`,
    ``,
  ].join("\n");
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

/** Path from `fromDir` to `to`, always written with forward slashes. */
function relativeSpecifier(fromDir, to) {
  return path.relative(fromDir, to).split(path.sep).join("/");
}

/**
 * Writes the throwaway ng-packagr project that turns each wrapper into a real
 * secondary entry point.
 *
 * ng-packagr finds secondary entry points by globbing for nested `ng-package.json`
 * files and derives both the import subpath and the output directory from the folder's
 * path relative to the project root. Putting that project in a gitignored
 * staging directory keeps one config folder per component out of `src/` and out
 * of the package root while still producing `dist/<subpath>/` and
 * `dist/fesm2022/nysds-angular-<subpath>.mjs`.
 *
 * Each `entryFile` points straight at the real source rather than at a re-export
 * shim: ng-packagr sets `rootDir` to the directory of the entry file, so a shim
 * would leave the actual component outside `rootDir` and push its emit out of
 * the entry point's own output folder.
 */
function writeNgBuildTree(components, context) {
  const { ngbuildDir, outDir, overridesDir, packageJsonPath } = context;
  const packageDir = path.dirname(packageJsonPath);
  const srcDir = path.dirname(outDir);

  fs.rmSync(ngbuildDir, { recursive: true, force: true });
  fs.mkdirSync(ngbuildDir, { recursive: true });

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  // Deliberately minimal. ng-packagr seeds the `exports` map it writes into
  // dist/package.json from this file, so carrying over `main`, `module`,
  // `types` or `exports` from the real manifest is what produced the doubled
  // `./dist/` prefixes and the "conflicting export condition" warning. With no
  // `dependencies` here, `allowedNonPeerDependencies` has nothing to check and
  // no longer has to mirror the component list by hand.
  writeJson(path.join(ngbuildDir, "package.json"), {
    name: pkg.name,
    version: pkg.version,
    peerDependencies: pkg.peerDependencies,
  });

  writeJson(path.join(ngbuildDir, "ng-package.json"), {
    $schema: relativeSpecifier(
      ngbuildDir,
      "node_modules/ng-packagr/ng-package.schema.json"
    ),
    lib: { entryFile: "public-api.ts" },
    dest: relativeSpecifier(ngbuildDir, path.join(packageDir, "dist")),
    allowedNonPeerDependencies: [],
  });

  const publicApi = [
    `// GENERATED by @nysds/codegen — do not edit.`,
    `export * from "${FORMS_ENTRY_POINT}";`,
  ];
  const moduleImports = [];
  const moduleClasses = [];

  const entryPoints = [
    { dir: "forms", source: path.join(srcDir, "lib/forms/index.ts") },
  ];

  for (const component of components) {
    const fileBase = `${component.tag}.component`;
    const overridePath = path.join(overridesDir, `${fileBase}.ts`);
    const sourceDir = fs.existsSync(overridePath) ? overridesDir : outDir;
    entryPoints.push({
      dir: component.subpath,
      source: path.join(sourceDir, `${fileBase}.ts`),
    });

    const angularClass = classToAngularClass(component.className);
    moduleClasses.push(angularClass);
    moduleImports.push(
      `import { ${angularClass} } from "${ANGULAR_PACKAGE}/${component.subpath}";`
    );
    publicApi.push(`export * from "${ANGULAR_PACKAGE}/${component.subpath}";`);
  }

  for (const entryPoint of entryPoints) {
    const entryPointDir = path.join(ngbuildDir, entryPoint.dir);
    writeJson(path.join(entryPointDir, "ng-package.json"), {
      lib: { entryFile: relativeSpecifier(entryPointDir, entryPoint.source) },
    });
  }

  publicApi.push(`export { NysAngularModule } from "./nys-angular.module";`);
  fs.writeFileSync(
    path.join(ngbuildDir, "public-api.ts"),
    publicApi.join("\n") + "\n"
  );
  fs.writeFileSync(
    path.join(ngbuildDir, "nys-angular.module.ts"),
    renderNgModule(moduleImports, moduleClasses)
  );

  // ng-packagr copies README.md out of the project root, and refuses assets
  // from outside it. The published tarball carries the real README from the
  // package root, so this only keeps dist/ self-describing.
  fs.writeFileSync(
    path.join(ngbuildDir, "README.md"),
    fs.readFileSync(path.join(packageDir, "README.md"))
  );
}

export function angularPlugin(options = {}) {
  const {
    outDir = "packages/angular/src/generated",
    overridesDir = "packages/angular/src/overrides",
    ngbuildDir = "packages/angular/.ngbuild",
    packageJsonPath = "packages/angular/package.json",
  } = options;

  return {
    name: "nysds-angular-wrappers",

    packageLinkPhase({ customElementsManifest }) {
      const components = listComponents(customElementsManifest);
      if (components.length === 0) return;

      const reserved = components.find(
        (component) => component.subpath === "forms"
      );
      if (reserved) {
        throw new Error(
          `[nysds-angular-wrappers] <${reserved.tag}> would claim the "forms" subpath, which is reserved for the shared form-control accessors.`
        );
      }

      fs.rmSync(outDir, { recursive: true, force: true });
      fs.mkdirSync(outDir, { recursive: true });

      const warnings = [];
      const barrel = [`// GENERATED by @nysds/codegen — do not edit.`];
      const moduleImports = [];
      const moduleClasses = [];

      for (const component of components) {
        const fileBase = `${component.tag}.component`;
        const angularClass = classToAngularClass(component.className);
        moduleClasses.push(angularClass);

        const overridePath = path.join(overridesDir, `${fileBase}.ts`);
        if (fs.existsSync(overridePath)) {
          barrel.push(`export * from "../overrides/${fileBase}";`);
          moduleImports.push(
            `import { ${angularClass} } from "../overrides/${fileBase}";`
          );
          continue;
        }
        fs.writeFileSync(
          path.join(outDir, `${fileBase}.ts`),
          renderAngularWrapper(component, warnings)
        );
        barrel.push(`export * from "./${fileBase}";`);
        moduleImports.push(`import { ${angularClass} } from "./${fileBase}";`);
      }

      fs.writeFileSync(
        path.join(outDir, "nys-angular.module.ts"),
        renderNgModule(moduleImports, moduleClasses)
      );

      barrel.push(`export { NysAngularModule } from "./nys-angular.module";`);
      fs.writeFileSync(path.join(outDir, "index.ts"), barrel.join("\n") + "\n");

      writeNgBuildTree(components, {
        ngbuildDir,
        outDir,
        overridesDir,
        packageJsonPath,
      });

      for (const warning of warnings) {
        console.warn(`[nysds-angular-wrappers] ${warning}`);
      }
    },
  };
}
