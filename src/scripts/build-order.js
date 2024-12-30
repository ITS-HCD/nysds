import { execSync } from "child_process";

// Define the build order for your packages
const packages = [
  { name: "form-controller", path: "packages/nys-form" },
  { name: "nys-icon", path: "packages/nys-icon" },
  { name: "nys-alert", path: "packages/nys-alert" },
  { name: "nys-checkbox", path: "packages/nys-checkbox" },
  { name: "nys-radiobutton", path: "packages/nys-radiobutton" },
  { name: "nys-select", path: "packages/nys-select" },
  { name: "nys-test-component", path: "packages/nys-test-component" },
  { name: "nys-textarea", path: "packages/nys-textarea" },
  { name: "nys-textinput", path: "packages/nys-textinput" },
  { name: "nys-toggle", path: "packages/nys-toggle" },
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
