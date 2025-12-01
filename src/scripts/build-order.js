import { execSync } from "child_process";

// Define the build order for your packages
const packages = [
  { name: "styles", path: "packages/styles" },
  { name: "nys-accordion", path: "packages/nys-accordion" },
  { name: "nys-alert", path: "packages/nys-alert" },
  { name: "nys-avatar", path: "packages/nys-avatar" },
  { name: "nys-backtotop", path: "packages/nys-backtotop" },
  { name: "nys-badge", path: "packages/nys-badge" },
  { name: "nys-button", path: "packages/nys-button" },
  { name: "nys-checkbox", path: "packages/nys-checkbox" },
  { name: "nys-divider", path: "packages/nys-divider" },
  { name: "nys-fileinput", path: "packages/nys-fileinput" },
  { name: "nys-errormessage", path: "packages/nys-errormessage" },
  { name: "nys-globalheader", path: "packages/nys-globalheader" },
  { name: "nys-globalfooter", path: "packages/nys-globalfooter" },
  { name: "nys-icon", path: "packages/nys-icon" },
  { name: "nys-label", path: "packages/nys-label" },
  { name: "nys-modal", path: "packages/nys-modal" },
  { name: "nys-pagination", path: "packages/nys-pagination" },
  { name: "nys-radiobutton", path: "packages/nys-radiobutton" },
  { name: "nys-select", path: "packages/nys-select" },
  { name: "nys-skipnav", path: "packages/nys-skipnav" },
  { name: "nys-stepper", path: "packages/nys-stepper" },
  { name: "nys-textarea", path: "packages/nys-textarea" },
  { name: "nys-textinput", path: "packages/nys-textinput" },
  { name: "nys-toggle", path: "packages/nys-toggle" },
  { name: "nys-tooltip", path: "packages/nys-tooltip" },
  { name: "nys-unavheader", path: "packages/nys-unavheader" },
  { name: "nys-unavfooter", path: "packages/nys-unavfooter" },
  { name: "nys-date-picker", path: "packages/nys-date-picker" },
  { name: "nys-datepicker", path: "packages/nys-datepicker" },
];

packages.forEach((pkg) => {
  console.log(`🔵 Building ${pkg.name}...`);
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
});
