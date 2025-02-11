import excelsiorTheme from "./excelsior-theme"; // Custom Storybook theme

import { addons } from "@storybook/manager-api";

addons.setConfig({
  theme: excelsiorTheme,
});
