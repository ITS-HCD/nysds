import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  id: string;
  heading: string;
  icon: string;
  duration: number;
  text: string;
  primaryAction: string;
  secondaryAction: string;
  primaryLabel: string;
  secondaryLabel: string;
  type: "base" | "info" | "success" | "warning" | "danger" | "emergency";
  dismissible: boolean;
}

const meta: Meta<NysAlertArgs> = {
  title: "Components/Alert",
  component: "nys-alert",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    icon: { control: "text" },
    duration: { control: "number" },
    text: { control: "text" },
    primaryAction: { control: "text" },
    secondaryAction: { control: "text" },
    primaryLabel: { control: "text" },
    secondaryLabel: { control: "text" },
    type: {
      control: "select",
      options: ["base", "info", "success", "warning", "danger", "emergency"],
    },
    dismissible: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysAlertArgs>;

export const Basic: Story = {
  args: {
    heading: "This is a heading",
  },
  render: (args) => html`
    <nys-alert
      .id=${args.id}
      ?dismissible=${args.dismissible}
      .heading=${args.heading}
      .icon=${args.icon}
      .duration=${args.duration}
      .text=${args.text}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
      .type=${args.type}
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert heading="This is a heading"></nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const Text: Story = {
  render: () => html`
    <nys-alert
      heading="This is a heading"
      text="This is additional information passed in through the text property"
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert
  heading="This is a heading"
  text="This is additional information passed in through the text property"
></nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const RichText: Story = {
  render: () => html`
    <nys-alert heading="Rich Text">
      <p>
        This is a custom alert with
        <strong>HTML content</strong>
        passed in through the slot.
      </p>
      <a href="https://www.ny.gov/" target="_blank"
        >Learn more about our accessibility services</a
      >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert heading="Rich Text">
  <p>
    This is a custom alert with
    <strong>HTML content</strong>
    passed in through the slot.
  </p>
  <a href="https://www.ny.gov/" target="_blank">Learn more about our accessibility services</a>
</nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const Type: Story = {
  render: () => html`
    <div class="nys-display-flex nys-flex-column nys-flex-gap-100">
      <nys-alert type="info" heading="Info alert type"></nys-alert>
      <nys-alert type="success" heading="Success alert type"></nys-alert>
      <nys-alert type="warning" heading="Warning alert type"></nys-alert>
      <nys-alert type="danger" heading="Danger alert type"></nys-alert>
      <nys-alert type="emergency" heading="Emergency alert type"></nys-alert>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert type="info" heading="Info alert type"></nys-alert>
<nys-alert type="success" heading="Success alert type"></nys-alert>
<nys-alert type="warning" heading="Warning alert type"></nys-alert>
<nys-alert type="danger" heading="Danger alert type"></nys-alert>
<nys-alert type="emergency" heading="Emergency alert type"></nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const Dismissible: Story = {
  render: () => html`
    <nys-alert
      heading="This alert is dismisable"
      text="Close it by clicking on the X in the corner."
      dismissible
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert
  heading="This alert is dismisable"
  text="Close it by clicking on the X in the corner."
  dismissible
></nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const Duration: Story = {
  render: () => html`
    <nys-button
      class="nys-margin-b-100"
      label="Show alert"
      onclick="
        document.body.appendChild(
          Object.assign(document.createElement('nys-alert'), {
            heading: 'Disappearing alert',
            text: 'This alert will disappear after 3 seconds.',
            duration: 3000,
          }),
        )
      "
    ></nys-button>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert
  heading="Disappearing alert"
  text="This alert will disappear after 3 seconds."
  duration="3000"
></nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const CustomIcon: Story = {
  render: () => html`
    <nys-alert
      type="emergency"
      heading="Winter storm warning: Dec 10th, 2024."
      text="A major snowfall is expected across the state of New York for the weekend of Dec 7th. Stay home if possible and use extreme caution when driving."
      icon="help"
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert
  type="emergency"
  heading="Winter storm warning: Dec 10th, 2024."
  text="A major snowfall is expected across the state of New York for the weekend of Dec 7th. Stay home if possible and use extreme caution when driving."
  icon="help"
></nys-alert>`,
        type: "auto",
      },
    },
  },
};

export const ActionLinks: Story = {
  render: () => html`
    <nys-alert
      heading="Alert with links"
      primaryLabel="{primaryAction}"
      secondaryLabel="{secondaryAction}"
      primaryAction="https://www.ny.gov/"
      secondaryAction="https://www.ny.gov/"
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert
  heading="Alert with links"
  primaryLabel="{primaryAction}"
  secondaryLabel="{secondaryAction}"
  primaryAction="https://www.ny.gov/"
  secondaryAction="https://www.ny.gov/"
></nys-alert>`,
        type: "auto",
      },
    },
  },
};
