import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-dropdownmenu";
import "@nysds/nys-button";
import "./nys-dropdownmenuitem";

const meta: Meta = {
  title: "Components/Dropdownmenu",
  component: "nys-dropdownmenu",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => {
    return html`
      <div
        style="margin: 200px; display: flex; justify-content: center; align-items: center"
      >
        <nys-button id="my-trigger-id" label="Open Menu"></nys-button>
        <nys-dropdownmenu id="my-dropdownmenu" for="my-trigger-id">
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
