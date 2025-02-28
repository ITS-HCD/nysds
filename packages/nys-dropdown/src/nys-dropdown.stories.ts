import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-dropdown";
import "@nysds/nys-label";

// Define the structure of the args used in the stories
interface NysDropdownArgs {
  id: string;
  name: string;
  label: string;
  isOpen: boolean;
}

const meta: Meta<NysDropdownArgs> = {
  title: "Components/Dropdown",
  component: "nys-dropdown",
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    isOpen: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDropdownArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "nys-dropdown-1",
    name: "nys-dropdown",
    label: "Statue of Liberty",
    isOpen: false,
  },
  render: (args) => html`
    <div
      style="display: flex; flex-direction: column; gap: var(--nys-space-100)"
    >
      <nys-label label="New York Landmarks"></nys-label>
      <nys-dropdown
        id=${args.id}
        name=${args.name}
        label=${args.label}
        ?isOpen=${args.isOpen}
      >
        The Statue of Liberty is a colossal neoclassical sculpture on Liberty
        Island in New York Harbor. It was a gift from France to the United
        States and is an iconic symbol of freedom and democracy.
      </nys-dropdown>
      <nys-dropdown
        id="nys-dropdown-2"
        name="nys-dropdown"
        label="Empire State Building"
      >
        The Empire State Building is a 102-story Art Deco skyscraper in Midtown
        Manhattan in New York City. It was designed by Shreve, Lamb & Harmon and
        completed in 1931.
      </nys-dropdown>
      <nys-dropdown
        id="nys-dropdown-3"
        name="nys-dropdown"
        label="Central Park"
      >
        Central Park is an urban park in New York City located between the Upper
        West and Upper East Sides of Manhattan. It is the most visited urban
        park in the United States.
      </nys-dropdown>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: ``,
        type: "auto",
      },
    },
  },
};
