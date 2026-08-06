import { execSync } from "child_process";

// Define the build order for your packages
// Order is topologically sorted from each package's `dependencies` on other
// @nysds/nys-* packages (see package.json), so every dependency builds (and
// has a dist/*.d.ts) before anything that imports it. When adding a new
// `import "@nysds/nys-*"` side-effect import to a component, re-check this
// order — a package must appear after everything it now depends on.
const packages = [
  { name: "tokens", path: "packages/tokens" },
  { name: "styles", path: "packages/styles" },
  { name: "internals", path: "packages/internals" },
  { name: "nys-icon", path: "packages/nys-icon" },
  { name: "nys-accordion", path: "packages/nys-accordion" },
  { name: "nys-button", path: "packages/nys-button" },
  { name: "nys-alert", path: "packages/nys-alert" },
  { name: "nys-avatar", path: "packages/nys-avatar" },
  { name: "nys-backtotop", path: "packages/nys-backtotop" },
  { name: "nys-badge", path: "packages/nys-badge" },
  { name: "nys-breadcrumbs", path: "packages/nys-breadcrumbs" },
  { name: "nys-tooltip", path: "packages/nys-tooltip" },
  { name: "nys-label", path: "packages/nys-label" },
  { name: "nys-errormessage", path: "packages/nys-errormessage" },
  { name: "nys-textinput", path: "packages/nys-textinput" },
  { name: "nys-checkbox", path: "packages/nys-checkbox" },
  { name: "nys-combobox", path: "packages/nys-combobox" },
  { name: "nys-datepicker", path: "packages/nys-datepicker" },
  { name: "nys-divider", path: "packages/nys-divider" },
  { name: "nys-dropdownmenu", path: "packages/nys-dropdownmenu" },
  { name: "nys-fileinput", path: "packages/nys-fileinput" },
  { name: "nys-globalfooter", path: "packages/nys-globalfooter" },
  { name: "nys-globalheader", path: "packages/nys-globalheader" },
  { name: "nys-iconlist", path: "packages/nys-iconlist" },
  { name: "nys-modal", path: "packages/nys-modal" },
  { name: "nys-pagination", path: "packages/nys-pagination" },
  { name: "nys-processlist", path: "packages/nys-processlist" },
  { name: "nys-radiobutton", path: "packages/nys-radiobutton" },
  { name: "nys-select", path: "packages/nys-select" },
  { name: "nys-skipnav", path: "packages/nys-skipnav" },
  { name: "nys-stepper", path: "packages/nys-stepper" },
  { name: "nys-tab", path: "packages/nys-tab" },
  { name: "nys-table", path: "packages/nys-table" },
  { name: "nys-textarea", path: "packages/nys-textarea" },
  { name: "nys-toggle", path: "packages/nys-toggle" },
  { name: "nys-unavfooter", path: "packages/nys-unavfooter" },
  { name: "nys-unavheader", path: "packages/nys-unavheader" },
  { name: "nys-verticalnav", path: "packages/nys-verticalnav" },
  { name: "nys-video", path: "packages/nys-video" },
];

packages.forEach((pkg) => {
  console.log(`🔵 Building ${pkg.name}...`);
  // if (pkg.name === "styles") {
  //   console.log("STYLES PACKAGE DETECTED");
  //   execSync(`cd ${pkg.path} && npm run build`, { stdio: "inherit" });
  // } else {
  try {
    // Navigate to the package directory and run the build script
    execSync(`cd ${pkg.path} && npm run build`, { stdio: "inherit" });
    console.log(`✅ ${pkg.name} built successfully.`);
    console.log(`====================================`);
  } catch {
    console.error(`🚫 Failed to build ${pkg.name}. Exiting.`);
    console.log(`====================================`);
    process.exit(1); // Exit the script if a build fails
  }
  // }
});
