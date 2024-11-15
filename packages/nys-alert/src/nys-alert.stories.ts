import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-alert";

// Define the structure of the args used in the stories
interface NysAlertArgs {

}

const meta: Meta<NysAlertArgs> = {
	title: "Components/Alert",
	component: "nys-alert",
	argTypes: {
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		description: { control: "text" },
		id: { control: "text" },
		name: { control: "text" },
		value: { control: "text" },
		required: { control: "boolean" },
	},
	parameters: {
		docs: {
			source: { type: "dynamic" }, // Enables live Source code tab
			inlineStories: true, // Ensures stories are rendered within the docs tab
		},
	},
};

export default meta;
type Story = StoryObj<NysAlertArgs>;

// Define stories without using args

// Story: Editable
export const AllAlerts: Story = {
	args: {
	},
	render: (args) => html`
		<nys-alert>
		</nys-alert>
	`,
	parameters: {
		docs: {
			source: {
				code: `
<nys-alert>
</nys-alert>`.trim(),
				type: "auto",
			},
		},
	},
};
