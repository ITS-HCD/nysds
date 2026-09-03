// src/scripts/cem-angular-plugin.mjs
import fs from "fs";
import path from "path";

// List of form elements that must implement ControlValueAccessor
const FORM_COMPONENTS = {
  "nys-textinput": { valueProp: "value", event: "nys-change" },
  "nys-textarea": { valueProp: "value", event: "nys-change" },
  "nys-checkbox": { valueProp: "checked", event: "nys-change" },
  "nys-radiobutton": { valueProp: "checked", event: "nys-change" },
  "nys-select": { valueProp: "value", event: "nys-change" },
  "nys-toggle": { valueProp: "checked", event: "nys-change" },
  "nys-datepicker": { valueProp: "value", event: "nys-change" },
  "nys-fileinput": { valueProp: "value", event: "nys-change" },
  "nys-combobox": { valueProp: "value", event: "nys-change" }
};

export function angularWrapperPlugin(options = {}) {
  const outdir = path.resolve(process.cwd(), options.outdir || "./packages/angular");
  const srcdir = path.join(outdir, "src");
  const libdir = path.join(srcdir, "lib");

  return {
    name: "nysds-angular-generator",
    packageLinkPhase({ customElementsManifest }) {
      // Ensure target folders exist
      fs.mkdirSync(libdir, { recursive: true });

      const componentNames = [];

      for (const mod of customElementsManifest.modules) {
        if (!mod.declarations) continue;

        // Resolve correct package name from physical module path (e.g. packages/nys-accordion/src/...)
        const pathParts = mod.path.split("/");
        const packageFolder = pathParts[1]; // e.g. "nys-accordion"
        const resolvedPackage = `@nysds/${packageFolder}`;

        for (const decl of mod.declarations) {
          if (!decl.customElement || !decl.tagName) continue;

          const className = decl.name; // e.g. NysButton
          const tagName = decl.tagName; // e.g. nys-button
          const formConfig = FORM_COMPONENTS[tagName];

          const props = decl.members?.filter((m) => m.kind === "field" && !m.static && m.privacy !== "private") || [];
          const events = decl.events || [];

          // Format inputs and outputs
          const inputs = props.map((p) => `  @Input() ${p.name}: any;`).join("\n");
          const outputs = events.map((e) => `  @Output() "${e.name}" = new EventEmitter<CustomEvent<any>>();`).join("\n");

          // Build host property bindings so inputs actually sync directly to the host DOM element properties
          const hostBindings = props.map((p) => `    '[${p.name}]': '${p.name}'`).join(",\n");
          const hostStr = hostBindings ? `,\n  host: {\n${hostBindings}\n  }` : "";

          // Build Dynamic Angular core imports to avoid TS unused variable errors
          const coreImports = ["Component", "Input", "ChangeDetectionStrategy"];
          const formImports = [];

          if (events.length > 0) {
            coreImports.push("Output", "EventEmitter");
          }

          if (formConfig) {
            coreImports.push("HostListener", "forwardRef", "ElementRef");
            formImports.push("ControlValueAccessor", "NG_VALUE_ACCESSOR");
          }

          const coreImportStr = `import { ${coreImports.join(", ")} } from '@angular/core';`;
          const formImportStr = formConfig ? `import { ${formImports.join(", ")} } from '@angular/forms';\n` : "";

          // Build ControlValueAccessor boilerplate if form component
          let cvaProviders = "";
          let cvaImplementation = "";

          if (formConfig) {
            cvaProviders = `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ${className}Component),
      multi: true
    }
  ]`;

            cvaImplementation = `
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.${formConfig.valueProp} = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.elementRef.nativeElement) {
      this.elementRef.nativeElement.disabled = isDisabled;
    }
  }

  @HostListener('${formConfig.event}', ['$event'])
  handleInputEvent(event: any): void {
    const val = event.target.${formConfig.valueProp};
    this.onChange(val);
    this.onTouched();
  }
`;
          }

          // Complete Component Template
          const componentContent = `${coreImportStr}
${formImportStr}import "${resolvedPackage}";

@Component({
  selector: '${tagName}',
  template: '<ng-content></ng-content>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush${hostStr}${cvaProviders}
})
export class ${className}Component${formConfig ? " implements ControlValueAccessor" : ""} {
${inputs}

${outputs}
${formConfig ? `\n  constructor(private elementRef: ElementRef) {}` : ""}
${cvaImplementation}
}
`;

          fs.writeFileSync(path.join(libdir, `${tagName}.component.ts`), componentContent, "utf-8");
          componentNames.push({ className, tagName });
        }
      }

      // Generate Angular Public API Barrel Exporter (public-api.ts)
      const importsAndExports = componentNames
        .map((c) => `export * from './lib/${c.tagName}.component';`)
        .join("\n");

      const publicApiContent = `${importsAndExports}
`;
      fs.writeFileSync(path.join(srcdir, "public-api.ts"), publicApiContent, "utf-8");
      console.log(`✅ Angular standalone components successfully written to ${libdir}`);
    }
  };
}
