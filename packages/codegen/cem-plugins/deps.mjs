/**
 * CEM plugin: rewrites the generated blocks in the framework package.json
 * files so they stay in lockstep with the monorepo (decisions L3, L4).
 *
 * For each target it rewrites:
 * - `dependencies`: one exact-version entry per `@nysds/nys-*` component
 *   package that has a wrapper; other dependencies are kept as written.
 *   The exact versions are what guarantee wrapper/component alignment —
 *   no `@nysds/components` peer is written (nothing imports the root
 *   package, and the peer made npm pull the published bundle into
 *   consumer apps and into this monorepo, where its stale types shadowed
 *   workspace source).
 * - `exports`: the barrel entry, one subpath per component, and
 *   `./package.json`. Hand-added subpaths outside that set are dropped, so
 *   put extra entry points behind the barrel instead.
 *
 * A missing target package.json logs a warning and is skipped — the react
 * and angular packages are scaffolded in later workstreams.
 */
import fs from "node:fs";
import { listComponents } from "./lib/core.mjs";

function reactSubpathEntry(component) {
  return {
    types: `./dist/generated/${component.className}.d.ts`,
    import: `./dist/generated/${component.className}.js`,
  };
}

function angularSubpathEntry(component) {
  // One ng-packagr secondary entry point per component, generated into the
  // staging tree by the angular wrapper plugin.
  return angularEntry(component.subpath);
}

/** An `exports` entry for one ng-packagr entry point, by its subpath. */
function angularEntry(subpath) {
  return {
    types: `./dist/${subpath}/index.d.ts`,
    default: `./dist/fesm2022/nysds-angular-${subpath}.mjs`,
  };
}

function vueSubpathEntry(component) {
  return {
    types: `./dist/generated/${component.className}.d.ts`,
    import: `./dist/generated/${component.className}.js`,
  };
}

const SUBPATH_ENTRY_BY_FRAMEWORK = {
  react: reactSubpathEntry,
  vue: vueSubpathEntry,
  angular: angularSubpathEntry,
};

function sortObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
  );
}

export function depsPlugin(options = {}) {
  const {
    rootPackageJson = "package.json",
    targets = [
      { path: "packages/react/package.json", framework: "react" },
      { path: "packages/angular/package.json", framework: "angular" },
      { path: "packages/vue/package.json", framework: "vue" },
    ],
  } = options;

  return {
    name: "nysds-framework-deps",

    packageLinkPhase({ customElementsManifest }) {
      const components = listComponents(customElementsManifest);
      if (components.length === 0) return;

      const rootPkg = JSON.parse(fs.readFileSync(rootPackageJson, "utf8"));
      const version = rootPkg.version;

      const componentPackages = [
        ...new Set(components.map((component) => component.packageName)),
      ].sort();

      for (const target of targets) {
        if (!fs.existsSync(target.path)) {
          console.warn(
            `[nysds-framework-deps] ${target.path} not found — skipped (scaffolded in a later workstream).`
          );
          continue;
        }
        const subpathEntry = SUBPATH_ENTRY_BY_FRAMEWORK[target.framework];
        if (!subpathEntry) {
          throw new Error(
            `[nysds-framework-deps] Unknown framework "${target.framework}" for ${target.path}`
          );
        }

        const pkg = JSON.parse(fs.readFileSync(target.path, "utf8"));

        const dependencies = {};
        for (const [name, range] of Object.entries(pkg.dependencies ?? {})) {
          if (!componentPackages.includes(name) && !name.startsWith("@nysds/nys-")) {
            dependencies[name] = range;
          }
        }
        for (const packageName of componentPackages) {
          dependencies[packageName] = version;
        }
        pkg.dependencies = sortObject(dependencies);

        // Remove the peer this plugin used to write, so regeneration heals
        // package.json files from before the peer was dropped.
        if (pkg.peerDependencies) {
          delete pkg.peerDependencies["@nysds/components"];
        }

        // Subpath exports for per-component bundling. These are generated for
        // both frameworks: hand-maintaining the Angular half is what let it
        // drift into advertising a subpath for every component while the build
        // emitted a single bundle.
        const exportsMap = {};
        if (target.framework === "angular") {
          exportsMap["."] = {
            types: "./dist/index.d.ts",
            default: "./dist/fesm2022/nysds-angular.mjs",
          };
          // The shared form-control accessors are their own entry point so no
          // source file is compiled into more than one bundle.
          exportsMap["./forms"] = angularEntry("forms");
        } else {
          exportsMap["."] = pkg.exports?.["."] ?? {
            types: "./dist/index.d.ts",
            import: "./dist/index.js",
          };
        }
        for (const component of components) {
          exportsMap[`./${component.subpath}`] = subpathEntry(component);
        }
        if (target.framework === "angular") {
          // Several tools resolve `<pkg>/package.json` directly. Safe to add
          // here: ng-packagr generates its own map for dist/ and never reads
          // this one.
          exportsMap["./package.json"] = "./package.json";
        }
        pkg.exports = exportsMap;

        fs.writeFileSync(target.path, JSON.stringify(pkg, null, 2) + "\n");
      }
    },
  };
}
