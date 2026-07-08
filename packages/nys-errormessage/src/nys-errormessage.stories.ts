import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-errormessage";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysErrorMessageArgs {
  showError: boolean;
  errorMessage: string;
  showDivider: boolean;
}

const meta: Meta<NysErrorMessageArgs> = {
  title: "Components/ErrorMessage",
  component: "nys-errormessage",
  argTypes: {
    showError: { control: "boolean", type: "boolean" },
    errorMessage: { control: "text", type: "string" },
    showDivider: { control: "boolean", type: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysErrorMessageArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    showError: true,
    errorMessage: "This is an error message",
    showDivider: false,
  },
  render: (args) =>
    html`<nys-errormessage
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .showDivider=${args.showDivider}
    ></nys-errormessage>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-errormessage showError errorMessage="This is an error message"></nys-errormessage>
    `,
        type: "auto",
      },
    },
  },
};

export const Divider: Story = {
  args: {
    showError: true,
    errorMessage: "This is an error message",
    showDivider: true,
  },
  render: (args) =>
    html`<nys-errormessage
      .showError=${args.showError}
      .errorMessage=${args.errorMessage}
      .showDivider=${args.showDivider}
    ></nys-errormessage>`,
  parameters: {
    docs: {
      source: {
        code: `
<nys-errormessage showError errorMessage="This is an error message" showDivider></nys-errormessage>
`,
        type: "auto",
      },
    },
  },
};
