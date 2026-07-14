import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-iconlist";
import "./nys-iconlistitem";

const meta: Meta = {
  title: "Components/Iconlist",
  component: "nys-iconlist",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    divider: false,
    icon: "calendar_month",
  },
  render: (args) => {
    return html`
      <nys-iconlist ?divider=${args.divider}>
        <nys-iconlistitem icon=${args.icon}>July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
        <nys-iconlistitem icon="location_on"
          >Central Park West</nys-iconlistitem
        >
      </nys-iconlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="event-details">
  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
  <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
  <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

export const Divider: Story = {
  render: () => {
    return html`
      <nys-iconlist id="event-details" divider>
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
        <nys-iconlistitem icon="location_on"
          >Central Park West</nys-iconlistitem
        >
      </nys-iconlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="event-details" divider>
  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
  <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
  <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

export const SecondaryLabel: Story = {
  render: () => {
    return html`
      <nys-iconlist id="event-details">
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">
          5:00 PM
          <span slot="secondary">Eastern Standard Time</span>
        </nys-iconlistitem>
        <nys-iconlistitem icon="location_on">
          Central Park West
          <span slot="secondary">New York, NY</span>
        </nys-iconlistitem>
      </nys-iconlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="event-details">
  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
  <nys-iconlistitem icon="schedule">
    5:00 PM
    <span slot="secondary">Eastern Standard Time</span>
  </nys-iconlistitem>
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

export const Checklist: Story = {
  render: () => {
    return html`
      <nys-iconlist id="requirements">
        <nys-iconlistitem icon="check_circle"
          >Recent pay stubs</nys-iconlistitem
        >
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
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="requirements">
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
