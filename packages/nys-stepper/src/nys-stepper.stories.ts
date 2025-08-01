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
          .onClick=${() => alert("This step also has a function called on it")}
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
    <script>
      setTimeout(() => {
        const stepper = document.querySelector("nys-stepper");
        const contentDiv = document.getElementById("stepper-content");

        if (!stepper || !contentDiv) return;

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

        // Helper to run onClick and/or href logic from a step element
        const activateStep = async (stepEl) => {
          if (!stepEl || stepEl.tagName !== "NYS-STEP") return;

          const onClick = stepEl.onClick;
          const href = stepEl.getAttribute("href");

          if (typeof onClick === "function") {
            onClick();
          }
          if (href) {
            await loadContent(href);
          }
        };

        // On initial load: find selected step and run logic
        const selectedStep = stepper.querySelector("nys-step[selected]");
        if (selectedStep) {
          activateStep(selectedStep);
        }

        // Handle custom event from click OR keyboard
        stepper.addEventListener("nys-step-click", async (e) => {
          const stepEl = e.target;
          await activateStep(stepEl);
        });
      }, 0);
    </script>
  `,
  parameters: {
    docs: {
      source: {
        code: `
        <div class="nys-grid-row">
          <nys-stepper
            class="nys-mobile-lg:nys-grid-col-6 nys-tablet:nys-grid-col-4"
            label="Register for Design System Office Hours"
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
              .onClick=\${() => alert("This step also has a function called on it")}
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
          <div class="nys-mobile-lg:nys-grid-col-6" id="stepper-content">
            Loading...
          </div>
        </div>

        <script>
          setTimeout(() => {
            const stepper = document.querySelector("nys-stepper");
            const contentDiv = document.getElementById("stepper-content");

            if (!stepper || !contentDiv) return;

            const loadContent = async (href) => {
              if (!href) {
                contentDiv.innerHTML =
                  "<div>This step has no href to load content from.</div>";
                return;
              }
              try {
                contentDiv.innerHTML = "<div>Loading...</div>";
                const response = await fetch(href);
                if (!response.ok)
                  throw new Error("Network response was not ok");
                const html = await response.text();
                contentDiv.innerHTML = html;
              } catch (error) {
                console.error(error);
                contentDiv.innerHTML = "<div>Error loading content.</div>";
              }
            };

            // Helper to run onClick and/or href logic from a step element
            const activateStep = async (stepEl) => {
              if (!stepEl || stepEl.tagName !== "NYS-STEP") return;

              const onClick = stepEl.onClick;
              const href = stepEl.getAttribute("href");

              if (typeof onClick === "function") {
                onClick();
              }
              if (href) {
                await loadContent(href);
              }
            };

            // On initial load: find selected step and run logic
            const selectedStep = stepper.querySelector("nys-step[selected]");
            if (selectedStep) {
              activateStep(selectedStep);
            }

            // Handle custom event from click OR keyboard
            stepper.addEventListener("nys-step-click", async (e) => {
              const stepEl = e.target;
              await activateStep(stepEl);
            });
          }, 0);
        </script>
        `,
      },
    },
  },
};
