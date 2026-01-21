import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-unavheader";
import "@nysds/nys-button";
import "@nysds/nys-icon";
import "@nysds/nys-textinput";

// Define the structure of the args used in the stories
interface NysUnavHeaderArgs {
  hideTranslate: boolean;
  hideSearch: boolean;
  searchUrl: string;
}

const meta: Meta<NysUnavHeaderArgs> = {
  title: "Components/UnavHeader",
  component: "nys-unavheader",
  argTypes: {
    hideTranslate: { control: "boolean" },
    hideSearch: { control: "boolean" },
    searchUrl: { control: "text" },
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
    searchUrl: "https://www.google.com/search",
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
        code: `<nys-unavheader hideTranslate searchUrl="https://www.google.com/search"></nys-unavheader>`,
        type: "auto",
      },
    },
  },
};
