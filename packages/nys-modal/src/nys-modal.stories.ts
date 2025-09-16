import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-modal";

// Define the structure of the args used in the stories
interface NysModalArgs {
  id: string;
  name: string;
  size: string;
  fullWidth: boolean;
  variant: string;
  inverted: boolean;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
  form: string | null;
  value: string;
  type: string;
  href: string;
  onClick: () => void;
}

const meta: Meta<NysModalArgs> = {
  title: "Components/Modal",
  component: "nys-modal",
  argTypes: {
    id: { control: "text" },
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
type Story = StoryObj<NysModalArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "modal1",
    name: "modal1",
  },
  render: (args) => html`
    <nys-modal .id=${args.id} .name=${args.name}></nys-modal>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal
  id="modal1"
  name="modal1"
></nys-modal>`,
        type: "auto",
      },
    },
  },
};
