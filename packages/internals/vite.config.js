import { mergeConfig } from "vite";
import { defaultConfig } from "../../vite.config.js";

// Internal shared module (mixins + ARIA helpers). Not a custom element.
const overrideConfig = {
  build: {
    lib: {
      entry: ["./src/index.ts"],
      fileName: () => "index.js",
    },
  },
};

export default mergeConfig(defaultConfig, overrideConfig);
