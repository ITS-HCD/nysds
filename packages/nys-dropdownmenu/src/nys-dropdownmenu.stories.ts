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
  position: "bottom-start" | "bottom-end" | "top-start" | "top-end";
}

const meta: Meta<NysDropdownMenuArgs> = {
  title: "Components/Dropdownmenu",
  component: "nys-dropdownmenu",
  argTypes: {
    id: { control: "text" },
    for: { control: "text" },
    showDropdown: { control: "boolean" },
    position: {
      control: { type: "select" },
      options: ["bottom-start", "bottom-end", "top-start", "top-end"],
    },
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
    for: "my-trigger-id",
    showDropdown: false,
  },
  render: (args) =>
    html`<div
      style="
          margin: 250px;
          display: flex;
          justify-content: center;
          align-items: center;"
    >
      <nys-button id="my-trigger-id" label="trigger">Open Menu</nys-button>
      <nys-dropdownmenu
        .id=${args.id}
        .for=${args.for}
        .position=${args.position}
      >
        <nys-dropdownmenuitem
          label="Profile"
          href="/profile"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Repositories & Github Pages"
          href="/repos"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Organizations"
          href="/organizations"
        ></nys-dropdownmenuitem>
        <nys-dropdownmenuitem
          label="Sign out"
          href="/logout"
        ></nys-dropdownmenuitem>
      </nys-dropdownmenu>
    </div> `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-button id="my-trigger-id" label="trigger">Open Menu</nys-button>

<nys-dropdownmenu id="my-dropdownmenu" for="my-trigger-id">
  <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Organizations" href="/organizations"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
</nys-dropdownmenu>`,
        type: "auto",
      },
    },
  },
};

export const dropdownNavLink: Story = {
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

    <nys-dropdownmenu
      .id=${args.id}
      .for=${args.for}
      .position=${args.position}
    >
      <nys-dropdownmenuitem
        label="Profile"
        href="/profile"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Repositories & Github Pages"
        href="/repos"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Organizations"
        href="/organizations"
        disabled
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Sign out"
        href="/logout"
      ></nys-dropdownmenuitem>
    </nys-dropdownmenu>
  `,
  parameters: {
    docs: {
      source: {
        code: `
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

<nys-dropdownmenu
  id="dropdownmenu1"
  for="trigger-id1"
  position="bottom-end"
>
  <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Organizations" href="/organizations" disabled></nys-dropdownmenuitem>
  <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
</nys-dropdownmenu>`,
      },
    },
  },
};

export const dropdownNavActions: Story = {
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

    <nys-dropdownmenu
      .id=${args.id}
      .for=${args.for}
      .position=${args.position}
    >
      <nys-dropdownmenuitem label="Action 1"></nys-dropdownmenuitem>
      <nys-dropdownmenuitem label="Action 2"></nys-dropdownmenuitem>
      <nys-dropdownmenuitem label="Action 3" disabled></nys-dropdownmenuitem>
      <nys-dropdownmenuitem label="Action 4"></nys-dropdownmenuitem>
    </nys-dropdownmenu>
  `,
  parameters: {
    docs: {
      source: {
        code: `
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

<nys-dropdownmenu
  id="dropdownmenu1"
  for="trigger-id1"
  position="bottom-end"
>
    <nys-dropdownmenuitem label="Action 1"></nys-dropdownmenuitem>
    <nys-dropdownmenuitem label="Action 2"></nys-dropdownmenuitem>
    <nys-dropdownmenuitem label="Action 3" disabled></nys-dropdownmenuitem>
    <nys-dropdownmenuitem label="Action 4"></nys-dropdownmenuitem>
</nys-dropdownmenu>`,
      },
    },
  },
};

export const dropdownWithIcons: Story = {
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

    <nys-dropdownmenu
      .id=${args.id}
      .for=${args.for}
      .position=${args.position}
    >
      <nys-dropdownmenuitem
        label="Action 1"
        prefixIcon="lock_filled"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Action 2 Action 2Action 2Action 2Action 2Action 2Action 2Action 2Action 2"
        prefixIcon="social_youtube"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Action 3"
        disabled
        prefixIcon="visibility"
      ></nys-dropdownmenuitem>
      <nys-dropdownmenuitem
        label="Action 4"
        prefixIcon="sms"
      ></nys-dropdownmenuitem>
    </nys-dropdownmenu>
  `,
  parameters: {
    docs: {
      source: {
        code: `
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

<nys-dropdownmenu
  id="dropdownmenu1"
  for="trigger-id1"
  position="bottom-end"
>
    <nys-dropdownmenuitem label="Action 1" prefixIcon="lock_filled"></nys-dropdownmenuitem>
    <nys-dropdownmenuitem label="Action 2" prefixIcon="social_youtube" ></nys-dropdownmenuitem>
    <nys-dropdownmenuitem label="Action 3" prefixIcon="visibility" disabled></nys-dropdownmenuitem>
    <nys-dropdownmenuitem label="Action 4" prefixIcon="sms" ></nys-dropdownmenuitem>
</nys-dropdownmenu>`,
      },
    },
  },
};
