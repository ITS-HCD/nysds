import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-accordiongroup";
import "./nys-accordion";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysAccordionArgs {
  id: string;
  heading: string;
  expanded: boolean;
  bordered: boolean;
  singleSelect: boolean;
}

const meta: Meta<NysAccordionArgs> = {
  title: "Components/Accordion",
  component: "nys-accordion",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    expanded: { control: "boolean", default: false },
    bordered: { control: "boolean", default: false },
    singleSelect: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysAccordionArgs>;

export const Basic: Story = {
  args: {
    id: "accordion1",
    heading: "Welcome to New York",
    expanded: true,
    bordered: false,
    singleSelect: true,
  },
  render: (args) => html`
    <nys-accordiongroup
      ?singleSelect=${args.singleSelect}
      ?bordered=${args.bordered}
    >
      <nys-accordion
        .id=${args.id}
        .heading=${args.heading}
        .expanded=${args.expanded}
        ><p>
          Learn about state programs, services, and resources available at
          <a href="https://www.ny.gov" target="_blank"> ny.gov </a>
        </p>
      </nys-accordion>
      <nys-accordion id="accordion2" heading="Liberty Ipsum: Bridges & Boroughs"
        ><p>
          Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central
          Park, consectetur adipiscing elit.
        </p>
      </nys-accordion>
      <nys-accordion id="accordion3" heading="Hudson Ipsum: Riverfront Stories"
        ><p>
          From the banks of the Hudson to the peaks of the Adirondacks, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </nys-accordion>
    </nys-accordiongroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordiongroup singleSelect>
  <nys-accordion id="accordion1" heading="Welcome to New York">
   <p>Learn about state programs, services, and resources available at
      <a href="https://www.ny.gov" target="_blank">ny.gov</a>
    </p>
  </nys-accordion>
  <nys-accordion id="accordion2" heading="Liberty Ipsum: Bridges & Boroughs">
    <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
  </nys-accordion>
  <nys-accordion id="accordion3" heading="Hudson Ipsum: Riverfront Stories">
    <p>From the banks of the Hudson to the peaks of the Adirondacks, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </nys-accordion>
</nys-accordiongroup>`,
        type: "auto",
      },
    },
  },
};

export const IndividualAccordion: Story = {
  args: {
    id: "accordion1",
    heading: "Liberty Ipsum: Bridges & Boroughs",
    expanded: false,
    bordered: false,
  },
  render: (args) => html`
    <nys-accordion
      .id=${args.id}
      .heading=${args.heading}
      .expanded=${args.expanded}
      .bordered=${args.bordered}
      ><p>
        Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park,
        consectetur adipiscing elit.
      </p>
    </nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion
  id="accordion1"
  heading="Liberty Ipsum: Bridges & Boroughs"
>
  <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};
