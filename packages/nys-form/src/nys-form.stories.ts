import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-form";

// Define the structure of the args used in the stories
interface NysFormArgs {
  id: string;
  name: string;
}

const meta: Meta<NysFormArgs> = {
  title: "Components/Form",
  component: "nys-form",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysFormArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Form
export const Form: Story = {
  render: () => html` <nys-form></nys-form> `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-form></nys-form>
`.trim(),
        type: "auto",
      },
    },
  },
};
