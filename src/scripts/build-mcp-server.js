import { execSync } from "child_process";

// Define the build order for your packages
const packages = [
  { name: "mcp-server", path: "packages/mcp-server" },
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
