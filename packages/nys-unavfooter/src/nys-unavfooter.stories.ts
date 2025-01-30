import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-unavfooter";

const meta: Meta = {
  title: "Components/UnavFooter",
  component: "nys-unavfooter",
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  render: () => html`
    <nys-unavfooter>
    </nys-unavfooter>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-unavfooter>
</nys-unavfooter>
        `,
        type: "auto",
      },
    },
  },
};
