import { execSync } from "child_process";

// Define the build order for your packages
const packages = [
  { name: "nys-icon", path: "packages/nys-icon" },
  { name: "nys-alert", path: "packages/nys-alert" },
  { name: "nys-checkbox", path: "packages/nys-checkbox" },
];

packages.forEach((pkg) => {
  console.log(`Building ${pkg.name}...`);
  try {
    // Navigate to the package directory and run the build script
    execSync(`cd ${pkg.path} && npm run build`, { stdio: "inherit" });
    console.log(`${pkg.name} built successfully.`);
  } catch (error) {
    console.error(`Failed to build ${pkg.name}. Exiting.`);
    process.exit(1); // Exit the script if a build fails
  }
}); 