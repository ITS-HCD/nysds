import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.@(js|jsx|mjs|ts|tsx|mdx)",
    "../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    "../packages/**/src/*.mdx",
    "../packages/**/src/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: [
    "@storybook/addon-links",
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
  viteFinal: async (config) => {
    config.css = {
      modules: false, // Ensure CSS modules are not mistakenly used
    };
    // Leave CSS handling to Vite or customize as needed
    return config;
  },
};
export default config;
