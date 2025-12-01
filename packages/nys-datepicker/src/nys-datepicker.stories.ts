import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-datepicker";

// Define the structure of the args used in the stories
interface NysDatepickerArgs {
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

const meta: Meta<NysDatepickerArgs> = {
  title: "Components/Datepicker",
  component: "nys-datepicker",
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
type Story = StoryObj<NysDatepickerArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "datepicker1",
    name: "datepicker1",
  },
  render: (args) => html`
    <style>
      .datepicker-container {
        padding: 5rem 0;
      }
    </style>

    <div class="datepicker-container">
      <nys-datepicker .id=${args.id} .name=${args.name}></nys-datepicker>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-datepicker
  id="datepicker1"
  name="datepicker1"
></nys-datepicker>`,
        type: "auto",
      },
    },
  },
};
