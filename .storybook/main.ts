import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.@(js|jsx|mjs|ts|tsx|mdx)",
    "../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))",
    "../packages/**/src/*.mdx",
    "../packages/**/src/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: [
    { from: "../packages/nys-styles/dist", to: "/assets/css" },
    { from: "./assets/fonts", to: "/assets/fonts" }
  ],
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
  managerHead: (head) => `
    ${head}
    <meta name="robots" content="noindex">
    <link rel="preload" href="/assets/fonts/proximanova-regular.woff2" as="font" type="font/woff2">
    `,
};

export default config;
