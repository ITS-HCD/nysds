import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-textinput";

// Define the structure of the args used in the stories
interface NysTextinputArgs {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  id: string;
  name: string;
  value: string;
  required: boolean;
}

const meta: Meta<NysTextinputArgs> = {
  title: "Components/Textinput",
  component: "nys-textinput",
  argTypes: {},
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysTextinputArgs>;

// Define stories without using args

// Story: TextInput
export const TextInput: Story = {
  args: {},
  render: () => html`
    <nys-textinput
      placeholder="N00000000"
      label="Please enter your Employee number"
      description="include the N prefix"
      maxlength="9"
      pattern="N[0-9]{8}"
      id="nID"
    ></nys-textinput>
  `,
  parameters: {
    docs: {
      source: {
        code: `<nys-textinput></nys-textinput>`,
        type: "auto",
      },
    },
  },
};

export const NoLabelDescription: Story = {
  args: {},
  render: () =>
    html`<nys-textinput placeholder="bleh" id="bleh"></nys-textinput
      ><nys-textinput placeholder="blah" id="blah"></nys-textinput> `,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
