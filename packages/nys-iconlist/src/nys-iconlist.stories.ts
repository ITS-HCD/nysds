import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-iconlist";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysIconlistArgs {
  id: string;
  divider: boolean;
}

const meta: Meta<NysIconlistArgs> = {
  title: "Components/Iconlist",
  component: "nys-iconlist",
  argTypes: {
    id: { control: "text" },
    divider: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysIconlistArgs>;

// With a divider between items
export const Basic: Story = {
  args: {
    id: "iconlist1",
    divider: true,
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} ?divider=${args.divider}>
      <li>
        <nys-icon name="calendar_month"></nys-icon>
        <span>July 4, 2026</span>
      </li>
      <li>
        <nys-icon name="schedule"></nys-icon>
        <span>5:00</span>
      </li>
      <li>
        <nys-icon name="location_on"></nys-icon>
        <span>Central Park West</span>
      </li>
    </nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="iconlist1" divider>
  <li>
    <nys-icon name="calendar_month"></nys-icon>
    <span>July 4, 2026</span>
  </li>
  <li>
    <nys-icon name="schedule"></nys-icon>
    <span>5:00</span>
  </li>
  <li>
    <nys-icon name="location_on"></nys-icon>
    <span>Central Park West</span>
  </li>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

// An item can carry a second <span>, rendered on its own line below the first
export const WithSecondaryLabel: Story = {
  args: {
    id: "iconlist2",
    divider: true,
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} ?divider=${args.divider}>
      <li>
        <nys-icon name="calendar_month"></nys-icon>
        <span>July 4, 2026</span>
      </li>
      <li>
        <nys-icon name="schedule"></nys-icon>
        <span>5:00</span>
      </li>
      <li>
        <nys-icon name="location_on"></nys-icon>
        <span>Central Park West</span>
        <span>New York, NY</span>
      </li>
    </nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="iconlist2" divider>
  <li>
    <nys-icon name="calendar_month"></nys-icon>
    <span>July 4, 2026</span>
  </li>
  <li>
    <nys-icon name="schedule"></nys-icon>
    <span>5:00</span>
  </li>
  <li>
    <nys-icon name="location_on"></nys-icon>
    <span>Central Park West</span>
    <span>New York, NY</span>
  </li>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

// The divider is optional and off by default
export const WithoutDivider: Story = {
  args: {
    id: "iconlist3",
    divider: false,
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} ?divider=${args.divider}>
      <li>
        <nys-icon name="check_circle"></nys-icon>
        <span>Recent pay stubs</span>
      </li>
      <li>
        <nys-icon name="check_circle"></nys-icon>
        <span>Current rent/mortgage statement</span>
      </li>
      <li>
        <nys-icon name="check_circle"></nys-icon>
        <span>Current property tax bill</span>
      </li>
      <li>
        <nys-icon name="check_circle"></nys-icon>
        <span>Current homeowner's insurance bill</span>
      </li>
      <li>
        <nys-icon name="check_circle"></nys-icon>
        <span>Social Security card</span>
      </li>
    </nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="iconlist3">
  <li>
    <nys-icon name="check_circle"></nys-icon>
    <span>Recent pay stubs</span>
  </li>
  <li>
    <nys-icon name="check_circle"></nys-icon>
    <span>Current rent/mortgage statement</span>
  </li>
  <li>
    <nys-icon name="check_circle"></nys-icon>
    <span>Current property tax bill</span>
  </li>
  <li>
    <nys-icon name="check_circle"></nys-icon>
    <span>Current homeowner's insurance bill</span>
  </li>
  <li>
    <nys-icon name="check_circle"></nys-icon>
    <span>Social Security card</span>
  </li>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};
