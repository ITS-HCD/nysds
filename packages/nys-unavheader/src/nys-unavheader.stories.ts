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
    translateKey: "NEf4Y5qMb9PGP",
    landmarkLabel: "New York State",
  },
  render: (args) => {
    return html`
      <nys-unavheader
        ?hideTranslate=${args.hideTranslate}
        ?hideSearch=${args.hideSearch}
        searchUrl=${args.searchUrl}
        translateKey=${args.translateKey}
        landmarkLabel=${args.landmarkLabel}
      ></nys-unavheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader translateKey="NEf4Y5qMb9PGP"></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};

export const DebugScreenReaders: Story = {
  args: {
    hideTranslate: false,
    hideSearch: false,
    searchUrl: "",
    translateKey: "NEf4Y5qMb9PGP",
    landmarkLabel: "New York State",
  },
  render: (args) => {
    return html`
      <nys-unavheader
        ?hideTranslate=${args.hideTranslate}
        ?hideSearch=${args.hideSearch}
        searchUrl=${args.searchUrl}
        translateKey=${args.translateKey}
        landmarkLabel=${args.landmarkLabel}
      ></nys-unavheader>
      <hr />
      <style>
        .test-menu {
          display: flex;
          flex-direction: column;
        }
        .test-menu [role="menuitem"] {
          border: 1px solid;
          margin-block-start: 2px;
          padding: 2px;
        }
      </style>

      <h1>Translate</h1>

      <nys-alert
        type="emergency"
        text="Alert without heading."
        dismissible
      ></nys-alert>
      <hr />
      <nys-alert
        type="success"
        heading="Alert with heading"
        text="This is a sentence."
        dismissible
      ></nys-alert>

      <h2 lang="en" notranslate>Menu of buttons</h2>

      <div role="menu" class="test-menu">
        <button type="button" role="menuitem">
          <span notranslate lang="en">English</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">English</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="es">Español</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Spanish</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="zh-Hans">中文</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Chinese</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="zh-Hant">繁體中文</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Traditional Chinese</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="yi">יידיש</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Yiddish</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="ru">Русский</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Russian</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="bn">বাংলা</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Bengali</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="ko">한국어</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Korean</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="ht">Kreyòl Ayisyen</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Haitian Creole</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="it">Italiano</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Italian</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="ar">العربية</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Arabic</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="pl">Polski</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Polish</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="fr">Français</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">French</span>
        </button>
        <button type="button" role="menuitem">
          <span notranslate lang="ur">اردو</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Urdu</span>
        </button>
      </div>

      <h2 lang="en" notranslate>Menu of divs</h2>

      <div class="test-menu" role="menu">
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="en">English</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">English</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="es">Español</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Spanish</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="zh-Hans">中文</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Chinese</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="zh-Hant">繁體中文</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Traditional Chinese</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="yi">יידיש</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Yiddish</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="ru">Русский</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Russian</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="bn">বাংলা</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Bengali</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="ko">한국어</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Korean</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="ht">Kreyòl Ayisyen</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Haitian Creole</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="it">Italiano</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Italian</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="ar">العربية</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Arabic</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="pl">Polski</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Polish</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="fr">Français</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">French</span>
        </div>
        <div tabindex="-1" role="menuitem">
          <span notranslate lang="ur">اردو</span>
          <span aria-hidden="true"> / </span>
          <span lang="fr">Urdu</span>
        </div>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavheader translateKey="NEf4Y5qMb9PGP"></nys-unavheader>`,
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
