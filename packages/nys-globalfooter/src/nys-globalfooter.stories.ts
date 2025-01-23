import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-globalfooter";

// Define the structure of the args used in the stories
interface NysGlobalFooterArgs {
	id: string;
	agencyName: string;
}

const meta: Meta<NysGlobalFooterArgs> = {
	title: "Components/GlobalFooter",
	component: "nys-globalfooter",
	argTypes: {
		id: { control: "text" },
		agencyName: { control: "text" },
	},
	parameters: {
		docs: {
			source: { type: "dynamic" }, // Enables live Source code tab
			inlineStories: true, // Ensures stories are rendered within the docs tab
		},
	},
};

export default meta;
type Story = StoryObj<NysGlobalFooterArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: Basic
export const Basic: Story = {
	args: {
		id: "Custom Heading",
		agencyName: "Office of Information Technology Services",
	},
	render: (args) => html`
    <nys-globalfooter .id=${args.id} .agencyName=${args.agencyName}>
	 	<a slot="text" href="https://its.ny.gov">ITS Home</a>
		<a slot="text" href="https://its.ny.gov/about">About ITS</a>
		<a slot="text" href="https://its.ny.gov/contact">Contact ITS</a>
		<a slot="text" href="https://its.ny.gov/privacy">Privacy Policy</a>
		<a slot="text" href="https://its.ny.gov/accessibility">Accessibility</a>
		<a slot="text" href="https://its.ny.gov/terms">Terms of Use</a>
    </nys-global-footer>
  `,
	parameters: {
		docs: {
			source: {
				code: `
<nys-globalfooter id="its" agencyName="Office of Information Technology Services">
	<a slot="text" href="https://its.ny.gov">ITS Home</a>
	<a slot="text" href="https://its.ny.gov/about">About ITS</a>
	<a slot="text" href="https://its.ny.gov/contact">Contact ITS</a>
	<a slot="text" href="https://its.ny.gov/privacy">Privacy Policy</a>
	<a slot="text" href="https://its.ny.gov/accessibility">Accessibility</a>
	<a slot="text" href="https://its.ny.gov/terms">Terms of Use</a>
</nys-globalfooter>
        `,
				type: "auto",
			},
		},
	},
};

// Story: Without Links
export const WithoutLinks: Story = {
	args: {
		id: "info",
		agencyName: "Office of Information Technology Services",
	},
	render: (args) => html`
    <nys-globalfooter .id=${args.id} .agencyName=${args.agencyName}>
    </nys-globalfooter>
  `,
	parameters: {
		docs: {
			source: {
				code: `
<nys-globalfooter
  id="its" 
  agencyName="Office of Information Technology Services" 
>
</nys-globalfooter>
`.trim(),
				type: "auto",
			},
		},
	},
};

// Story: With Links
export const WithLinks: Story = {
	args: {
		id: "info",
		agencyName: "Office of Information Technology Services",
	},
	render: (args) => html`
    <nys-globalfooter .id=${args.id} .agencyName=${args.agencyName}>
		<a slot="text" href="https://its.ny.gov">ITS Home</a>
		<a slot="text" href="https://its.ny.gov/about">About ITS</a>
		<a slot="text" href="https://its.ny.gov/contact">Contact ITS</a>
		<a slot="text" href="https://its.ny.gov/privacy">Privacy Policy</a>
		<a slot="text" href="https://its.ny.gov/accessibility">Accessibility</a>
		<a slot="text" href="https://its.ny.gov/terms">Terms of Use</a>
    </nys-globalfooter>
  `,
	parameters: {
		docs: {
			source: {
				code: `
<nys-globalfooter id="its" agencyName="Office of Information Technology Services">
	<a slot="text" href="https://its.ny.gov">ITS Home</a>
	<a slot="text" href="https://its.ny.gov/about">About ITS</a>
	<a slot="text" href="https://its.ny.gov/contact">Contact ITS</a>
	<a slot="text" href="https://its.ny.gov/privacy">Privacy Policy</a>
	<a slot="text" href="https://its.ny.gov/accessibility">Accessibility</a>
	<a slot="text" href="https://its.ny.gov/terms">Terms of Use</a>
</nys-globalfooter>
`.trim(),
				type: "auto",
			},
		},
	},
};
