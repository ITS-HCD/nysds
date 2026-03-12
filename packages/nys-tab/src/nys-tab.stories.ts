import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";
import "./nys-tabgroup";
import "./nys-tabpanel";

interface NysTabArgs {
  label: string;
  selected: boolean;
  disabled: boolean;
  orientation: "horizontal" | "vertical";
}

const meta: Meta<NysTabArgs> = {
  title: "Components/Tab",
  component: "nys-tab",
  argTypes: {
    label: { control: "text" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysTabArgs>;

export const Basic: Story = {
  args: {},
  render: () => html`
    <nys-tabgroup id="test">
      <nys-tab label="Tab One Long Name"></nys-tab>
      <nys-tabpanel>Content for Tab One.</nys-tabpanel>
      <nys-tab selected label="Tab Two Longer Name"></nys-tab>
      <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
      <nys-tab selected label="Tab Three Extra Long Name"></nys-tab>
      <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
    </nys-tabgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup>
  <nys-tab label="Tab One"></nys-tab>
  <nys-tabpanel>Content for Tab One.</nys-tabpanel>
  <nys-tab label="Tab Two"></nys-tab>
  <nys-tabpanel>Content for Tab Two.</nys-tabpanel>
  <nys-tab label="Tab Three"></nys-tab>
  <nys-tabpanel>Content for Tab Three.</nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};
