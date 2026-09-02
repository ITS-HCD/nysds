/**
 * CEM plugin: rewrites the generated blocks in the framework package.json
 * files so they stay in lockstep with the monorepo (decisions L3, L4).
 *
 * For each target it rewrites:
 * - `dependencies`: one exact-version entry per `@nysds/nys-*` component
 *   package that has a wrapper; other dependencies are kept as written.
 * - `peerDependencies["@nysds/components"]`: `^<major>.<minor>.0`.
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
  // ng-packagr secondary entry points; WS4 owns the final dist layout.
  return {
    types: `./dist/${component.subpath}/index.d.ts`,
    default: `./dist/fesm2022/nysds-angular-${component.subpath}.mjs`,
  };
}

const SUBPATH_ENTRY_BY_FRAMEWORK = {
  react: reactSubpathEntry,
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
    ],
  } = options;

  return {
    name: "nysds-framework-deps",

    packageLinkPhase({ customElementsManifest }) {
      const components = listComponents(customElementsManifest);
      if (components.length === 0) return;

      const rootPkg = JSON.parse(fs.readFileSync(rootPackageJson, "utf8"));
      const version = rootPkg.version;
      const [major, minor] = version.split(".");
      const componentsPeerRange = `^${major}.${minor}.0`;

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

        pkg.peerDependencies = {
          ...(pkg.peerDependencies ?? {}),
          "@nysds/components": componentsPeerRange,
        };

        // For React: generate subpath exports for per-component bundling.
        // For Angular: ng-packagr owns the exports (dist/package.json); skip here.
        if (target.framework === "react") {
          const exportsMap = {};
          exportsMap["."] = pkg.exports?.["."] ?? {
            types: "./dist/index.d.ts",
            import: "./dist/index.js",
          };
          for (const component of components) {
            exportsMap[`./${component.subpath}`] = subpathEntry(component);
          }
          // Note: package.json is always accessible via the filesystem and doesn't
          // need an explicit export entry. ng-packagr fails if we add it as a bare string.
          pkg.exports = exportsMap;
        }

        fs.writeFileSync(target.path, JSON.stringify(pkg, null, 2) + "\n");
      }
    },
  };
}
