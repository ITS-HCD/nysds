import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  type: string;
  title: string;
  description: string;
  noIcon?: boolean;
  isSlim?: boolean;
  dismissable?: boolean;
}

const meta: Meta<NysAlertArgs> = {
  title: "Components/Alert",
  component: "nys-alert",
  argTypes: {
    type: {
      control: "select",
      options: ["info", "warning", "success", "error", "emergency"],
    },
    title: { control: "text" },
    description: { control: "text" },
    noIcon: { control: "boolean", default: false },
    isSlim: { control: "boolean", default: false },
    dismissable: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysAlertArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: AllAlerts
export const AllAlerts: Story = {
  render: () => html`
    ${["info", "warning", "success", "error", "emergency"].map(
      (type) =>
        html`<nys-alert
            .type=${type}
            .title=${type.charAt(0).toUpperCase() + type.slice(1) + " Status"}
            .description="This is an example of a ${type} alert."
            dismissable
          ></nys-alert>
          <br /> `,
    )}
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert type="info" title="Info status" description="This is an example of an info alert." dismissable></nys-alert>
<nys-alert type="warning" title="Warning status" description="This is an example of a warning alert." dismissable></nys-alert>
<nys-alert type="success" title="Success status" description="This is an example of a success alert." dismissable></nys-alert>
<nys-alert type="error" title="Error status" description="This is an example of an error alert." dismissable></nys-alert>
<nys-alert type="emergency" title="Emergency status" description="This is an example of an emergency alert." dismissable></nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: AlertType
export const AlertType: Story = {
  args: {
    type: "info",
    title: "Information status",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: https://www.w3schools.com for more info.",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  title="Information status" 
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: https://www.w3schools.com for more info.">
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Dismissable Alerts
export const Dismissable: Story = {
  args: {
    type: "info",
    title: "Information status",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: https://www.w3schools.com for more info.",
    dismissable: true,
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissable=${args.dismissable}
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  title="Information status" 
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: https://www.w3schools.com for more info.">
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: NoIcon
export const NoIcon: Story = {
  args: {
    type: "info",
    title: "Information status",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    noIcon: true,
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  title="Information status" 
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod."
  noIcon
  >
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Slim
export const Slim: Story = {
  args: {
    type: "info",
    title: "Information status",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    isSlim: true,
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
    ></nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  title="Information status" 
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod." 
  isSlim>
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};
