import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-modal";
import "@nysds/nys-button";

const meta: Meta = {
  title: "Components/Modal",
  component: "nys-modal",
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
  render: () => {
    return html`
      <div id="modal-wrapper1">
        <nys-button
          label="Open Modal"
          onclick="
            document.querySelector('.modal1').open = true;
            document.getElementById('modal-wrapper1').style.padding = '100px 0';
          "
        ></nys-button>
        <nys-modal class="modal1" id="modal1" heading="Update Available">
          <p>
            Would you like to install the latest version? Albany ipsum dolor sit
            Empire, Hudson consectetur Adirondack elit, sed do MetroCard tempor
            incididunt ut Capitol et Broadway magna Niagara. Ut enim ad Erie
            veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea
            Cuomo consequat.
          </p>
        </nys-modal>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal id="modal1" heading="Update Available">
  <p>
    Would you like to install the latest version? Albany ipsum dolor sit Empire, Hudson consectetur
    Adirondack elit, sed do MetroCard tempor incididunt ut Capitol et Broadway magna Niagara. Ut
    enim ad Erie veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea Cuomo
    consequat.
  </p>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};

export const Subheading: Story = {
  render: () => {
    return html`
      <div id="modal-wrapper-subheading">
        <nys-button
          label="Open Modal"
          onclick="
            document.querySelector('.modal-subheading').open = true;
            document.getElementById('modal-wrapper-subheading').style.padding = '100px 0';
          "
        ></nys-button>
        <nys-modal
          class="modal-subheading"
          id="modal-subheading"
          heading="Before you continue"
          subheading="Your progress has been saved automatically."
        >
          <p>
            You can safely leave this page and return later to pick up where you
            left off.
          </p>
        </nys-modal>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-modal
  id="modal-subheading"
  heading="Before you continue"
  subheading="Your progress has been saved automatically."
>
  <p>You can safely leave this page and return later to pick up where you left off.</p>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};

export const ActionsSlot: Story = {
  render: () => {
    return html`
      <div id="modal-wrapper3">
        <nys-button
          label="Open Modal"
          onclick="
            document.querySelector('.modal3').open = true;
            document.getElementById('modal-wrapper3').style.padding = '100px 0';
          "
        ></nys-button>
        <nys-modal class="modal3" id="modal3" heading="Update password?">
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
              variant="outline"
              onclick="
                document.querySelector('.modal3').open = false;
                document.getElementById('modal-wrapper3').style.padding = '0';
              "
            ></nys-button>
            <nys-button
              label="Update"
              onclick="
                alert('Mock Alert: Changes saved!');
                document.querySelector('.modal3').open = false;
                document.getElementById('modal-wrapper3').style.padding = '0';
              "
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
<nys-modal id="modal3" heading="Update password?">
  <p>
    Would you like to install the latest version? Albany ipsum dolor sit Empire, Hudson consectetur
    Adirondack elit, sed do MetroCard tempor incididunt ut Capitol et Broadway magna Niagara. Ut
    enim ad Erie veniam, quis nostrud Catskill ullamco Bronx nisi ut LongIsland ex ea Cuomo
    consequat.
  </p>
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

export const MandatoryAction: Story = {
  render: () => {
    return html`
      <div id="modal-wrapper4">
        <nys-button
          label="Open Modal"
          onclick="
            document.querySelector('.modal4').open = true;
            document.getElementById('modal-wrapper4').style.padding = '100px 0';
          "
        ></nys-button>
        <nys-modal
          class="modal4"
          id="modal4"
          heading="There is no way to X out of here"
          subheading="Don't use this prop unless you add in the actions slot so the user does not get stuck in here."
          mandatory
        >
          <div slot="actions">
            <nys-button
              label="Get me out"
              onclick="
                alert('Ok, ok. You can go now.');
                document.querySelector('.modal4').open = false;
                document.getElementById('modal-wrapper4').style.padding = '0';
              "
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
  id="modal4"
  heading="There is no way to X out of here"
  subheading="Don't use this prop unless you add in the actions slot so the user does not get stuck in here."
  mandatory
>
  <div slot="actions">
    <nys-button label="Get me out"></nys-button>
  </div>
</nys-modal>`,
        type: "auto",
      },
    },
  },
};
