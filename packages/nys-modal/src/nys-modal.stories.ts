import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-modal";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysModalArgs {
  id: string;
  heading: string;
  subheading: string;
  open: boolean;
  dismissible: boolean;
}

const meta: Meta<NysModalArgs> = {
  title: "Components/Modal",
  component: "nys-modal",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    subheading: { control: "text" },
    open: { control: "boolean", default: false },
    dismissible: { control: "boolean", default: true },
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
    heading: "Lorem ipsum dolor sit amet",
    subheading: "subtext",
    open: false,
    dismissible: true,
  },
  render: (args) => {
    const showModal = () => {
      const modal = document.querySelector(".modal1") as any;
      if (modal) {
        modal.open = true;
      }
    };

    const closeModal = () => {
      const modal = document.querySelector(".modal1") as any;
      if (modal) {
        modal.open = false;
      }
    };

    const saveChanges = () => {
      alert("Mock Alert: Changes saved!");
      closeModal();
    };

    return html`
      <div style="padding: 100px 0;">
        <nys-button
          label="Open Modal"
          .onClick=${() => showModal()}
        ></nys-button>
        <nys-modal
          class="modal1"
          .id=${args.id}
          .heading=${args.heading}
          .subheading=${args.subheading}
          .open=${args.open}
          .dismissible=${args.dismissible}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu  fugiat nulla
            pariatur. Excepteur sint occae cupidatat non proident, sunt in culpa
            qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidid
          </p>
          <div slot="actions">
            <nys-button
              label="Cancel"
              variant="outline"
              .onClick=${() => closeModal()}
            ></nys-button>
            <nys-button
              label="Confirm"
              .onClick=${() => saveChanges()}
            ></nys-button>
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
  name="modal1"
>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu  fugiat nulla pariatur. Excepteur sint occae cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidid
</nys-modal>`,
        type: "auto",
      },
    },
  },
};
