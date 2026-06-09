import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-accordion";
import "./nys-accordionitem";

// Define the structure of the args used in the stories
interface NysAccordionArgs {
  id: string;
  heading: string;
  expanded: boolean;
  singleSelect: boolean;
  bordered: boolean;
}

const meta: Meta<NysAccordionArgs> = {
  title: "Components/Accordion",
  component: "nys-accordion",
  argTypes: {
    id: { control: "text" },
    heading: { control: "text" },
    expanded: { control: "boolean", default: false },
    singleSelect: { control: "boolean", default: false },
    bordered: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysAccordionArgs>;

export const Basic: Story = {
  args: {
    expanded: true,
    heading: "How do I renew my passport or apply for a new one?",
  },
  render: (args) => html`
    <nys-accordion>
      <nys-accordionitem
        .id=${args.id}
        .expanded=${args.expanded}
        .heading=${args.heading}
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
      >
        <p>
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
<nys-accordion>
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

export const SingleSelect: Story = {
  render: () => html`
    <nys-accordion singleSelect>
      <nys-accordionitem heading="FAQ 1" expanded>Answer 1</nys-accordionitem>
      <nys-accordionitem heading="FAQ 2">Answer 2</nys-accordionitem>
    </nys-accordion>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion singleSelect>
  <nys-accordionitem heading="FAQ 1" expanded>Answer 1</nys-accordionitem>
  <nys-accordionitem heading="FAQ 2">Answer 2</nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const Bordered: Story = {
  render: () => html`
    <nys-accordion singleSelect bordered>
      <nys-accordionitem heading="We are a group of accordions" expanded>
        <p>
          Stronger together! Learn more at
          <a href="https://www.ny.gov" target="_blank">ny.gov</a>
        </p>
      </nys-accordionitem>
      <nys-accordionitem heading="Liberty Ipsum: Bridges & Boroughs">
        <p>
          Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central
          Park, consectetur adipiscing elit.
        </p>
      </nys-accordionitem>
      <nys-accordionitem heading="Hudson Ipsum: Riverfront Stories">
        <p>
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
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};
