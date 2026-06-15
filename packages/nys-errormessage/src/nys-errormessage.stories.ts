import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-errormessage";

// Define the structure of the args used in the stories
interface NysErrormessageArgs {
  id: string;
  errorMessage: string;
  showError: boolean;
  showDivider: boolean;
}

const meta: Meta<NysErrormessageArgs> = {
  title: "Components/Errormessage",
  component: "nys-errormessage",
  argTypes: {
    id: { control: "text" },
    errorMessage: { control: "text" },
    showError: { control: "boolean", default: false },
    showDivider: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysErrormessageArgs>;

export const Basic: Story = {
  args: {
    showError: true,
    errorMessage: "This is an error message",
  },
  render: (args) => {
    return html`
      <nys-errormessage
        .id=${args.id}
        ?showError=${args.showError}
        ?showDivider=${args.showDivider}
        .errorMessage=${args.errorMessage}
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
