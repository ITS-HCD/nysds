// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/web-components-vite";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.@(js|jsx|mjs|ts|tsx|mdx)",
    "../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    "../packages/**/src/*.mdx",
    "../packages/**/src/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: [
    { from: "../packages/styles/dist", to: "/assets/css" },
    { from: "./assets/fonts", to: "/assets/fonts" },
    { from: "./assets/images", to: "/assets/images" }
  ],
  addons: [getAbsolutePath("@storybook/addon-a11y"), getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-docs")],
  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {},
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
