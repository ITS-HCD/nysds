import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";
import "@nysds/nys-button";

const meta: Meta = {
  title: "Components/Stepper",
  component: "nys-stepper",
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
  args: {
    name: "stepper",
    label: "Register for Design System Office Hours",
    counterText: "initial",
    isCompactExpanded: false,
    selected: false,
    current: false,
    href: "/nys-stepper/personal.html",
  },
  render: (args) => {
    return html`
      <div class="nys-grid-row">
        <nys-stepper
          name=${args.name}
          label=${args.label}
          counterText=${args.counterText}
          ?isCompactExpanded=${args.isCompactExpanded}
        >
          <nys-step
            label="Personal Details"
            href=${args.href}
            ?selected=${args.selected}
            ?current=${args.current}
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
        </nys-stepper>
        <div class="nys-desktop:nys-grid-col-9" id="nys-stepper-content">
          Loading...
        </div>
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", async () => {
          const stepper = document.querySelector("nys-stepper");
          if (stepper?.updateComplete) await stepper.updateComplete;
          const selectedStep = document.querySelector("nys-step[selected]");
          const href = selectedStep?.getAttribute("href");
          if (!href) return;
          const res = await fetch(href);
          if (!res.ok) return;
          const container = document.querySelector("#nys-stepper-content");
          if (container) container.innerHTML = await res.text();
        });

        document.addEventListener("nys-step-click", async (e) => {
          const href = e.detail?.href;
          if (!href) return;
          e.preventDefault();
          const res = await fetch(href);
          if (!res.ok) return;
          const container = document.querySelector("#nys-stepper-content");
          if (container) container.innerHTML = await res.text();
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-grid-row">
  <nys-stepper
    id="stepper"
    name="stepper"
    label="Register for Design System Office Hours"
    class="nys-desktop:nys-grid-col-3"
  >
    <nys-step label="Personal Details" href="/nys-stepper/personal.html"></nys-step>
    <nys-step label="Team Info" selected href="/nys-stepper/team.html"></nys-step>
    <nys-step label="Usage Survey" current href="/nys-stepper/survey.html"></nys-step>
    <nys-step label="Newsletter Opt-In" href="/nys-stepper/newsletter.html"></nys-step>
    <div slot="actions">
      <nys-button variant="outline" label="Save & Exit" fullWidth></nys-button>
    </div>
  </nys-stepper>
  <div class="nys-desktop:nys-grid-col-9" id="nys-stepper-content">Loading...</div>
</div>`,
        type: "auto",
      },
    },
  },
};

export const ActionsSlot: Story = {
  render: () => {
    return html`
      <div class="nys-grid-row">
        <nys-stepper
          id="stepper"
          name="stepper"
          label="Register for Design System Office Hours"
          class="nys-desktop:nys-grid-col-3"
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
          <div slot="actions">
            <nys-button
              variant="outline"
              label="Save & Exit"
              fullWidth
            ></nys-button>
          </div>
        </nys-stepper>
        <div class="nys-desktop:nys-grid-col-9" id="nys-stepper-content">
          Loading...
        </div>
      </div>
      <script>
        document.addEventListener("DOMContentLoaded", async () => {
          const stepper = document.querySelector("nys-stepper");
          if (stepper?.updateComplete) await stepper.updateComplete;
          const selectedStep = document.querySelector("nys-step[selected]");
          const href = selectedStep?.getAttribute("href");
          if (!href) return;
          const res = await fetch(href);
          if (!res.ok) return;
          const container = document.querySelector("#nys-stepper-content");
          if (container) container.innerHTML = await res.text();
        });

        document.addEventListener("nys-step-click", async (e) => {
          const href = e.detail?.href;
          if (!href) return;
          e.preventDefault();
          const res = await fetch(href);
          if (!res.ok) return;
          const container = document.querySelector("#nys-stepper-content");
          if (container) container.innerHTML = await res.text();
        });
      </script>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-grid-row">
  <nys-stepper
    id="stepper"
    name="stepper"
    label="Register for Design System Office Hours"
    class="nys-desktop:nys-grid-col-3"
  >
    <nys-step label="Personal Details" href="/nys-stepper/personal.html"></nys-step>
    <nys-step label="Team Info" selected href="/nys-stepper/team.html"></nys-step>
    <nys-step label="Usage Survey" current href="/nys-stepper/survey.html"></nys-step>
    <nys-step label="Newsletter Opt-In" href="/nys-stepper/newsletter.html"></nys-step>
    <div slot="actions">
      <nys-button variant="outline" label="Save & Exit" fullWidth></nys-button>
    </div>
  </nys-stepper>
  <div class="nys-desktop:nys-grid-col-9" id="nys-stepper-content">Loading...</div>
</div>`,
        type: "auto",
      },
    },
  },
};
