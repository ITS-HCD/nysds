import "@nys-excelsior/nys-styles/dist/excelsior.min.css"; // Excelsior Design Tokens

import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Excelsior Design System",
    fontBase: "'Proxima Nova', Arial, sans-serif",
    fontCode: "Monaco, monospace",
    colorPrimary: "#154973",
    colorSecondary: "#154973",

    // A
    appBg: "#e5effa",
    appContentBg: "#ffffff",
    appPreviewBg: "#ffffff",
    appBorderColor: "hsla(203, 50%, 30%, 0.15)",
    appBorderRadius: 4,

    // Text colors
    textColor: "#10162F",
    textInverseColor: "#ffffff",
  }),
});
