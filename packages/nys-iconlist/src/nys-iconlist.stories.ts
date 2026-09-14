import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-iconlist";
import "./nys-iconlistitem";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Iconlist",
  component: "nys-iconlist",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'An icon list is a component that displays a collection of items paired with visual icons, making it easy to create structured, scannable lists across web projects. Commonly used in the card component.\n\nAdd `<nys-iconlistitem>` elements as children. Each item accepts an `icon` attribute and uses its\ndefault slot for the primary label. A second line can be added with `<span slot="secondary">`.\nSet `divider` to draw a rule between items; no divider is drawn after the last item.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysIconlist id="event-details">\n  <NysIconlistitem icon="calendar_month">July 4, 2026</NysIconlistitem>\n  <NysIconlistitem icon="schedule">5:00</NysIconlistitem>\n  <NysIconlistitem icon="location_on">Central Park West</NysIconlistitem>\n</NysIconlist>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-iconlist id="event-details">\n  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>\n  <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>\n  <nys-iconlistitem icon="location_on">Central Park West</nys-iconlistitem>\n</nys-iconlist>\n```',
      },
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
      <nys-iconlist id="event-details" ?divider=${args.divider}>
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

export const AccessibleName: Story = {
  render: () => {
    return html`
      <nys-iconlist id="event-details-labelled" aria-label="Event details">
        <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
        <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
      </nys-iconlist>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-iconlist id="event-details-labelled" aria-label="Event details">
  <nys-iconlistitem icon="calendar_month">July 4, 2026</nys-iconlistitem>
  <nys-iconlistitem icon="schedule">5:00</nys-iconlistitem>
</nys-iconlist>`,
        type: "auto",
      },
    },
  },
};

export const Divider: Story = {
  render: () => {
    return html`
      <nys-iconlist id="event-details2" divider>
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
<nys-iconlist id="event-details2" divider>
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
      <nys-iconlist id="event-details3">
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
<nys-iconlist id="event-details3">
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
