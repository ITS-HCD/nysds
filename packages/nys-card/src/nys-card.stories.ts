import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-card";

// Define the structure of the args used in the stories
interface NysCardArgs {
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

const meta: Meta<NysCardArgs> = {
  title: "Components/Card",
  component: "nys-card",
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
type Story = StoryObj<NysCardArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "card1",
    name: "card1",
  },
  render: (args) => html`
    <nys-card .id=${args.id} .name=${args.name}>
      <div slot="footer-slot">this is my footer</div>
      <div slot="header-slot">this is my header</div>
      Test</nys-card
    >
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  id="card1"
  name="card1"
></nys-card>`,
        type: "auto",
      },
    },
  },
};
