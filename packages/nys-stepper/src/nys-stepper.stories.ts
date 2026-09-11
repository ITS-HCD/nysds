import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-stepper";
import "./nys-step";
import "@nysds/nys-button";
import "@nysds/nys-tab";

const meta: Meta = {
  title: "Components/Stepper",
  component: "nys-stepper",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A multi-step progress indicator for forms or wizards. Manages `nys-step` children with selection and navigation.\n\nAdd `nys-step` elements as children. Mark one step as `current` to indicate the progress boundary; all steps\nbefore it become navigable. Compact view on mobile expands to show all steps. Use the `actions` slot for\npersistent navigation buttons (e.g., Save & Exit). Do not place the stepper inside a `<form>` element —\nput form fields in the main content area alongside it.\n\n## When to use\n- Linear, ordered forms or wizards with more than 2 sections.\n\n## When not to use\n- Forms with only 1 or 2 sections — use a simpler layout.\n- Non-linear forms where sections can be completed in any order.\n\n## Compact mode (mobile)\nOn small screens the stepper collapses to a compact view: step labels are hidden and progress\nis shown as a bar indicator with a "Step x of y" counter. Clicking or pressing Enter/Space on\nthe counter expands the full step list (counter text changes to "Back to Form"). Collapsing\nagain returns the user to the form view.\n\n## actions slot constraints\nThe `actions` slot must contain exactly one `<div>` as its direct child. That `<div>` may only\ncontain `<nys-button>` elements — any other element is removed with a console warning.\nThe stepper automatically forces `size="sm"` on every button in the slot. Buttons with the\n`fullWidth` attribute get `flex: 1 1 0` injected so they share available width equally.\n\n## Multiple `current` conflict\nIf more than one `nys-step` has the `current` attribute, only the first one is kept; the rest\nare silently removed. Always mark exactly one step as `current`.\n\n## id auto-generation\nIf no `id` is provided, a unique id is generated automatically in the form\n`nys-stepper-{timestamp}-{n}`.\n\n## Accessibility\n- The compact counter is rendered as a `role="button"` with `aria-expanded` and a descriptive\n  `aria-label` that announces the current step (e.g., "Expand step navigation. You are on Step 2 of 4").\n- Keyboard: Enter or Space toggles the compact view.\n- Steps are rendered inside an `<ol>` so assistive technology announces each step\'s position\n  and count (e.g. "2 of 4"). Each slotted `<nys-step>` carries `role="listitem"` since it\n  can\'t itself be a real `<li>`.\n- Navigable steps render as real `<button>` elements — keyboard-focusable and activatable\n  (Enter/Space) natively. Future (non-navigable) steps render as plain, non-interactive rows.\n- Visual focus indicators are provided on all interactive elements.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<div className="nys-grid-row">\n  <NysStepper id="stepper" name="stepper" label="Register for Design System Office Hours" className="nys-desktop:nys-grid-col-3">\n    <NysStep label="Personal Details" href="/nys-stepper/personal.html" />\n    <NysStep label="Team Info" selected href="/nys-stepper/team.html" />\n    <NysStep label="Usage Survey" current href="/nys-stepper/survey.html" />\n    <NysStep label="Newsletter Opt-In" href="/nys-stepper/newsletter.html" />\n    <div slot="actions">\n      <NysButton variant="outline" label="Save & Exit" fullWidth />\n    </div>\n  </NysStepper>\n  <div className="nys-desktop:nys-grid-col-9" id="nys-stepper-content">Loading...</div>\n</div>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<div class="nys-grid-row">\n  <nys-stepper id="stepper" name="stepper" label="Register for Design System Office Hours" class="nys-desktop:nys-grid-col-3">\n    <nys-step label="Personal Details" href="/nys-stepper/personal.html"></nys-step>\n    <nys-step label="Team Info" selected href="/nys-stepper/team.html"></nys-step>\n    <nys-step label="Usage Survey" current href="/nys-stepper/survey.html"></nys-step>\n    <nys-step label="Newsletter Opt-In" href="/nys-stepper/newsletter.html"></nys-step>\n    <div slot="actions">\n      <nys-button variant="outline" label="Save & Exit" fullWidth></nys-button>\n    </div>\n  </nys-stepper>\n  <div class="nys-desktop:nys-grid-col-9" id="nys-stepper-content">Loading...</div>\n</div>\n```',
      },
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
          id="stepper"
          class="nys-desktop:nys-grid-col-3"
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
