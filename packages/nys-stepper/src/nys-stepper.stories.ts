import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";
import "@nysds/nys-textinput";
import "@nysds/nys-button";

// Define the structure of the args used in the stories
interface NysStepperArgs {
  id: string;
  name: string;
  label: string;
  counterText: string;
  class: string;
  isCompactExpanded: boolean;
  current: boolean;
}

const meta: Meta<NysStepperArgs> = {
  title: "Components/Stepper",
  component: "nys-stepper",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    counterText: { control: "text" },
    class: { control: "text" },
    isCompactExpanded: { control: "boolean", default: false },
    current: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysStepperArgs>;

export const StepWithPageNavigation: Story = {
  args: {
    label: "Personal Info",
  },
  render: (args) => {
    return html`
      <nys-step
        .id=${args.id}
        ?isCompactExpanded=${args.isCompactExpanded}
        ?current=${args.current}
        .name=${args.name}
        .label=${args.label}
        .counterText=${args.counterText}
        .class=${args.class}
      ></nys-step>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-step label="Personal Info" href="/step-1"></nys-step>`,
        type: "auto",
      },
    },
  },
};

export const BasicStepper: Story = {
  render: () => {
    return html`
      <nys-stepper label="Application Progress">
        <nys-step label="Personal Info" current></nys-step>
        <nys-step label="Contact Details"></nys-step>
        <nys-step label="Review"></nys-step>
      </nys-stepper>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-stepper label="Application Progress">
  <nys-step label="Personal Info" current></nys-step>
  <nys-step label="Contact Details"></nys-step>
  <nys-step label="Review"></nys-step>
</nys-stepper>`,
        type: "auto",
      },
    },
  },
};

export const GridLayoutWithSidebarPlacement: Story = {
  render: () => {
    return html`
      <div class="nys-grid-container">
        <div class="nys-grid-row">
          <nys-stepper
            label="Application"
            class="nys-grid-col-12 nys-desktop:nys-grid-col-3"
          >
            <nys-step label="Personal Info"></nys-step>
            <nys-step label="Contact" current></nys-step>
            <nys-step label="Review"></nys-step>
          </nys-stepper>
          <main
            class="nys-grid-col-12 nys-desktop:nys-grid-col-9"
            id="main-content"
          >
            <!-- Form content for current step -->
            <nys-textinput label="Email" required></nys-textinput>
            <nys-textinput label="Phone"></nys-textinput>
          </main>
        </div>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<div class="nys-grid-container">
  <div class="nys-grid-row">
    <nys-stepper label="Application" class="nys-grid-col-12 nys-desktop:nys-grid-col-3">
      <nys-step label="Personal Info"></nys-step>
      <nys-step label="Contact" current></nys-step>
      <nys-step label="Review"></nys-step>
    </nys-stepper>
    <main class="nys-grid-col-12 nys-desktop:nys-grid-col-9" id="main-content">
      <!-- Form content for current step -->
      <nys-textinput label="Email" required></nys-textinput>
      <nys-textinput label="Phone"></nys-textinput>
    </main>
  </div>
</div>`,
        type: "auto",
      },
    },
  },
};

export const NavigationButtonsInActionsSlot: Story = {
  render: () => {
    return html`<pre
      style="white-space: pre-wrap; font-family: monospace; font-size: 0.85em; background: #f4f4f4; padding: 1em; border-radius: 4px;"
    ><code>${'Add Previous/Next buttons using the actions slot. Wrap buttons in a `\n<div>\n  `. ```html\n  <nys-stepper label="Application">\n    <nys-step label="Step 1"></nys-step>\n    <nys-step label="Step 2" current></nys-step>\n    <nys-step label="Step 3"></nys-step>\n    <div slot="actions">\n      <nys-button label="Save and Exit" variant="outline" size="sm" fullWidth></nys-button>\n    </div>\n  </nys-stepper>\n  ```x\n</div>'}</code></pre>`;
  },
  parameters: {
    docs: {
      source: {
        code: `
Add Previous/Next buttons using the actions slot. Wrap buttons in a \`
<div>
  \`. \`\`\`html
  <nys-stepper label="Application">
    <nys-step label="Step 1"></nys-step>
    <nys-step label="Step 2" current></nys-step>
    <nys-step label="Step 3"></nys-step>
    <div slot="actions">
      <nys-button label="Save and Exit" variant="outline" size="sm" fullWidth></nys-button>
    </div>
  </nys-stepper>
  \`\`\`x
</div>`,
        type: "auto",
      },
    },
  },
};
