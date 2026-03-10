import { mergeConfig } from "vite";
import { defaultConfig } from "../../vite.config.js";

// Banner to put at the top of the generated files
const banner = `
/*!
   * █▄  █  █   █  █▀▀▀█  █▀▀▄  █▀▀▀█
   * █ █ █  █▄▄▄█  ▀▀▀▄▄  █   █ ▀▀▀▄▄
   * █  ▀█    █    █▄▄▄█  █▄▄▀  █▄▄▄█
   *
   * Tab Component v1.15.0
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

const overrideConfig = {
  build: {
    lib: {
      fileName: () => "nys-tab.js",
    },

    rollupOptions: {
      output: { banner },
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);
