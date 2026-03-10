import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-tab";

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
      control: "radio",
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
  args: {
    orientation: "horizontal",
  },
  render: (args) => html`
    <nys-tabgroup orientation=${args.orientation}>
      <nys-tab label="Tab One"></nys-tab>
      <nys-tabpanel><p>Content for Tab One.</p></nys-tabpanel>

      <nys-tab label="Tab Two"></nys-tab>
      <nys-tabpanel><p>Content for Tab Two.</p></nys-tabpanel>

      <nys-tab label="Tab Three"></nys-tab>
      <nys-tabpanel><p>Content for Tab Three.</p></nys-tabpanel>
    </nys-tabgroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-tabgroup orientation="horizontal">
  <nys-tab label="Tab One"></nys-tab>
  <nys-tab label="Tab Two"></nys-tab>
  <nys-tab label="Tab Three"></nys-tab>
  <nys-tabpanel><p>Content for Tab One.</p></nys-tabpanel>
  <nys-tabpanel><p>Content for Tab Two.</p></nys-tabpanel>
  <nys-tabpanel><p>Content for Tab Three.</p></nys-tabpanel>
</nys-tabgroup>`,
        type: "auto",
      },
    },
  },
};
