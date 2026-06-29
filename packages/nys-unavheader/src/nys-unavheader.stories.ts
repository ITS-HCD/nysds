import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-unavheader";
import "@nysds/nys-textinput";

const meta: Meta = {
  title: "Components/Unavheader",
  component: "nys-unavheader",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    return html` <nys-unavheader></nys-unavheader> `;
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
