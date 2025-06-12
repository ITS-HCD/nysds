import type { Preview } from "@storybook/web-components-vite";

import "./preview.css"; // Custom Storybook styles

const loadTheme = (() => {
  let themeLink: HTMLLinkElement | null;

  return (theme) => {
    if (!themeLink) {
      // Create the theme <link> element if it doesn't exist
      themeLink = document.createElement("link");
      themeLink.rel = "stylesheet";
      themeLink.id = "storybook-theme-styles";
      document.head.appendChild(themeLink);
    }

    // Update the href to the new theme
    themeLink.href =
      theme === "default"
        ? "" // Set to empty or a default stylesheet if needed
        : `./assets/css/themes/${theme}.css`;
  };
})();

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
      setTimeout(() => {
        const skipnav = document.querySelector("nys-skipnav");
        const link = skipnav?.shadowRoot?.querySelector("a");
        if (link) {
          link.classList.add("show");
        }
      }, 0);
      return Story();
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: [
          "About",
          "Styles",
          "Design Tokens",
          "Typography",
          "Layout Grid",
          "Flexbox",
          "Utilities",
          "Components",
        ],
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
