import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-globalheader";

// Define the structure of the args used in the stories
interface NysGlobalheaderArgs {
  id: string;
  appName: string;
  agencyName: string;
  homepageLink: string;
  nysLogo: boolean;
}

const meta: Meta<NysGlobalheaderArgs> = {
  title: "Components/Globalheader",
  component: "nys-globalheader",
  argTypes: {
    id: { control: "text" },
    appName: { control: "text" },
    agencyName: { control: "text" },
    homepageLink: { control: "text" },
    nysLogo: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysGlobalheaderArgs>;

export const BasicHeader: Story = {
  args: {
    appName: "My App",
    agencyName: "Department of Health",
    homepageLink: "/",
  },
  render: (args) => {
    return html`
      <nys-globalheader
        .id=${args.id}
        ?nysLogo=${args["nysLogo"]}
        .appName=${args["appName"]}
        .agencyName=${args["agencyName"]}
        .homepageLink=${args["homepageLink"]}
      >
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nys-globalheader>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-globalheader appName="My App" agencyName="Department of Health" homepageLink="/">
  <ul>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nys-globalheader>`,
        type: "auto",
      },
    },
  },
};
