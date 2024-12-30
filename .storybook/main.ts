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
    "../src/stories/**/*.@(js|jsx|mjs|ts|tsx|mdx)",
    "../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    "../packages/**/src/*.mdx",
    "../packages/**/src/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],

  framework: {
    name: getAbsolutePath("@storybook/web-components-vite"),
    options: {},
  },

  docs: {},

  managerHead: (head) => `
    ${head}
    <meta name="robots" content="noindex">`,
};
export default config;
