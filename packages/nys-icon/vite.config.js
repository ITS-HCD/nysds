import { mergeConfig } from "vite";
import { defaultConfig } from "../../vite.config.js";
import { copyFileSync, mkdirSync, readdirSync } from "fs";
import { resolve, join } from "path";

// Banner to put at the top of the generated files
const banner = `
/*!
   * █▄  █  █   █  █▀▀▀█  █▀▀▄  █▀▀▀█
   * █ █ █  █▄▄▄█  ▀▀▀▄▄  █   █ ▀▀▀▄▄
   * █  ▀█    █    █▄▄▄█  █▄▄▀  █▄▄▄█
   *
   * Icon Component
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

// Plugin to copy individual SVG icon files into dist/icons/
function copyIcons() {
  return {
    name: "copy-icons",
    closeBundle() {
      const srcDir = resolve(import.meta.dirname, "src/icons");
      const destDir = resolve(import.meta.dirname, "dist/icons");
      mkdirSync(destDir, { recursive: true });
      let count = 0;
      for (const file of readdirSync(srcDir)) {
        if (file.endsWith(".svg")) {
          copyFileSync(join(srcDir, file), join(destDir, file));
          count++;
        }
      }
      console.log(`✓ Copied ${count} icon SVGs to dist/icons/`);
    },
  };
}

const overrideConfig = {
  build: {
    lib: {
      fileName: () => "nys-icon.js",
    },

    rollupOptions: {
      output: { banner },
      plugins: [copyIcons()],
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);
