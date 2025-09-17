import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "@nysds/nys-button";
import "@nysds/nys-textinput";
import "@nysds/nys-textarea";

// Define the structure of the args used in the stories
interface NysStepperArgs {
  id: string;
  name: string;
  label: string;
  onClick: () => void;
}

const meta: Meta<NysStepperArgs> = {
  title: "Components/Stepper",
  component: "nys-stepper",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysStepperArgs>;

// Define stories without using args
export const Basic: Story = {
  args: {
    id: "stepper",
    name: "stepper",
    label: "Register for Design System Office Hours",
  },
  render: (args) => html`
    <div class="nys-grid-row">
      <nys-stepper
        .id=${args.id}
        .name=${args.name}
        label=${args.label}
        class="nys-desktop:nys-grid-col-3"
      >
        <nys-step
          label="Personal Details"
          href="demo/nys-stepper/personal.html"
        ></nys-step>
        <nys-step
          label="Team Info"
          selected
          href="demo/nys-stepper/team.html"
        ></nys-step>
        <nys-step
          label="Usage Survey"
          current
          href="demo/nys-stepper/survey.html"
          .onClick=${() => alert("This step also has a function called on it")}
        ></nys-step>
        <nys-step
          label="Newsletter Opt-In"
          href="demo/nys-stepper/newsletter.html"
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

        if (stepper?.updateComplete) {
          await stepper.updateComplete; // Wait for Lit to finish rendering
        }

        const selectedStep = document.querySelector("nys-step[selected]");
        if (selectedStep) {
          const href = selectedStep.getAttribute("href");
          if (href) {
            try {
              const res = await fetch(href);
              if (!res.ok) throw new Error("Failed to load " + href);
              const html = await res.text();
              const container = document.querySelector("#nys-stepper-content");
              if (container) container.innerHTML = html;
            } catch (err) {
              console.error("Error loading initial step content:", err);
            }
          }
        }
      });

      document.addEventListener("nys-step-click", async (e) => {
        const href = e.detail?.href;
        if (!href) return;

        e.preventDefault();
        try {
          const res = await fetch(href);
          if (!res.ok) throw new Error("Failed to fetch ", href);
          const html = await res.text();

          const container = document.querySelector("#nys-stepper-content");
          if (container) {
            container.innerHTML = html;
          }
        } catch (err) {
          console.error("Error loading innerHTML:", err);
        }
      });
    </script>
  `,
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
      onClick=${() => alert("This step also has a function called on it")}
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
  <div class="nys-desktop:nys-grid-col-9" id="stepper-content">
    Loading...
  </div>
</div>
`,
      },
    },
  },
};
