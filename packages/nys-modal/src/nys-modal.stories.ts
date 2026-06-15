import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-modal";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysModalArgs {
  id: string;
  heading: string;
  subheading: string;
  width: "sm" | "md" | "lg";
  open: boolean;
  mandatory: boolean;
}

const meta: Meta<NysModalArgs> = {
  title: "Components/Modal",
  component: "nys-modal",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    subheading: { control: "text" },
    width: { control: "select", options: ["sm", "md", "lg"] },
    open: { control: "boolean", default: false },
    mandatory: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysModalArgs>;

export const Basic: Story = {
  args: {
    open: true,
    heading: "Confirm action",
  },
  render: (args) => {
    return html`
      <nys-modal
        .id=${args.id}
        ?open=${args.open}
        ?mandatory=${args.mandatory}
        .heading=${args.heading}
        .subheading=${args.subheading}
        .width=${args.width}
      >
        <p>Are you sure you want to proceed?</p>
        <div slot="actions">
          <nys-button label="Cancel" variant="outline"></nys-button>
          <nys-button label="Confirm" variant="filled"></nys-button>
        </div>
      </nys-modal>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal id="confirm-modal" heading="Confirm action" open>
  <p>Are you sure you want to proceed?</p>
  <div slot="actions">
    <nys-button label="Cancel" variant="outline"></nys-button>
    <nys-button label="Confirm" variant="filled"></nys-button>
  </div>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};
