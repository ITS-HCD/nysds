import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-verticalnav";
import "@nysds/nys-icon";
import "@nysds/nys-accordion";
import "@nysds/nys-divider";

// Define the structure of the args used in the stories
interface NysVerticalnavArgs {
  id: string;
  hideHeader: boolean;
  headerLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  navHeader: string;
}

const meta: Meta<NysVerticalnavArgs> = {
  title: "Components/Verticalnav",
  component: "nys-verticalnav",
  argTypes: {
    id: { control: "text" },
    navHeader: { control: "text" },
    hideHeader: { control: "boolean" },
    headerLevel: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
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
type Story = StoryObj<NysVerticalnavArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "verticalnav1",
    navHeader: "Freshwater Fishing",
    hideHeader: false,
    headerLevel: "h2",
  },
  render: (args) => html`
    <nys-verticalnav
      id=${args.id}
      navHeader=${args.navHeader}
      ?hideHeader=${args.hideHeader}
      headerLevel=${args.headerLevel}
    >
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><nys-divider></nys-divider></li>
        <li>
          <h3>Freshwater Fishing Regulations</h3>
          <ul>
            <li><a href="">Places to Fish</a></li>
            <li><a href="">Learn to Fish</a></li>
            <li><a href="">Ice Fishing</a></li>
          </ul>
        </li>
      </ul>
    </nys-verticalnav>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav
  navHeader="Freshwater Fishing"
  headerLevel="h2"
>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/services"><nys-icon></nys-icon> Services</a></li>
    <li><nys-divider></nys-divider></li>
    <li>
      <p>{{Section Header}}</p>
      <ul>
        <li><a href="">{{sublinktext}}</a></li>
        <li><a href="">{{sublinktext}}</a></li>
      </ul>
    </li>
  </ul>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};
