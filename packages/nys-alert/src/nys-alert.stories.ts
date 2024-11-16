import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  type: string;
  title: string;
  description: string;
}

const meta: Meta<NysAlertArgs> = {
  title: "Components/Alert",
  component: "nys-alert",
  argTypes: {
    type: {
      control: "select",
      options: ["info", "warning", "success", "error", "emergency"],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysAlertArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Editable
export const AllAlerts: Story = {
  args: {
    type: "info",
    title: "Information status",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert>
</nys-alert>`.trim(),
        type: "auto",
      },
    },
  },
};
