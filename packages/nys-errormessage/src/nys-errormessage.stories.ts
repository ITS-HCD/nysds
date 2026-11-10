import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-errormessage";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Errormessage",
  component: "nys-errormessage",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          '**Internal component.** Displays error messages for form validation with icon and ARIA alert role.\n\nUsed internally by form components. Not intended for direct use. Shows error icon and message\nwhen `showError` is true. Integrates with ElementInternals for native form validation messages.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysErrorMessage showError errorMessage="This is an error message" />\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-errormessage showError errorMessage="This is an error message"></nys-errormessage>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    showError: true,
    errorMessage: "This is an error message",
    showDivider: false,
  },
  render: (args) => {
    return html`
      <nys-errormessage
        ?showError=${args.showError}
        errorMessage=${args.errorMessage}
        ?showDivider=${args.showDivider}
      ></nys-errormessage>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-errormessage showError errorMessage="This is an error message"></nys-errormessage>`,
        type: "auto",
      },
    },
  },
};

export const Divider: Story = {
  render: () => {
    return html`
      <nys-errormessage
        showError
        errorMessage="This is an error message"
        showDivider
      ></nys-errormessage>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-errormessage showError errorMessage="This is an error message" showDivider></nys-errormessage>`,
        type: "auto",
      },
    },
  },
};
