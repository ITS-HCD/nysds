import { mergeConfig } from "vite";
import { defaultConfig } from "../../vite.config.js";
import { version } from "./package.json";

// Banner to put at the top of the generated files
const banner = `
/*!
   * █▄  █  █   █  █▀▀▀█  █▀▀▄  █▀▀▀█
   * █ █ █  █▄▄▄█  ▀▀▀▄▄  █   █ ▀▀▀▄▄
   * █  ▀█    █    █▄▄▄█  █▄▄▀  █▄▄▄█
   *
   * Skipnav Component v${version}
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

const overrideConfig = {
  build: {
    lib: {
      fileName: () => "nys-skipnav.js",
    },
    
    rollupOptions: {
      output: { banner },
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);
