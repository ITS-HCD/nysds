import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  theme: string;
  label: string;
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
    theme: {
      control: "select",
      options: ["info", "warning", "success", "error", "emergency"],
    },
    label: { control: "text" },
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
      (theme) =>
        html`<nys-alert
            .theme=${theme}
            .label=${theme.charAt(0).toUpperCase() + theme.slice(1) + " Status"}
            .description="This is an example of ${theme == "info" || theme == "emergency" ? `an ${theme}` : `a ${theme}`} alert."
            dismissible
            ></nys-alert>
          <br />`,
    )}
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert theme="info" label="Info status" description="This is an example of an info alert." dismissible></nys-alert>
<nys-alert theme="warning" label="Warning status" description="This is an example of a warning alert." dismissible></nys-alert>
<nys-alert theme="success" label="Success status" description="This is an example of a success alert." dismissible></nys-alert>
<nys-alert theme="error" label="Error status" description="This is an example of an error alert." dismissible></nys-alert>
<nys-alert theme="emergency" label="Emergency status" description="This is an example of an emergency alert." dismissible></nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: AlertType
export const AlertType: Story = {
  args: {
    theme: "info",
    label: "Information status",
    description: "Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.",
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .label=${args.label}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
 theme="info" 
 label="Information status" 
 description="Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.">
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: Description
export const Description: Story = {
  args: {
    theme: "success",
    label: "Custom Descriptions",
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .label=${args.label}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p slot="description">This is a custom alert with <strong>HTML content</strong>.</p>
      <a slot="description" href="https://www.ny.gov/" target="_blank">Learn more</a>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert theme="success" label="Custom Descriptions">
  <p slot="description">This is a custom alert with <strong>HTML content</strong>.</p>
  <a slot="description" href="https://www.ny.gov/" target="_blank">Learn more</a>
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
    theme: "info",
    label: "Information status",
    dismissible: true,
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .label=${args.label}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p slot="description">
        Adirondack peaks auctor Hudson River flows semper Statue of Liberty
        est.<br />
        Click here:
        <a href="https://www.ny.gov/" target="_blank">https://www.ny.gov/</a>
        for more info.
      </p>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  theme="info" 
  label="Information status" 
  dismissible>
  <p slot="description">Adirondack peaks auctor Hudson River flows semper Statue of Liberty est. <br/>Click here: <a href="https://www.ny.gov/" target="_blank"">https://www.ny.gov/</a> for more info.</p>
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
    theme: "info",
    label: "Information status",
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
        newAlert.setAttribute("theme", args.theme);
        newAlert.setAttribute("label", args.label);
        newAlert.setAttribute("description", args.description);
        newAlert.setAttribute("duration", String(args.duration));
        if (args.dismissible) newAlert.setAttribute("dismissible", "");
        if (args.noIcon) newAlert.setAttribute("noIcon", "");
        if (args.isSlim) newAlert.setAttribute("isSlim", "");
        container.appendChild(newAlert);
      }
    };

    return html`
      <div class="alert-duration-container">
        <button
          id="show-alert"
          type="button"
          @click=${showAlert}
          style="
          background-color: #154973; 
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
  theme="info" 
  label="Information status" 
  description="This alert will disappear after 3 seconds."
  duration="3000">
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
    theme: "warning",
    label: "Help status",
    description: "Niagara Falls magna ut Catskills serenity, Bronx Zoo vehicula Brooklyn Bridge tristique at?",
    icon: "help",
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .label=${args.label}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  theme="warning" 
  label="Help status"
  description=""Niagara Falls magna ut Catskills serenity, Bronx Zoo vehicula Brooklyn Bridge tristique at?" 
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
    theme: "info",
    label: "Information status",
    description: "Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.",
    noIcon: true,
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .label=${args.label}
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
  theme="info" 
  label="Information status" 
  description="Adirondack peaks auctor Hudson River flows semper Statue of Liberty est."
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
    theme: "info",
    description: "Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.",
    isSlim: true,
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .label=${args.label}
      .description=${args.description}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p>
        Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.
      </p>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  theme="info"
  description="Adirondack peaks auctor Hudson River flows semper Statue of Liberty est."
  isSlim>
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};
