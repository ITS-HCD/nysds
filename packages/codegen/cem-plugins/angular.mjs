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

/**
 * Properties Angular or the platform already manage on any host element.
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
]);

const ACCESSOR_BY_KIND = {
  value: { className: "NysValueAccessor", file: "../lib/forms/value-accessor" },
  checked: {
    className: "NysCheckedAccessor",
    file: "../lib/forms/checked-accessor",
  },
  files: { className: "NysFilesAccessor", file: "../lib/forms/files-accessor" },
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
    if (type === "unknown") {
      // Fall back to the element's own property type so the wrapper still
      // compiles and never widens to `any`.
      type = `${className}["${prop.name}"]`;
      warnings.push(
        `${tag}: property "${prop.name}" has no usable type in the manifest; using ${type}`
      );
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
    bodyLines.push(
      `  ${decorator} set ${prop.name}(v: ${type}) { this.el.nativeElement.${prop.name} = v; }`
    );
    bodyLines.push(
      `  get ${prop.name}(): ${type} { return this.el.nativeElement.${prop.name}; }`
    );
  }

  if (events.length > 0) bodyLines.push(``);
  const listenerLines = [];
  for (const event of events) {
    const { text, importName } = resolveEventType(event.typeText);
    if (importName) typeImports.add(importName);
    bodyLines.push(...docComment(event.description, "  "));
    bodyLines.push(`  readonly ${event.angularOutput} = output<${text}>();`);

    const extras = [`this.${event.angularOutput}.emit(e);`];
    if (accessor) {
      if (event.name === formControl.changeEvent) {
        extras.push(`this.handleChange(e);`);
      } else if (event.name === formControl.inputEvent) {
        extras.push(`this.handleInput(e);`);
      } else if (event.name === NYS_BLUR_EVENT) {
        extras.push(`this.handleBlur();`);
      }
    }
    listenerLines.push(
      `  @HostListener("${event.name}", ["$event"]) protected _on${pascalize(event.name)}(e: ${text}) { ${extras.join(" ")} }`
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

export function angularPlugin(options = {}) {
  const {
    outDir = "packages/angular/src/generated",
    overridesDir = "packages/angular/src/overrides",
  } = options;

  return {
    name: "nysds-angular-wrappers",

    packageLinkPhase({ customElementsManifest }) {
      const components = listComponents(customElementsManifest);
      if (components.length === 0) return;

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

      const moduleLines = [
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
      ];
      fs.writeFileSync(
        path.join(outDir, "nys-angular.module.ts"),
        moduleLines.join("\n")
      );

      barrel.push(`export { NysAngularModule } from "./nys-angular.module";`);
      fs.writeFileSync(path.join(outDir, "index.ts"), barrel.join("\n") + "\n");

      for (const warning of warnings) {
        console.warn(`[nysds-angular-wrappers] ${warning}`);
      }
    },
  };
}
