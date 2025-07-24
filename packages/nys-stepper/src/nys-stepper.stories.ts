import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";
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

      <div id="stepper-content"><div id="loading">Loading...</div></div>
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

      #loading {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        border: solid 1px black;
      }

      @media (max-width: 479px) {
        .wrapper {
          flex-direction: column;
          max-height: 100%;
        }
      }
    </style>

    <script>
      setTimeout(() => {
        const stepper = document.querySelector("nys-stepper");
        const contentDiv = document.getElementById("stepper-content");

        if (stepper && contentDiv) {
          // Function to load content by href
          const loadContent = async (href) => {
            if (!href) {
              contentDiv.innerHTML =
                "<div>This step has no href to load content from.</div>";
              return;
            }
            try {
              contentDiv.innerHTML = "<div>Loading...</div>";
              const response = await fetch(href);
              if (!response.ok) throw new Error("Network response was not ok");
              const html = await response.text();
              contentDiv.innerHTML = html;
            } catch (error) {
              console.error(error);
              contentDiv.innerHTML = "<div>Error loading content.</div>";
            }
          };

          // On initial load: find selected step and load content
          const selectedStep = stepper.querySelector("nys-step[selected]");
          if (selectedStep) {
            const href = selectedStep.getAttribute("href");
            loadContent(href);
          }

          // Listen for step clicks and load content
          stepper.addEventListener("nys-step-click", async (e) => {
            const stepEl = e.target;
            if (stepEl?.tagName === "NYS-STEP") {
              const href = stepEl.getAttribute("href");
              await loadContent(href);
            }
          });
        }
      }, 0);
    </script>
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
