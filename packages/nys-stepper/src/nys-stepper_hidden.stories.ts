import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";
import "@nysds/nys-button";

const meta: Meta = {
  title: "OTHER/Hidden",
  tags: ["hidden"],
};

export default meta;

type Story = StoryObj;
export const Resizable: Story = {
  args: {
    id: "stepper",
    name: "stepper",
    label: "Register for Design System Office Hours",
  },
  render: (args) => html`
    <div class="wrapper">
      <nys-stepper
        .id=${args.id}
        .name=${args.name}
        label=${args.label}
        contentTarget="stepper-content"
      >
        <nys-step
          label="Personal Details"
          href="/nys-stepper/personal.html"
        ></nys-step>
        <nys-step
          label="Team Info"
          selected
          href="/nys-stepper/team.html"
        ></nys-step>
        <nys-step
          label="Usage Survey"
          current
          href="/nys-stepper/survey.html"
        ></nys-step>
        <nys-step
          label="Newsletter Opt-In"
          href="/nys-stepper/newsletter.html"
        ></nys-step>
        <nys-step label="Step 5"></nys-step>
        <nys-step label="Step 6"></nys-step>
        <nys-step label="Step 7"></nys-step>
        <nys-step label="Step 8"></nys-step>
        <nys-step label="Step 9"></nys-step>
        <nys-step label="Step 10"></nys-step>
        <div slot="actions">
          <nys-button
            variant="outline"
            label="Save & Exit"
            fullWidth
          ></nys-button>
        </div>
      </nys-stepper>
      <div id="stepper-content">Loading...</div>
    </div>
    <style>
      html,
      body {
        display: flex;
        height: 100%;
        width: 100%;
      }
      #storybook-root,
      #root-inner {
        height: 100%;
        width: 100%;
      }
      .wrapper {
        display: flex;
        flex: 1;
        height: 100%;
        width: 100%;
        max-height: 600px;
      }
      #stepper-content {
        width: 100%;
      }

      @media (max-width: 479px) {
        .wrapper {
          flex-direction: column;
          max-height: 100%;
        }
      }
    </style>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-stepper
  id="stepper3"
  name="stepper3"
  label="Register for Design System Office Hours"
>
  <nys-step label="Personal Details" href="/personal.html"></nys-step>
  <nys-step label="Team Info" selected href="/team.html"></nys-step>
  <nys-step label="Usage Survey" current href="/survey.html"></nys-step>
  <nys-step label="Newsletter Opt-In" href="/newsletter.html"></nys-step>
  <div slot="actions">
    <nys-button variant="outline" label="Save & Exit"></nys-button>
  </div>
</nys-stepper>`,
        type: "auto",
      },
    },
  },
};
