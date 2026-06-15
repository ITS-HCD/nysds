import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-dropdownmenu";
import "./nys-dropdownmenuitem";

// Define the structure of the args used in the stories
interface NysDropdownmenuArgs {
  id: string;
  for: string;
  position: Position | null;
  label: string;
  link: string;
  showDropdown: boolean;
  disabled: boolean;
}

const meta: Meta<NysDropdownmenuArgs> = {
  title: "Components/Dropdownmenu",
  component: "nys-dropdownmenu",
  argTypes: {
    id: { control: "text" },
    for: { control: "text" },
    position: { control: "text" },
    label: { control: "text" },
    link: { control: "text" },
    showDropdown: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysDropdownmenuArgs>;

export const BasicItem: Story = {
  args: {
    label: "Edit",
    link: "/edit",
  },
  render: (args) => {
    return html`
      <nys-dropdownmenuitem
        .id=${args.id}
        ?showDropdown=${args.showDropdown}
        ?disabled=${args.disabled}
        .for=${args.for}
        .position=${args.position}
        .label=${args.label}
        .link=${args.link}
      ></nys-dropdownmenuitem>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-dropdownmenuitem label="Edit" link="/edit"></nys-dropdownmenuitem>`,
        type: "auto",
      },
    },
  },
};

export const DisabledItem: Story = {
  render: () => {
    return html`
      <nys-dropdownmenuitem
        label="Delete"
        link="/delete"
        disabled
      ></nys-dropdownmenuitem>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-dropdownmenuitem label="Delete" link="/delete" disabled></nys-dropdownmenuitem>`,
        type: "auto",
      },
    },
  },
};
