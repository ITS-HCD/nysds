import { mergeConfig } from "vite";
import { defaultConfig } from "../../vite.config.js";

// Banner to put at the top of the generated files
const banner = `
/*!
   * █▄  █  █   █  █▀▀▀█  █▀▀▄  █▀▀▀█
   * █ █ █  █▄▄▄█  ▀▀▀▄▄  █  █  ▀▀▀▄▄
   * █  ▀█    █    █▄▄▄█  █▄▄▀  █▄▄▄█
   *
   * Textinput Component
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

const overrideConfig = {
  build: {
    lib: {
      fileName: () => "nys-textinput.js",
    },
    emptyOutDir: true, // Since we're building both ES and UMD formats
    rollupOptions: {
      output: [{ banner }],
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);
