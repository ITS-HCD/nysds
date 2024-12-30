import { execSync } from "child_process";
import { readdirSync, existsSync } from "fs";
import { resolve, join } from "path";

// Paths
const rootDir = resolve();
const packagesDir = join(rootDir, "packages");

// Collect all packages in the workspaces
const packages = readdirSync(packagesDir).filter((pkg) => {
  const packageJsonPath = join(packagesDir, pkg, "package.json");
  return existsSync(packageJsonPath); // Ensure the package.json exists
});

// Add root package to the dry-run
const allPackages = ["root", ...packages];

// Run the dry-run
for (const pkg of allPackages) {
  const packagePath = pkg === "root" ? rootDir : join(packagesDir, pkg);
  console.log(`========================================================`);
  console.log(`Running dry-run for package: ${pkg}`);
  try {
    execSync("npm publish --dry-run --tag alpha", {
      cwd: packagePath,
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`Dry-run failed for ${pkg}:`, error.message);
  }
}
