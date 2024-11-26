import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  theme: string;
  title: string;
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
    title: { control: "text" },
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
            .title=${theme.charAt(0).toUpperCase() + theme.slice(1) + " Status"}
            dismissible
            ><p>
              This is an example of
              ${theme == "info" || theme == "emergency"
                ? `an ${theme}`
                : `a ${theme}`}
              alert.
            </p></nys-alert
          >
          <br /> `,
    )}
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert theme="info" title="Info status" dismissible><p>This is an example of an info alert.</p></nys-alert>
<nys-alert theme="warning" title="Warning status" dismissible><p>This is an example of a warning alert.</p></nys-alert>
<nys-alert theme="success" title="Success status" dismissible><p>This is an example of a success alert.</p></nys-alert>
<nys-alert theme="error" title="Error status" dismissible><p>This is an example of an error alert.</p></nys-alert>
<nys-alert theme="emergency" title="Emergency status" dismissible><p>This is an example of an emergency alert.</p></nys-alert>
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
    title: "Information status",
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .title=${args.title}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        Click here:
        <a href="https://example.com" target="_blank">https://example.com</a>
        for more info.
      </p>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert theme="info" title="Information status">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: <a href="https://example.com" target="_blank">https://example.com</a> for more info.</p>
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: DescriptionSlot
export const DescriptionSlot: Story = {
  args: {
    theme: "success",
    title: "Custom Descriptions",
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .title=${args.title}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p>This is a custom alert with <strong>HTML content</strong>.</p>
      <a href="https://example.com" target="_blank">Learn more</a>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert theme="success" title="Custom Descriptions">
  <p>This is a custom alert with <strong>HTML content</strong>.</p>
  <a href="https://example.com" target="_blank">Learn more</a>
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
    title: "Information status",
    dismissible: true,
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .title=${args.title}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
        Click here:
        <a href="https://example.com" target="_blank">https://example.com</a>
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
  title="Information status" 
  dismissible>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Click here: <a href="https://example.com" target="_blank"">https://example.com</a> for more info.</p>
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
    title: "Information status",
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
        newAlert.setAttribute("title", args.title);
        newAlert.setAttribute("duration", String(args.duration));
        if (args.dismissible) newAlert.setAttribute("dismissible", "");
        if (args.noIcon) newAlert.setAttribute("noIcon", "");
        if (args.isSlim) newAlert.setAttribute("isSlim", "");
        newAlert.innerText = "This alert will disappear after 3 seconds.";
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
  theme="info" 
  title="Information status" 
  duration="3000">
  <p>This alert will disappear after 3 seconds.</p>
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
    title: "Help status",
    icon: "help",
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .title=${args.title}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?
      </p>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  theme="warning" 
  title="Help status" 
  icon="help">
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?</p>
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
    title: "Information status",
    noIcon: true,
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .title=${args.title}
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
  title="Information status" 
  noIcon
  >
 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
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
    title: "Information status",
    isSlim: true,
  },
  render: (args) => html`
    <nys-alert
      .theme=${args.theme}
      .title=${args.title}
      .duration=${args.duration}
      .icon=${args.icon}
      ?noIcon=${args.noIcon}
      ?isSlim=${args.isSlim}
      ?dismissible=${args.dismissible}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
      </p>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  theme="info" 
  title="Information status" 
  isSlim>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};
