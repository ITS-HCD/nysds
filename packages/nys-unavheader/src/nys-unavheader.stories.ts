import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-unavheader";

// Define the structure of the args used in the stories
interface NysUnavHeaderArgs {
  hideTranslate: boolean;
  hideSearch: boolean;
}

const meta: Meta<NysUnavHeaderArgs> = {
  title: "Components/UnavHeader",
  component: "nys-unavheader",
  argTypes: {
    hideTranslate: { control: "boolean" },
    hideSearch: { control: "boolean" },
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

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  args: {},
  render: (args) =>
    html`<nys-unavheader
      .hideTranslate=${args.hideTranslate}
      .hideSearch=${args.hideSearch}
    ></nys-unavheader>`,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
