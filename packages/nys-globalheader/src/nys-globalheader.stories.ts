import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-globalheader";

// Define the structure of the args used in the stories
interface NysGlobalHeaderArgs {
  appName: string;
  agencyName: string;
}

const meta: Meta<NysGlobalHeaderArgs> = {
  title: "Components/GlobalHeader",
  component: "nys-globalheader",
  argTypes: {
    appName: { control: "text" },
    agencyName: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysGlobalHeaderArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  args: {
    appName: "User Registration Form",
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalheader .agencyName=${args.agencyName} .appName=${args.appName}>
    </nys-globalheader>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="User Registration Form" agencyName="Office of Information Technology Services">
</nys-globalheader>
        `,
        type: "auto",
      },
    },
  },
};

// Story: Without Application Name
export const WithoutAppName: Story = {
  args: {
    agencyName: "Office of Information Technology Services",
  },
  render: (args) => html`
    <nys-globalheader .agencyName=${args.agencyName} .appName=${args.appName}>
    </nys-globalheader>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Office of Information Technology Services">
</nys-globalheader>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Without Application Name
export const WithAppName: Story = {
  args: {
    appName: "Unemployment Insurance Benefits",
    agencyName: "Department of Labor",
  },
  render: (args) => html`
    <nys-globalheader .agencyName=${args.agencyName} .appName=${args.appName}>
    </nys-globalheader>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader agencyName="Department of Labor" appName="Unemployment Insurance Benefits">
</nys-globalheader>
`.trim(),
        type: "auto",
      },
    },
  },
};
