import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-dropdownmenu";
import "./nys-dropdownmenuitem";
import "@nysds/nys-button";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Dropdownmenu",
  component: "nys-dropdownmenu",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'Dropdown menus enable users to select an action from a list of options.\nThey’re commonly used to save space by grouping related actions, or to provide actions in a confined space.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysButton id="my-trigger-id" label="Open Menu" />\n<NysDropdownMenu id="my-dropdownmenu" for="my-trigger-id">\n  <NysDropdownMenuItem label="Profile" href="/profile" />\n  <NysDropdownMenuItem label="Repositories & Github Pages" href="/repos" />\n  <NysDropdownMenuItem label="Organizations" href="/organizations" />\n  <NysDropdownMenuItem label="Sign out" href="/logout" />\n</NysDropdownMenu>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-button id="my-trigger-id" label="Open Menu"></nys-button>\n<nys-dropdownmenu id="my-dropdownmenu" for="my-trigger-id">\n  <nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>\n  <nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>\n  <nys-dropdownmenuitem label="Organizations" href="/organizations"></nys-dropdownmenuitem>\n  <nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>\n</nys-dropdownmenu>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    for: "my-trigger-id",
    showDropdown: false,
    label: "",
    href: "/profile",
    disabled: false,
    target: "_self",
    prefixIcon: "",
    divider: "",
  },
  render: (args) => {
    return html`
      <div
        style="margin: 200px; display: flex; justify-content: center; align-items: center"
      >
        <nys-button id="my-trigger-id" label="Open Menu"></nys-button>
        <nys-dropdownmenu
          id="my-dropdownmenu"
          for=${args.for}
          ?showDropdown=${args.showDropdown}
          label=${args.label}
        >
          <nys-dropdownmenuitem
            label="Profile"
            href=${args.href}
            ?disabled=${args.disabled}
            target=${args.target}
            prefixIcon=${args.prefixIcon}
            divider=${args.divider}
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
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-button id="my-trigger-id" label="Open Menu"></nys-button>
<nys-dropdownmenu id="my-dropdownmenu" for="my-trigger-id">
<nys-dropdownmenuitem label="Profile" href="/profile"></nys-dropdownmenuitem>
<nys-dropdownmenuitem label="Repositories & Github Pages" href="/repos"></nys-dropdownmenuitem>
<nys-dropdownmenuitem label="Organizations" href="/organizations"></nys-dropdownmenuitem>
<nys-dropdownmenuitem label="Sign out" href="/logout"></nys-dropdownmenuitem>
</nys-dropdownmenu>
</div>`,
        type: "auto",
      },
    },
  },
};
