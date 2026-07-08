import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-modal";
import "@nysds/nys-button";
import "@nysds/nys-textinput";
import "@nysds/nys-label";

// Define the structure of the args used in the stories
interface NysModalArgs {
  id: string;
  heading: string;
  subheading: string;
  open: boolean;
  mandatory: boolean;
}

const meta: Meta<NysModalArgs> = {
  title: "Components/Modal",
  component: "nys-modal",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    subheading: { control: "text" },
    open: { control: "boolean", default: false },
    mandatory: { control: "boolean", default: true },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysModalArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "modal1",
    heading: "Update Available",
    subheading: "A new version of this application is ready to install.",
    open: false,
    mandatory: false,
  },
  render: (args) => {
    const showModal = () => {
      const modal = document.querySelector(".modal1") as any;
      if (modal) {
        modal.open = true;

        // Add padding when opening the modal
        const wrapper = document.getElementById("modal-wrapper1");
        if (wrapper) {
          wrapper.style.padding = "100px 0";
        }
      }
    };

    const closeModal = () => {
      const modal = document.querySelector(".modal1") as any;
      if (modal) {
        modal.open = false;
      }

      // Remove padding when closing the modal
      const wrapper = document.getElementById("modal-wrapper1");
      if (wrapper) {
        wrapper.style.padding = "0";
      }
    };

    return html`
      <div id="modal-wrapper1">
        <nys-button label="Open Modal" @nys-click=${showModal}></nys-button>
        <nys-modal
          class="modal1"
          .id=${args.id}
          .heading=${args.heading}
          .subheading=${args.subheading}
          .open=${args.open}
          .mandatory=${args.mandatory}
        >
          <p>
            Would you like to install the latest version? Albany ipsum dolor sit
            Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
            incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
            veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
            Cuomo consequat.
          </p>
          <div slot="actions">
            <nys-button
              label="Not now"
              variant="text"
              @nys-click=${closeModal}
            ></nys-button>
            <nys-button label="Update" @nys-click=${closeModal}></nys-button>
          </div>
        </nys-modal>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal
  id="modal1"
  heading="Update Available"
  subheading="A new version of this application is ready to install."
>
  <p>
    Would you like to install the latest version? Albany ipsum dolor sit
    Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
    incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
    veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
    Cuomo consequat.
  </p>
  <div slot="actions">
    <nys-button label="Not now" variant="text" onClick="{your logic here}"</nys-button>
    <nys-button label="Update" onClick="{your logic here}"></nys-button>
  </div>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};

// BasicSlot
export const BasicSlot: Story = {
  args: {
    id: "modal2",
    heading: "System Maintenance Notice",
    subheading: "Scheduled downtime will occur this weekend.",
  },
  render: (args) => {
    const showModal = () => {
      const modal = document.querySelector(".modal2") as any;
      if (modal) {
        modal.open = true;
      }

      // Add padding when opening the modal
      const wrapper = document.getElementById("modal-wrapper2");
      if (wrapper) {
        wrapper.style.padding = "100px 0";
      }
    };

    return html`
      <div id="modal-wrapper2">
        <nys-button label="Open Modal" @nys-click=${showModal}></nys-button>
        <nys-modal
          class="modal2"
          .id=${args.id}
          .heading=${args.heading}
          .subheading=${args.subheading}
          .open=${args.open}
          .mandatory=${args.mandatory}
        >
          <p>
            Please be advised that the system will be unavailable for
            maintenance from 10 PM Friday to 6 AM Saturday. Ensure you save your
            work and plan accordingly. For more details, visit the
            <a
              href="https://www.ny.gov/"
              target="_blank"
              rel="noopener noreferrer"
              >NYS site</a
            >.
          </p>
        </nys-modal>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `<nys-modal id="modal2" heading="System Maintenance Notice" subheading="Scheduled downtime will occur this weekend.">
  <p>
    Please be advised that the system will be unavailable for maintenance
    from 10 PM Friday to 6 AM Saturday. Ensure you save your work and
    plan accordingly. For more details, visit the
    <a href="https://www.ny.gov/" target="_blank" rel="noopener noreferrer">NYS site</a>.
  </p>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};

// Button slot
export const ActionButtonSlot: Story = {
  args: {
    id: "modal3",
    heading: "Update password?",
  },
  render: (args) => {
    const showModal = () => {
      const modal = document.querySelector(".modal3") as any;
      if (modal) {
        modal.open = true;
      }

      // Add padding when opening the modal
      const wrapper = document.getElementById("modal-wrapper3");
      if (wrapper) {
        wrapper.style.padding = "100px 0";
      }
    };

    const closeModal = () => {
      const modal = document.querySelector(".modal3") as any;
      if (modal) {
        modal.open = false;
      }

      // Remove padding when closing the modal
      const wrapper = document.getElementById("modal-wrapper3");
      if (wrapper) {
        wrapper.style.padding = "0";
      }
    };

    const saveChanges = () => {
      alert("Mock Alert: Changes saved!");
      closeModal();
    };

    return html`
      <div id="modal-wrapper3">
        <nys-button label="Open Modal" @nys-click=${showModal}></nys-button>
        <nys-modal
          class="modal3"
          .id=${args.id}
          .heading=${args.heading}
          .subheading=${args.subheading}
          .open=${args.open}
          .mandatory=${args.mandatory}
        >
          <nys-textinput
            label="Username"
            name="username"
            type="text"
            width="full"
          ></nys-textinput>
          <nys-textinput
            label="Password"
            name="password"
            type="password"
            width="full"
          ></nys-textinput>
          <div slot="actions">
            <nys-button
              label="Not now"
              variant="outline"
              @nys-click=${closeModal}
            ></nys-button>
            <nys-button label="Update" @nys-click=${saveChanges}></nys-button>
          </div>
        </nys-modal>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal id="modal3" heading="Update password?">
  <nys-textinput label="Username" name="username" type="text" width="full"></nys-textinput>
  <nys-textinput label="Password" name="password" type="password" width="full"></nys-textinput>
  <div slot="actions">
    <nys-button label="Not now" variant="outline"></nys-button>
    <nys-button label="Update"></nys-button>
  </div>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};

// Mandatory Action (dismiss button)
export const MandatoryAction: Story = {
  args: {
    id: "modal4",
    heading: "Your session has expired.",
    subheading: "You will need to login again in order to continue.",
    open: false,
    mandatory: true,
  },
  render: (args) => {
    const showModal = () => {
      const modal = document.querySelector(".modal4") as any;
      if (modal) {
        modal.open = true;
      }

      // Add padding when opening the modal
      const wrapper = document.getElementById("modal-wrapper4");
      if (wrapper) {
        wrapper.style.padding = "100px 0";
      }
    };

    const logIn = () => {
      alert("MOCK: Logging In...");
      const modal = document.querySelector(".modal4") as any;
      if (modal) modal.open = false;

      // Remove padding when closing the modal
      const wrapper = document.getElementById("modal-wrapper4");
      if (wrapper) {
        wrapper.style.padding = "0";
      }
    };

    return html`
      <div id="modal-wrapper4">
        <nys-button label="Open Modal" @nys-click=${showModal}></nys-button>
        <nys-modal
          class="modal4"
          .id=${args.id}
          .heading=${args.heading}
          .subheading=${args.subheading}
          .open=${args.open}
          .mandatory=${args.mandatory}
        >
          <div slot="actions">
            <nys-button label="Login" @nys-click=${logIn}></nys-button>
          </div>
        </nys-modal>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal
  id="modal4"
  heading="Your session has expired."
  subheading="You will need to login again in order to continue."
  mandatory
>
  <div slot="actions">
    <nys-button label="Login"></nys-button>
  </div>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};
