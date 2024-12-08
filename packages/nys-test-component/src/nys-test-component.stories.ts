import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-test-component";

// Define the structure of the args used in the stories
interface NysTestComponentArgs {
  name: string;
}

const meta: Meta<NysTestComponentArgs> = {
  title: "Components/TestComponent",
  component: "nys-test-component",
  argTypes: {
    name: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysTestComponentArgs>;

// Define stories without using args

// Story: Default
export const Default: Story = {
  args: {},
  render: (args) => html`<nys-test-component></nys-test-component>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-test-component></nys-test-component>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Custom Name
export const CustomName: Story = {
  args: {
    name: "Robert Moses",
  },
  render: (args) => html`<nys-test-component .name=${args.name}></nys-test-component>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-test-component name="Robert Moses"></nys-test-component>
        `.trim(),
      },
    },
  },
};
