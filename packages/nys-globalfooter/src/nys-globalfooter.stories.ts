import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalfooter";

// Define the structure of the args used in the stories
interface NysGlobalfooterArgs {
  id: string;
  agencyName: string;
  homepageLink: string;
}

const meta: Meta<NysGlobalfooterArgs> = {
  title: "Components/Globalfooter",
  component: "nys-globalfooter",
  argTypes: {
    id: { control: "text" },
    agencyName: { control: "text" },
    homepageLink: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysGlobalfooterArgs>;

export const Basic: Story = {
  args: {
    agencyName: "Department of Health",
    homepageLink: "/",
  },
  render: (args) => {
    return html`
      <nys-globalfooter
        .id=${args.id}
        .agencyName=${args.agencyName}
        .homepageLink=${args.homepageLink}
      >
        <span>123 Main St, Albany NY</span>
        <span>info@health.ny.gov</span>
      </nys-globalfooter>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalfooter agencyName="Department of Health" homepageLink="/">
  <span>123 Main St, Albany NY</span>
  <span>info@health.ny.gov</span>
</nys-globalfooter>`,
        type: "auto",
      },
    },
  },
};
