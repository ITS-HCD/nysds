import { create } from "@storybook/theming";

export default create({
  base: "light",
  brandTitle: "New York State Design System ↗ Storybook",
  brandUrl: "https://its-hcd.github.io/nysds/",
  fontBase: '"Proxima Nova", Arial, sans-serif',
  fontCode: "Monaco, monospace",
  colorPrimary: "#154973",
  colorSecondary: "#154973",

  brandImage: "./assets/images/nysds-logo.svg",
  brandTarget: "_self",

  // App colors
  appBg: "#e5effa",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "hsla(203, 50%, 30%, 0.15)",
  appBorderRadius: 4,

  // Text colors
  textColor: "#10162F",
  textInverseColor: "#ffffff",
});