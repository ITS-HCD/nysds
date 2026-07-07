import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-iconlist";
import "./nys-iconlistitem";

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
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysIconlistArgs>;

export const Basic: Story = {
  args: {
    id: "iconlist1",
    divider: true,
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} ?divider=${args.divider}>
      <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
      <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
    </nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="iconlist1" divider>
  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
  <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
  <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

export const WithSecondaryLabel: Story = {
  args: {
    id: "iconlist2",
    divider: true,
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} ?divider=${args.divider}>
      <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
      <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      <nys-iconlistitem icon="location_on">
        Central Park West
        <span slot="secondary">New York, NY</span>
      </nys-iconlistitem>
    </nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="iconlist2" divider>
  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
  <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
  <nys-iconlistitem icon="location_on">
    Central Park West
    <span slot="secondary">New York, NY</span>
  </nys-iconlistitem>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

export const WithoutDivider: Story = {
  args: {
    id: "iconlist3",
    divider: false,
  },
  render: (args) => html`
    <nys-iconlist .id=${args.id} ?divider=${args.divider}>
      <nys-iconlistitem icon="check_circle">Recent pay stubs</nys-iconlistitem>
      <nys-iconlistitem icon="check_circle"
        >Current rent/mortgage statement</nys-iconlistitem
      >
      <nys-iconlistitem icon="check_circle"
        >Current property tax bill</nys-iconlistitem
      >
      <nys-iconlistitem icon="check_circle"
        >Current homeowner's insurance bill</nys-iconlistitem
      >
      <nys-iconlistitem icon="check_circle"
        >Social Security card</nys-iconlistitem
      >
    </nys-iconlist>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="iconlist3">
  <nys-iconlistitem icon="check_circle">Recent pay stubs</nys-iconlistitem>
  <nys-iconlistitem icon="check_circle">Current rent/mortgage statement</nys-iconlistitem>
  <nys-iconlistitem icon="check_circle">Current property tax bill</nys-iconlistitem>
  <nys-iconlistitem icon="check_circle">Current homeowner's insurance bill</nys-iconlistitem>
  <nys-iconlistitem icon="check_circle">Social Security card</nys-iconlistitem>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};
