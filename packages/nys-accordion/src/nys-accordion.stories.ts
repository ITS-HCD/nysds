import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
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
    heading: "How do I renew my passport or apply for a new one?",
    expanded: true,
    bordered: false,
    singleSelect: true,
  },
  render: (args) => html`
    <nys-accordion
      ?singleSelect=${args.singleSelect}
      ?bordered=${args.bordered}
    >
      <nys-accordionitem
        .id=${args.id}
        .heading=${args.heading}
        .expanded=${args.expanded}
      >
        <p>
          You can apply for or renew a U.S. passport through the U.S. Department
          of State. Some renewals can be done by mail.
        </p>
        <div style="display: flex; gap: 0.5rem; font-size: 1rem;">
          <a href="https://www.ny.gov" target="_blank"
            >Check your registration</a
          >
          <a href="https://www.ny.gov" target="_blank">Fill out application</a>
        </div>
      </nys-accordionitem>
      <nys-accordionitem
        id="accordionId2"
        heading="How can I find out if I’m registered to vote?"
        ><p>
          You can check your registration status, update your information, or
          find out how to register through the National Association of
          Secretaries of State.
        </p>
      </nys-accordionitem>
    </nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion singleSelect>
  <nys-accordionitem expanded id="accordionId1" heading="How do I renew my passport or apply for a new one?">
    <p>
      You can apply for or renew a U.S. passport through the U.S. Department
      of State. Some renewals can be done by mail.
    </p>
    <div style="display: flex; gap: 0.5rem; font-size: 1rem;">
      <a href="https://www.ny.gov" target="_blank">Check your registration</a>
      <a href="https://www.ny.gov" target="_blank">Fill out application</a>
    </div>
  </nys-accordionitem>
  <nys-accordionitem id="accordionId2" heading="How can I find out if I’m registered to vote?">
    <p>You can check your registration status, update your information, or find out how to register through the National Association of Secretaries of State.</p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const IndividualAccordion: Story = {
  args: {
    id: "individualAcc1",
    heading: "Liberty Ipsum: Bridges & Boroughs",
    expanded: true,
    bordered: false,
    singleSelect: true,
  },
  render: (args) => html`
    <nys-accordion
      ?singleSelect=${args.singleSelect}
      ?bordered=${args.bordered}
    >
      <nys-accordionitem
        .id=${args.id}
        .heading=${args.heading}
        .expanded=${args.expanded}
        ><p>
          Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central
          Park, consectetur adipiscing elit.
        </p>
      </nys-accordionitem>
    </nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion>        
  <nys-accordionitem
    id="individualAcc1"
    heading="Liberty Ipsum: Bridges & Boroughs"
    expanded
  >
    <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
  </nys-accordionitem>
<nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const AccordionWrapper: Story = {
  args: {
    id: "accordion1",
    heading: "Welcome to New York",
    expanded: true,
    bordered: false,
    singleSelect: true,
  },
  render: (args) => html`
    <nys-accordion
      ?singleSelect=${args.singleSelect}
      ?bordered=${args.bordered}
    >
      <nys-accordionitem
        .id=${args.id}
        .heading=${args.heading}
        .expanded=${args.expanded}
        ><p>
          Learn about state programs, services, and resources available at
          <a href="https://www.ny.gov" target="_blank"> ny.gov </a>
        </p>
      </nys-accordionitem>
      <nys-accordionitem
        id="accordion2"
        heading="Liberty Ipsum: Bridges & Boroughs"
        ><p>
          Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central
          Park, consectetur adipiscing elit.
        </p>
      </nys-accordionitem>
      <nys-accordionitem
        id="accordion3"
        heading="Hudson Ipsum: Riverfront Stories"
        ><p>
          From the banks of the Hudson to the peaks of the Adirondacks, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </nys-accordionitem>
    </nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion singleSelect>
  <nys-accordionitem id="accordion1" heading="Welcome to New York" expanded>
   <p>Learn about state programs, services, and resources available at
      <a href="https://www.ny.gov" target="_blank">ny.gov</a>
    </p>
  </nys-accordionitem>
  <nys-accordionitem id="accordion2" heading="Liberty Ipsum: Bridges & Boroughs">
    <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
  </nys-accordionitem>
  <nys-accordionitem id="accordion3" heading="Hudson Ipsum: Riverfront Stories">
    <p>From the banks of the Hudson to the peaks of the Adirondacks, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const Bordered: Story = {
  args: {
    heading: "We are a group of accordions",
    expanded: true,
    bordered: true,
    singleSelect: true,
  },
  render: (args) => html`
    <nys-accordion
      ?singleSelect=${args.singleSelect}
      ?bordered=${args.bordered}
    >
      <nys-accordionitem
        .id=${args.id}
        .heading=${args.heading}
        .expanded=${args.expanded}
        ><p>
          Stronger together! Learn more at
          <a href="https://www.ny.gov" target="_blank"> ny.gov </a>
        </p>
      </nys-accordionitem>
      <nys-accordionitem heading="Liberty Ipsum: Bridges & Boroughs"
        ><p>
          Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central
          Park, consectetur adipiscing elit.
        </p>
      </nys-accordionitem>
      <nys-accordionitem heading="Hudson Ipsum: Riverfront Stories"
        ><p>
          From the banks of the Hudson to the peaks of the Adirondacks, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </nys-accordionitem>
    </nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion singleSelect bordered>
  <nys-accordionitem heading="We are a group of accordions" expanded>
   <p>Stronger together! Learn more at
      <a href="https://www.ny.gov" target="_blank">ny.gov</a>
    </p>
  </nys-accordionitem>
  <nys-accordionitem heading="Liberty Ipsum: Bridges & Boroughs">
    <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
  </nys-accordionitem>
  <nys-accordionitem heading="Hudson Ipsum: Riverfront Stories">
    <p>From the banks of the Hudson to the peaks of the Adirondacks, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </nys-accordionitem>
</nys-accordion>
`,
        type: "auto",
      },
    },
  },
};
