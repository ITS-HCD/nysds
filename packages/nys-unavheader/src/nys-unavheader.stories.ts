import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-unavheader";
import "@nysds/nys-alert";
import "@nysds/nys-button";
import "@nysds/nys-icon";
import "@nysds/nys-textinput";

const meta: Meta = {
  title: "Components/Unavheader",
  component: "nys-unavheader",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Universal NYS header with trust bar, logo, search, and language translation. Required on all NYS sites.\n\nPlace as the first element in `<body>`. Includes "official site" trust indicator, NY.gov logo,\nsite search (searches ny.gov), and 14-language translation dropdown. Use `hideSearch` or `hideTranslate`\nto remove features if not applicable.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysUnavHeader />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-unavheader></nys-unavheader>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    hideTranslate: false,
    hideSearch: false,
    searchUrl: "",
    landmarkLabel: "New York State",
  },
  render: (args) => {
    return html`
      <nys-unavheader
        ?hideTranslate=${args.hideTranslate}
        ?hideSearch=${args.hideSearch}
        searchUrl=${args.searchUrl}
        landmarkLabel=${args.landmarkLabel}
      ></nys-unavheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const HideSearch: Story = {
  render: () => {
    return html` <nys-unavheader hideSearch></nys-unavheader> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader hideSearch></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const HideTranslate: Story = {
  render: () => {
    return html` <nys-unavheader hideTranslate></nys-unavheader> `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader hideTranslate></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const CustomLandmarkLabel: Story = {
  render: () => {
    return html`
      <!-- Renames the banner landmark. Keep it distinct from the agency header's. -->
      <nys-unavheader landmarkLabel="Statewide"></nys-unavheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<!-- Renames the banner landmark. Keep it distinct from the agency header's. -->
<nys-unavheader landmarkLabel="Statewide"></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const CustomSearchURL: Story = {
  render: () => {
    return html`
      <nys-unavheader
        searchUrl="https://designsystem.ny.gov/search/?q="
      ></nys-unavheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader searchUrl="https://designsystem.ny.gov/search/?q="></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const CustomLanguageList: Story = {
  render: () => {
    return html`
      <nys-unavheader id="my-header"></nys-unavheader>
      <script>
        const header = document.querySelector("#my-header");
        header.languages = [
          { code: "en", label: "English" },
          { code: "es", label: "Español", url: '"https://ny.gov/?lang=es"' },
          { code: "fr", label: "Français", url: '"https://ny.gov/?lang=fr"' },
        ];
      </script>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader id="my-header"></nys-unavheader>
<script>
const header = document.querySelector('#my-header');
header.languages = [
{ code: 'en', label: 'English' },
{ code: 'es', label: 'Español' , url: '"https://ny.gov/?lang=es"'},
{ code: 'fr', label: 'Français', url: '"https://ny.gov/?lang=fr"'},
];
</script>`,
        type: "auto",
      },
    },
  },
};

export const CustomLanguageListJS: Story = {
  render: () => {
    return html`
      <nys-unavheader id="my-header2"></nys-unavheader>
      <script>
        document
          .querySelector("#my-header2")
          .addEventListener("nys-language-select", (event) => {
            event.preventDefault();
            const selectedLanguage = event.detail.language.label;
          });
      </script>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader id="my-header2"></nys-unavheader>
<script>
document.querySelector('#my-header2').addEventListener('nys-language-select', (event) => {
event.preventDefault();
const selectedLanguage = event.detail.language.label;
});
</script>`,
        type: "auto",
      },
    },
  },
};
