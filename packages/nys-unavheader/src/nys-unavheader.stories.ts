import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-unavheader";
import "@nysds/nys-button";
import "@nysds/nys-icon";
import "@nysds/nys-textinput";

interface Language {
  code: string;
  label: string;
  url?: string;
}

// Define the structure of the args used in the stories
interface NysUnavHeaderArgs {
  hideTranslate: boolean;
  hideSearch: boolean;
  searchUrl: string;
  languages: Language[];
}

const meta: Meta<NysUnavHeaderArgs> = {
  title: "Components/UnavHeader",
  component: "nys-unavheader",
  argTypes: {
    hideTranslate: { control: "boolean" },
    hideSearch: { control: "boolean" },
    searchUrl: { control: "text" },
    languages: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysUnavHeaderArgs>;

export const Basic: Story = {
  args: {
    hideTranslate: false,
    hideSearch: false,
    searchUrl: "",
  },
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
      .searchUrl=${args.searchUrl}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-unavheader></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const HideTranslateSearch: Story = {
  args: {
    hideTranslate: true,
    hideSearch: true,
    searchUrl: "",
  },
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-unavheader hideTranslate hideSearch></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const CustomSearchUrl: Story = {
  args: {
    hideTranslate: true,
    hideSearch: false,
    searchUrl: "https://www.google.com/search?q=",
  },
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
      .searchUrl=${args.searchUrl}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-unavheader hideTranslate searchUrl="https://www.google.com/search?q="></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};
export const CustomLanguages: Story = {
  args: {
    hideTranslate: false,
    hideSearch: false,
    searchUrl: "",
    languages: [
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
      { code: "fr", label: "Français" },
    ],
  },
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
      .searchUrl=${args.searchUrl}
      .languages=${args.languages}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-unavheader id="my-header"></nys-unavheader>
<script>
  const header = document.querySelector('#my-header');
  header.languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ];
</script>`,
        type: "auto",
      },
    },
  },
};
export const CustomLanguageUrl: Story = {
  args: {
    hideTranslate: false,
    hideSearch: true,
    searchUrl: "",
    languages: [
      { code: "en", label: "English" },
      { code: "es", label: "Español", url: "https://www.google.com" },
      { code: "fr", label: "Français", url: "https://www.google.com" },
    ],
  },
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
      .searchUrl=${args.searchUrl}
      .languages=${args.languages}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-unavheader id="my-header" hideSearch></nys-unavheader>
<script>
  const header = document.querySelector('#my-header');
  header.languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español', url: 'https://www.google.com' },
    { code: 'fr', label: 'Français', url: 'https://www.google.com' },
  ];
</script>`,
        type: "auto",
      },
    },
  },
};
export const CustomLanguageJSOverride: Story = {
  args: {
    hideTranslate: false,
    hideSearch: true,
    searchUrl: "",
    languages: [
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
      { code: "fr", label: "Français" },
    ],
  },
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
      .searchUrl=${args.searchUrl}
      .languages=${args.languages}
      @nys-language-select=${(e: CustomEvent) => {
        e.preventDefault();
        alert(`Language changed to: ${e.detail.language.label}`);
      }}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: `<nys-unavheader id="my-header" hideSearch></nys-unavheader>
<script>
  document.querySelector('#my-header').addEventListener('nys-language-select', (event) => {
    event.preventDefault();
    const selectedLanguage = event.detail.language.label;
    alert(\`Language changed to: \${selectedLanguage}\`);
  });
</script>`,
        type: "auto",
      },
    },
  },
};
