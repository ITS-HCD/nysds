import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.@(js|jsx|mjs|ts|tsx|mdx)",
    "../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    "../packages/**/src/*.mdx",
    "../packages/**/src/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: [{ from: "../packages/nys-styles/dist", to: "/assets" }],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-toolbars",
  ],

  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {},

  managerHead: (head) => `
    ${head}
    <meta name="robots" content="noindex">`,
};
export default config;
