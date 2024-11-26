import type { StorybookConfig } from "@storybook/web-components-vite";

import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.@(js|jsx|mjs|ts|tsx|mdx)", // Central Excelsior pages (like the welcome page)
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)", // Any other component stories in /src
    "../packages/**/src/*.mdx", // Component stories in packages
    "../packages/**/src/*.stories.@(js|jsx|ts|tsx)", // Component stories in packages
  ],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y")
  ],
  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {},
  },
};
export default config;
