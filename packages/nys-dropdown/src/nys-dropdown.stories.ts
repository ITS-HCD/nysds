import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-dropdown";
import "@nysds/nys-label";

// Define the structure of the args used in the stories
interface NysDropdownArgs {
  id: string;
  name: string;
  label: string;
  dropdownVisible: boolean;
}

const meta: Meta<NysDropdownArgs> = {
  title: "Components/Dropdown",
  component: "nys-dropdown",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    dropdownVisible: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDropdownArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "nys-dropdown-1",
    name: "nys-dropdown",
    label: "Menu",
    dropdownVisible: false,
  },
  render: (args) => html`
    <nys-dropdown
      id=${args.id}
      name=${args.name}
      label=${args.label}
      .items=${[
        ["Example", "https://www.example.com"],
        ["Menu", "https://www.google.com"],
      ]}
    ></nys-dropdown>
    <div
      style="
      background: red; 
      height: 20vh; 
      align-items:center; 
      justify-content:center; 
      display:flex;"
    >
      other content
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
