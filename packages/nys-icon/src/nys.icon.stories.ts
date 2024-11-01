// To-do: Stories to be added.

import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
	label: string;
	id: string;
	name: string;
	focusable: boolean;
}

const meta: Meta<NysIconArgs> = {
	title: "Components/Icon",
	component: "nys-icon",
	argTypes: {
		id: { control: "text" },
		label: { control: "text" },
		name: { control: "text" },
		focusable: { control: "boolean" },
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

// Define stories without using args

// Story: Alert
export const Alert: Story = {
	args: {
		label: "alert icon",
		name: "log-in",
		focusable: false,
	},
	render: (args) => html` <nys-icon .label=${args.label} .name=${args.name} .focusable=${false}></nys-icon> `,
	parameters: {
		docs: {
			source: {
				code: `
  <nys-icon
  label="alert icon"
  name="alert"
  focusable=false
  ></nys-icon>
        `,
				type: "auto",
			},
		},
	},
};

// Story: Globe
export const Globe: Story = {
	args: {
		label: "globe icon",
		name: "globe",
		focusable: false,
	},
	render: (args) => html` <nys-icon .label=${args.label} .name=${args.name} .focusable=${false}></nys-icon> `,
	parameters: {
		docs: {
			source: {
				code: `
  <nys-icon
  label="globe icon"
  name="globe"
  focusable=false
  ></nys-icon>
        `.trim(),
			},
		},
	},
};
