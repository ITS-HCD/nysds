import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-avatar";

// Define the structure of the args used in the stories
interface NysAvatarArgs {
	id: string;
	name: string;
	label: string;
	size?: string;
}

const meta: Meta<NysAvatarArgs> = {
	title: "Components/Avatar",
	component: "nys-avatar",
	argTypes: {
		label: { control: "text" },
		name: { control: "text" },
		size: { control: "select", options: ["sm", "md"] },
	},
	parameters: {
		docs: {
			source: { type: "dynamic" }, // Enables live Source code tab
			inlineStories: true, // Ensures stories are rendered within the docs tab
		},
	},
};

export default meta;
type Story = StoryObj<NysAvatarArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Avatar
export const Avatar: Story = {
	args: {
		label: "Dark Mode",
		name: "theme",
	},
	render: (args) => html` <nys-avatar .label=${args.label} .name=${args.name} .size=${args.size}></nys-avatar>`,
	parameters: {
		docs: {
			source: {
		code: `
<nys-avatar
  label="Dark Mode"
  name="theme"
  value="dark"
></nys-avatar>
    `.trim(),
			},
		},
	},
};