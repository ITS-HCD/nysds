import type { Preview } from "@storybook/web-components";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        type: "code",
      },
    },
  },

  tags: ["autodocs"],
};

export default preview;
