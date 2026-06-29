import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-errormessage";

const meta: Meta = {
  title: "Components/Errormessage",
  component: "nys-errormessage",
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
      <nys-errormessage
        showError
        errorMessage="This is an error message"
      ></nys-errormessage>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-errormessage showError errorMessage="This is an error message"></nys-errormessage>`,
        type: "auto",
      },
    },
  },
};

export const Divider: Story = {
  render: () => {
    return html`
      <nys-errormessage
        showError
        errorMessage="This is an error message"
        showDivider
      ></nys-errormessage>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-errormessage showError errorMessage="This is an error message" showDivider></nys-errormessage>`,
        type: "auto",
      },
    },
  },
};
