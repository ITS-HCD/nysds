import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {
  type: string;
  heading: string;
  text: string;
  duration?: number;
  icon?: string;
  dismissible?: boolean;
  primaryAction?: string;
  secondaryAction?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}

const meta: Meta<NysAlertArgs> = {
  title: "Components/Alert",
  component: "nys-alert",
  argTypes: {
    type: {
      control: "select",
      options: ["base", "info", "warning", "success", "danger", "emergency"],
    },
    heading: { control: "text" },
    text: { control: "text" },
    duration: { control: "number" },
    icon: { control: "text" },
    primaryAction: { control: "text" },
    secondaryAction: { control: "text" },
    primaryLabel: { control: "text" },
    secondaryLabel: { control: "text" },
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

// Story: Basic
export const Basic: Story = {
  args: {
    heading: "Custom Heading",
    text: "This is a custom text describing your alert.",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  heading="Information status" 
  text="Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.">
</nys-alert>
        `,
        type: "auto",
      },
    },
  },
};

// Story: AllAlerts
export const AllAlerts: Story = {
  render: () => html`
    ${["base", "info", "success", "warning", "danger", "emergency"].map(
      (type) =>
        html`<nys-alert
            .type=${type}
            .heading=${type.charAt(0).toUpperCase() + type.slice(1) + " Status"}
            .text="This is an example of ${type == "info" || type == "emergency"
              ? `an ${type}`
              : `a ${type}`} alert."
            dismissible
            primaryLabel="{primaryAction}"
            secondaryLabel="{secondaryAction}"
            primaryAction="https://www.ny.gov/"
            secondaryAction="https://www.ny.gov/"
          ></nys-alert>
          <br />`,
    )}
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert type="base" heading="Default status" text="This is an example of an neutral base alert." dismissible primaryLabel="{primaryAction}" secondaryLabel="{secondaryAction}" primaryAction="https://www.ny.gov/" secondaryAction="https://www.ny.gov/"></nys-alert>
<nys-alert type="info" heading="Info status" text="This is an example of an info alert." dismissible primaryLabel="{primaryAction}" secondaryLabel="{secondaryAction}" primaryAction="https://www.ny.gov/" secondaryAction="https://www.ny.gov/"></nys-alert>
<nys-alert type="success" heading="Success status" text="This is an example of a success alert." dismissible primaryLabel="{primaryAction}" secondaryLabel="{secondaryAction}" primaryAction="https://www.ny.gov/" secondaryAction="https://www.ny.gov/"></nys-alert>
<nys-alert type="warning" heading="Warning status" text="This is an example of a warning alert." dismissible primaryLabel="{primaryAction}" secondaryLabel="{secondaryAction}" primaryAction="https://www.ny.gov/" secondaryAction="https://www.ny.gov/"></nys-alert>
<nys-alert type="danger" heading="Danger status" text="This is an example of a danger alert." dismissible primaryLabel="{primaryAction}" secondaryLabel="{secondaryAction}" primaryAction="https://www.ny.gov/" secondaryAction="https://www.ny.gov/"></nys-alert>
<nys-alert type="emergency" heading="Emergency status" text="This is an example of an emergency alert." dismissible primaryLabel="{primaryAction}" secondaryLabel="{secondaryAction}" primaryAction="https://www.ny.gov/" secondaryAction="https://www.ny.gov/"></nys-alert>
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
    heading: "Information status",
    text: "Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
 type="info" 
 heading="Information status" 
 text="Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.">
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
    type: "success",
    heading: "Custom Descriptions",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
      <p>This is a custom alert with <strong>HTML content</strong>.</p>
      <a href="https://www.ny.gov/" target="_blank"
        >Learn more about our accessibility services</a
      >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert type="success" heading="Custom Descriptions">
  <p>This is a custom alert with <strong>HTML content</strong>.</p>
  <a href="https://www.ny.gov/" target="_blank">Learn more about our accessibility services</a>
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
    heading: "Information status",
    dismissible: true,
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
      <p>
        Adirondack peaks auctor Hudson River flows semper Statue of Liberty
        est.<br />
        Click here for more info:
        <a href="https://www.ny.gov/" target="_blank">https://www.ny.gov/</a>
      </p>
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info" 
  heading="Information status" 
  dismissible>
  <p>Adirondack peaks auctor Hudson River flows semper Statue of Liberty est. <br/>Click here for more info: <a href="https://www.ny.gov/" target="_blank">https://www.ny.gov/</a> for more info.</p>
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
    heading: "Information status",
    text: "This alert will disappear after 3 seconds.",
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
        newAlert.setAttribute("heading", args.heading);
        newAlert.setAttribute("text", args.text);
        newAlert.setAttribute("duration", String(args.duration));
        if (args.dismissible) newAlert.setAttribute("dismissible", "");
        container.appendChild(newAlert);
      }
    };

    return html`
      <div class="alert-duration-container">
        <button
          id="show-alert"
          type="button"
          @click=${showAlert}
          @keydown="${(e: KeyboardEvent) => {
            if (
              e.code === "Enter" ||
              e.code === "Space" ||
              e.key === "Enter" ||
              e.key === " "
            ) {
              showAlert();
            }
          }}"
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
  type="info" 
  heading="Information status" 
  text="This alert will disappear after 3 seconds."
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
    type: "emergency",
    heading: "Winter storm warning: Dec 10th, 2024.",
    text: "A major snowfall is expected across the state of New York for the weekend of Dec 7th. Stay home if possible and use extreme caution when driving.",
    icon: "ac_unit",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="emergency" 
  heading="Winter storm warning: Dec 10th, 2024."
  text="A major snowfall is expected across the state of New York for the weekend of Dec 7th. Stay home if possible and use extreme caution when driving." 
  icon="help">
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: HeadingOnly
export const HeadingOnly: Story = {
  args: {
    type: "info",
    heading:
      "Adirondack peaks auctor Hudson River flows semper Statue of Liberty est.",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="info"
  heading="Adirondack peaks auctor Hudson River flows semper Statue of Liberty est."
>
</nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};

// Story: ActionLinks
export const ActionLinks: Story = {
  args: {
    type: "emergency",
    heading: "Winter storm warning: Dec 10th, 2024.",
    text: "A major snowfall is expected across the state of New York for the weekend of Dec 7th. Stay home if possible and use extreme caution when driving.",
    primaryAction: "https://www.ny.gov/",
    secondaryAction: "https://www.ny.gov/",
    primaryLabel: "Weather Report",
    secondaryLabel: "Plowing Schedule",
  },
  render: (args) => html`
    <nys-alert
      .type=${args.type}
      .heading=${args.heading}
      .text=${args.text}
      .duration=${args.duration}
      .icon=${args.icon}
      ?dismissible=${args.dismissible}
      .primaryAction=${args.primaryAction}
      .secondaryAction=${args.secondaryAction}
      .primaryLabel=${args.primaryLabel}
      .secondaryLabel=${args.secondaryLabel}
    >
    </nys-alert>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-alert 
  type="emergency" 
  heading="Winter storm warning: Dec 10th, 2024."
  text= "A major snowfall is expected across the state of New York for the weekend of Dec 7th. Stay home if possible and use extreme caution when driving."
  primaryAction="https://www.ny.gov/"
  secondaryAction="https://www.ny.gov/"
  primaryLabel="Weather Report"
  secondaryLabel="Plowing Schedule"
></nys-alert>
`.trim(),
        type: "auto",
      },
    },
  },
};
