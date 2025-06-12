import nysdsTheme from "./nysds-theme"; // Custom Storybook theme

import { addons } from "storybook/manager-api";

addons.setConfig({
  theme: nysdsTheme,
});
