import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-card";

// Define the structure of the args used in the stories
interface NysCardArgs {
  id: string;
  onClick: () => void;
}

const meta: Meta<NysCardArgs> = {
  title: "Components/Card",
  component: "nys-card",
  argTypes: {
    id: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysCardArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "card1",
  },
  render: (args) => html`
    <nys-card
      .id=${args.id}
      media="testing"
      mediaAccent="1/1"
      preheading="preheading"
      heading="heading"
      subheading="subheading"
      description="description"
      elevated
    >
      <div slot="footer-slot">this is my footer</div>
      <div slot="top-slot">this is my top</div>
      Slotted Content
    </nys-card>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  id="card1"
></nys-card>`,
        type: "auto",
      },
    },
  },
};
