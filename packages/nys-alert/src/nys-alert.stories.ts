import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  type: string;
  title: string;
  description: string;
  duration?: number;
  icon?: string;
  noIcon?: boolean;
  isSlim?: boolean;
  dismissible?: boolean;
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
    duration: { control: "number" },
    icon: { control: "text" },
    noIcon: { control: "boolean", default: false },
    isSlim: { control: "boolean", default: false },
    dismissible: { control: "boolean", default: false },
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
            dismissible
          ></nys-alert>
          <br /> `,
    )}
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert type="info" title="Info status" description="This is an example of an info alert." dismissible></nys-alert>
<nys-alert type="warning" title="Warning status" description="This is an example of a warning alert." dismissible></nys-alert>
<nys-alert type="success" title="Success status" description="This is an example of a success alert." dismissible></nys-alert>
<nys-alert type="error" title="Error status" description="This is an example of an error alert." dismissible></nys-alert>
<nys-alert type="emergency" title="Emergency status" description="This is an example of an emergency alert." dismissible></nys-alert>
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
      .duration=${args.duration}
      .icon=${args.icon}
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

// Story: Dismissible Alerts
export const Dismissible: Story = {
  args: {
    type: "info",
    title: "Information status",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: https://www.w3schools.com for more info.",
    dismissible: true,
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
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

// Story: Duration Alerts
export const Duration: Story = {
  args: {
    type: "info",
    title: "Information status",
    description: "This alert will disappear after 3 seconds.",
    duration: 3000,
  },
  render: (args) => {
    const showAlert = () => {
      const container = document.querySelector(".alert-container");
      if (container) {
        // Clear previous instance if present
        container.innerHTML = "";
        const newAlert = document.createElement("nys-alert");
        newAlert.setAttribute("type", args.type);
        newAlert.setAttribute("title", args.title);
        newAlert.setAttribute("description", args.description);
        newAlert.setAttribute("duration", String(args.duration));
        if (args.dismissible) newAlert.setAttribute("dismissible", "");
        if (args.noIcon) newAlert.setAttribute("noIcon", "");
        if (args.isSlim) newAlert.setAttribute("isSlim", "");
        container.appendChild(newAlert);
      }
    };

    return html`
      <div class="alert-duration">
        <button
          id="show-alert"
          type="button"
          @click=${showAlert}
          style="
          background-color: #1ca1ba; 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          margin-bottom: 10px;
          font-size: 16px; 
          border-radius: 5px; 
          cursor: pointer;
          "
        >
          Show Alert
        </button>
        <div class="alert-container"></div>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  title="Information status" 
  description="This alert will disappear after 3 seconds.">
  duration="3000"
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: CustomIcon
export const CustomIcon: Story = {
  args: {
    type: "warning",
    title: "Help status",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?",
    icon: "help",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .title=${args.title}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
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
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: https://www.w3schools.com for more info."
  icon="help">
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
      .duration=${args.duration}
      .icon=${args.icon}
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
      .duration=${args.duration}
      .icon=${args.icon}
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
