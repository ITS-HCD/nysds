import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-verticalnav";
import "@nysds/nys-icon";
import "@nysds/nys-accordion";

// Define the structure of the args used in the stories
interface NysVerticalnavArgs {
  id: string;
  name: string;
  size: string;
  fullWidth: boolean;
  variant: string;
  inverted: boolean;
  label: string;
  prefixIcon: string;
  suffixIcon: string;
  disabled: boolean;
  form: string | null;
  value: string;
  type: string;
  href: string;
  onClick: () => void;
}

const meta: Meta<NysVerticalnavArgs> = {
  title: "Components/Verticalnav",
  component: "nys-verticalnav",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysVerticalnavArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "verticalnav1",
    name: "verticalnav1",
  },
  render: (args) => html`
    <nys-verticalnav>
      <div slot="verticalnav__header">Freshwater Fishing</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><nys-divider></nys-divider></li>
        <li>
          <p>Freshwater Fishing Regulations</p>
          <ul>
            <li><a href="">Places to Fish</a></li>
            <li><a href="">Learn to Fish</a></li>
            <li><a href="">Ice Fishing</a></li>
          </ul>
        </li>
      </ul>
      <div slot="verticalnav__footer">...Footer Content...</div>
    </nys-verticalnav>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-verticalnav>
   <div slot="verticalnav__header">
       ...Header Content...
   </div>
   <ul>
       <li><a href="/">Home</a></li>
       <li><a href="/services"><nys-icon></nys-icon> Services</a></li>
       <li><nys-divider></nys-divider></li>
       <li><p>{{Section Header}}</p>
         <ul>
           <li><a href="">{{sublinktext}}</a></li>
           <li><a href="">{{sublinktext}}</a></li>
         </ul>
       </li>
   </ul>
   <div slot="verticalnav__footer">
     ...Footer Content...
   </div>
</nys-verticalnav>`,
        type: "auto",
      },
    },
  },
};
