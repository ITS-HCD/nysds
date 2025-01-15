import type { Preview } from "@storybook/web-components";
import "@nys-excelsior/nys-styles/dist/excelsior-full.min.css"; // Excelsior Design Tokens
import "./preview.css"; // Custom Storybook styles

// Add this function to dynamically load themes based on Storybook globals
const loadTheme = (theme: string) => {
  // Remove existing theme link elements
  const existingLink = document.querySelector("#storybook-theme-styles");
  if (existingLink) {
    existingLink.remove();
  }

  // Dynamically add the selected theme
  if (theme !== "default") {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `./assets/excelsior-theme-${theme}.min.css`;
    link.id = "storybook-theme-styles";
    document.head.appendChild(link);
  }
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default (NYS Blue)" },
          { value: "admin", title: "Administration" },
          { value: "business", title: "Business" },
          { value: "health", title: "Health and Human Services" },
          { value: "local", title: "Local and Regional Authorities" },
          { value: "safety", title: "Public Safety" },
          { value: "environment", title: "Recreation and Environment" },
          { value: "transportation", title: "Transportation and Utilities" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Load the theme based on Storybook's global context
      const theme = context.globals.theme;
      loadTheme(theme);

      return Story();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['About', 'Styles', 'Design Tokens', 'Layout Grid', 'Flexbox', 'Utilities', 'Components'],
      },
    },
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
};

export default preview;
