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
    id: "accordionId1",
    heading: "How do I renew my passport or apply for a new one?",
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
      </nys-accordion>
      <nys-accordion
        id="accordionId2"
        heading="How can I find out if I’m registered to vote?"
        ><p>
          You can check your registration status, update your information, or
          find out how to register through the National Association of
          Secretaries of State.
        </p>
      </nys-accordion>
    </nys-accordiongroup>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordiongroup singleSelect>
  <nys-accordion id="accordionId1" heading="How do I renew my passport or apply for a new one?">
    <p>
      You can apply for or renew a U.S. passport through the U.S. Department
      of State. Some renewals can be done by mail.
    </p>
    <div style="display: flex; gap: 0.5rem; font-size: 1rem;">
      <a href="https://www.ny.gov" target="_blank">Check your registration</a>
      <a href="https://www.ny.gov" target="_blank">Fill out application</a>
    </div>
  </nys-accordion>
  <nys-accordion id="accordionId2" heading="How can I find out if I’m registered to vote?">
    <p>You can check your registration status, update your information, or find out how to register through the National Association of Secretaries of State.</p>
  </nys-accordion>
</nys-accordiongroup>`,
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
  id="individualAcc1"
  heading="Liberty Ipsum: Bridges & Boroughs"
  expanded
>
  <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const AccordionGroup: Story = {
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

export const Bordered: Story = {
  args: {
    heading: "I am an Individual Accordion",
    expanded: true,
    bordered: true,
    singleSelect: true,
  },
  render: (args) => html`
    <nys-accordion
      .id=${args.id}
      .heading=${args.heading}
      .expanded=${args.expanded}
      bordered
    >
      <p>I love NY!</p>
    </nys-accordion>
    <br />
    <br />
    <nys-accordiongroup
      ?singleSelect=${args.singleSelect}
      ?bordered=${args.bordered}
    >
      <nys-accordion heading="We are a group" expanded
        ><p>
          Stronger together! Learn more at
          <a href="https://www.ny.gov" target="_blank"> ny.gov </a>
        </p>
      </nys-accordion>
      <nys-accordion heading="Liberty Ipsum: Bridges & Boroughs"
        ><p>
          Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central
          Park, consectetur adipiscing elit.
        </p>
      </nys-accordion>
      <nys-accordion heading="Hudson Ipsum: Riverfront Stories"
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
<nys-accordion heading="I am an Individual Accordion" bordered>
  <p>I love NY!</p>
</nys-accordion>

<nys-accordiongroup singleSelect bordered>
  <nys-accordion heading="We are a group">
   <p>Stronger together! Learn more at
      <a href="https://www.ny.gov" target="_blank">ny.gov</a>
    </p>
  </nys-accordion>
  <nys-accordion heading="Liberty Ipsum: Bridges & Boroughs">
    <p>Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur adipiscing elit.</p>
  </nys-accordion>
  <nys-accordion heading="Hudson Ipsum: Riverfront Stories">
    <p>From the banks of the Hudson to the peaks of the Adirondacks, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </nys-accordion>
</nys-accordiongroup>
`,
        type: "auto",
      },
    },
  },
};
