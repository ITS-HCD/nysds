import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-toggle";

// Define the structure of the args used in the stories
interface NysIconArgs {
	name: string;
	label?: string;
}

const meta: Meta<NysIconArgs> = {
	title: "Components/Icon",
	component: "nys-icon",
	argTypes: {
		label: { control: "text" },
		name: { control: "text" }
	},
	parameters: {
		docs: {
			source: { type: "dynamic" }, // Enables live Source code tab
			inlineStories: true, // Ensures stories are rendered within the docs tab
		},
	},
};

export default meta;
type Story = StoryObj<NysIconArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Toggle
export const Toggle: Story = {
	args: {
		name: "publish",
	},
	render: (args) => html` <nys-toggle .label=${args.label} .name=${args.name}> </nys-toggle>`,
	parameters: {
		docs: {
			source: {
				code: `
  <nys-toggle
  name="publish"
  ></nys-toggle>
        `.trim(),
			},
		},
	},
};
