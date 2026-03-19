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
   * Global Footer Component v${version}
   * Part of the New York State Design System
   * Repository: https://github.com/its-hcd/nysds
   * License: MIT
*/
`;

const overrideConfig = {
  build: {
    lib: {
      fileName: () => "nys-globalfooter.js",
    },
    
    rollupOptions: {
      output: { banner },
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);
