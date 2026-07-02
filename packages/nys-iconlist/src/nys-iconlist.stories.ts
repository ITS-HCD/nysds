import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-iconlist";

// Define the structure of the args used in the stories
interface NysIconlistArgs {
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

const meta: Meta<NysIconlistArgs> = {
  title: "Components/Iconlist",
  component: "nys-iconlist",
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
type Story = StoryObj<NysIconlistArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "iconlist1",
    name: "iconlist1",
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} .name=${args.name}></nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist
  id="iconlist1"
  name="iconlist1"
></nys-iconlist>`,
        type: "auto",
      },
    },
  },
};
