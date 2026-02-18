import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-dropdownmenu";
import "@nysds/nys-button";
import "@nysds/nys-avatar";
import "@nysds/nys-globalheader";

// Define the structure of the args used in the stories
interface NysDropdownMenuArgs {
  id: string;
  for: string;
  showDropdown: boolean;
}

const meta: Meta<NysDropdownMenuArgs> = {
  title: "Components/Dropdownmenu",
  component: "nys-dropdownmenu",
  argTypes: {
    id: { control: "text" },
    for: { control: "text" },
    showDropdown: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDropdownMenuArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "my-dropdownmenu",
    for: "my-tigger-id",
    showDropdown: false,
  },
  render: (args) => html`
    <nys-dropdownmenu .id=${args.id} .for=${args.for}
      ><nys-dropdownmenuitem label="Profile"></nys-dropdownmenuitem
      ><nys-dropdownmenuitem
        label="Repositories & Github Pages"
      ></nys-dropdownmenuitem
      ><nys-dropdownmenuitem label="Organizations"></nys-dropdownmenuitem
      ><nys-dropdownmenuitem label="Sign out"></nys-dropdownmenuitem
    ></nys-dropdownmenu>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-dropdownmenu
  id="my-dropdownmenu"
  for="my-trigger-id"
></nys-dropdownmenu>`,
        type: "auto",
      },
    },
  },
};

export const dropdownOnUserAction: Story = {
  args: {
    ...Basic.args,
    id: "dropdownmenu1",
    for: "trigger-id1",
  },
  render: (args) => html`
    <nys-globalheader
      appName="User Registration Form"
      agencyName="Office of Information Technology Services"
    >
      <nys-button
        id="trigger-id1"
        slot="user-actions"
        label="Log out"
        prefixIcon="slotted"
      >
        <nys-avatar
          slot="prefix-icon"
          ariaLabel="User avatar"
          initials="NY"
        ></nys-avatar>
      </nys-button>
    </nys-globalheader>

    <nys-dropdownmenu .id=${args.id} .for=${args.for}
      ><nys-dropdownmenuitem label="Profile"></nys-dropdownmenuitem
      ><nys-dropdownmenuitem
        label="Repositories & Github Pages"
      ></nys-dropdownmenuitem
      ><nys-dropdownmenuitem label="Organizations"></nys-dropdownmenuitem
      ><nys-dropdownmenuitem label="Sign out"></nys-dropdownmenuitem
    ></nys-dropdownmenu>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-dropdownmenu
  id="dropdownmenu1"
  for="trigger-id1"
></nys-dropdownmenu>`,
      },
    },
  },
};
