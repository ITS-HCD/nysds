import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-accordion";
import "./nys-accordionitem";
import "@nysds/nys-icon";

const meta: Meta = {
  title: "Components/Accordion",
  component: "nys-accordion",
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
      description: {
        component:
          'A container for grouping `nys-accordionitem` components with coordinated expand/collapse behavior.\n\nPlace `nys-accordionitem` elements as children. Set `singleSelect` to allow only one item open at a time.\nThe `bordered` style propagates to all children automatically.\n\nEach item\'s toggle button is wrapped in a real heading element. Set\n`headingLevel` here to place the whole group correctly in the page outline.\n\n### Frameworks\n\n**React** (`@nysds/react`)\n\n```jsx\n<NysAccordion>\n  <NysAccordionItem id="accordionId1" heading="How do I renew my passport or apply for a new one?">\n    <p>\n      You can apply for or renew a U.S. passport through the U.S. Department of State. Some renewals can be done by mail.\n    </p>\n    <div style={{ display: "flex", gap: "0.5rem", fontSize: "1rem" }}>\n      <a href="https://www.ny.gov" target="_blank">Check your registration</a>\n      <a href="https://www.ny.gov" target="_blank">Fill out application</a>\n    </div>\n  </NysAccordionItem>\n  <NysAccordionItem id="accordionId2" heading="How can I find out if I’m registered to vote?">\n    <p>\n      You can check your registration status, update your information, or find out how to register through the National Association of Secretaries of State.\n    </p>\n  </NysAccordionItem>\n</NysAccordion>\n```\n\n**Angular** (`@nysds/angular`)\n\n```html\n<nys-accordion>\n  <nys-accordionitem id="accordionId1" heading="How do I renew my passport or apply for a new one?">\n    <p>\n      You can apply for or renew a U.S. passport through the U.S. Department of State. Some renewals can be done by mail.\n    </p>\n    <div style="display: flex; gap: 0.5rem; font-size: 1rem">\n      <a href="https://www.ny.gov" target="_blank">Check your registration</a>\n      <a href="https://www.ny.gov" target="_blank">Fill out application</a>\n    </div>\n  </nys-accordionitem>\n  <nys-accordionitem id="accordionId2" heading="How can I find out if I’m registered to vote?">\n    <p>\n      You can check your registration status, update your information, or find out how to register through the National Association of Secretaries of State.\n    </p>\n  </nys-accordionitem>\n</nys-accordion>\n```',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  args: {
    singleSelect: false,
    bordered: false,
    headingLevel: "h3",
    heading: "How do I renew my passport or apply for a new one?",
    expanded: false,
  },
  argTypes: {
    headingLevel: {
      control: { type: "select" },
      options: ["h2", "h3", "h4", "h5", "h6"],
    },
  },
  render: (args) => {
    return html`
      <nys-accordion
        ?singleSelect=${args.singleSelect}
        ?bordered=${args.bordered}
        headingLevel=${args.headingLevel}
      >
        <nys-accordionitem
          id="accordionId1"
          heading=${args.heading}
          ?expanded=${args.expanded}
        >
          <p>
            You can apply for or renew a U.S. passport through the U.S.
            Department of State. Some renewals can be done by mail.
          </p>
          <div style="display: flex; gap: 0.5rem; font-size: 1rem">
            <a href="https://www.ny.gov" target="_blank"
              >Check your registration</a
            >
            <a href="https://www.ny.gov" target="_blank"
              >Fill out application</a
            >
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
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion>
  <nys-accordionitem id="accordionId1" heading="How do I renew my passport or apply for a new one?">
    <p>
      You can apply for or renew a U.S. passport through the U.S. Department of State. Some renewals
      can be done by mail.
    </p>
    <div style="display: flex; gap: 0.5rem; font-size: 1rem">
      <a href="https://www.ny.gov" target="_blank">Check your registration</a>
      <a href="https://www.ny.gov" target="_blank">Fill out application</a>
    </div>
  </nys-accordionitem>
  <nys-accordionitem id="accordionId2" heading="How can I find out if I’m registered to vote?">
    <p>
      You can check your registration status, update your information, or find out how to register
      through the National Association of Secretaries of State.
    </p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const SingleSelect: Story = {
  render: () => {
    return html`
      <nys-accordion singleSelect>
        <nys-accordionitem heading="FAQ 1">Answer 1</nys-accordionitem>
        <nys-accordionitem heading="FAQ 2">Answer 2</nys-accordionitem>
      </nys-accordion>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion singleSelect>
  <nys-accordionitem heading="FAQ 1">Answer 1</nys-accordionitem>
  <nys-accordionitem heading="FAQ 2">Answer 2</nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const Bordered: Story = {
  render: () => {
    return html`
      <nys-accordion bordered>
        <nys-accordionitem heading="We are a group of accordions">
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
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion bordered>
  <nys-accordionitem heading="We are a group of accordions">
    <p>
      Stronger together! Learn more at
      <a href="https://www.ny.gov" target="_blank">ny.gov</a>
    </p>
  </nys-accordionitem>
  <nys-accordionitem heading="Liberty Ipsum: Bridges & Boroughs">
    <p>
      Empire ipsum dolor sit amet, across the Brooklyn Bridge to Central Park, consectetur
      adipiscing elit.
    </p>
  </nys-accordionitem>
  <nys-accordionitem heading="Hudson Ipsum: Riverfront Stories">
    <p>
      From the banks of the Hudson to the peaks of the Adirondacks, sed do eiusmod tempor incididunt
      ut labore et dolore magna aliqua.
    </p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const HeadingLevel: Story = {
  render: () => {
    return html`
      <h2>Fishing licenses</h2>
      <nys-accordion headingLevel="h3">
        <nys-accordionitem heading="Who needs a license?">
          <p>Anyone 16 or older fishing in New York State freshwater.</p>
        </nys-accordionitem>
        <nys-accordionitem heading="How long is a license valid?">
          <p>
            Annual licenses are valid for 365 days from the date of purchase.
          </p>
        </nys-accordionitem>
      </nys-accordion>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<h2>Fishing licenses</h2>
<nys-accordion headingLevel="h3">
  <nys-accordionitem heading="Who needs a license?">
    <p>Anyone 16 or older fishing in New York State freshwater.</p>
  </nys-accordionitem>
  <nys-accordionitem heading="How long is a license valid?">
    <p>Annual licenses are valid for 365 days from the date of purchase.</p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const ExpandedItem: Story = {
  render: () => {
    return html`
      <nys-accordion>
        <nys-accordionitem heading="How do I apply?" expanded>
          <p>Visit ny.gov and complete the online application.</p>
        </nys-accordionitem>
        <nys-accordionitem heading="What documents do I need?">
          <p>You will need a valid ID and proof of residency.</p>
        </nys-accordionitem>
      </nys-accordion>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion>
  <nys-accordionitem heading="How do I apply?" expanded>
    <p>Visit ny.gov and complete the online application.</p>
  </nys-accordionitem>
  <nys-accordionitem heading="What documents do I need?">
    <p>You will need a valid ID and proof of residency.</p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};

export const PeritemHeadingLevel: Story = {
  render: () => {
    return html`
      <nys-accordion headingLevel="h2">
        <nys-accordionitem heading="Sits at h2, inherited from the group">
          <p>Every item follows the group unless it says otherwise.</p>
        </nys-accordionitem>
        <nys-accordionitem
          headingLevel="h3"
          heading="Sits at h3, set on the item"
        >
          <p>An item that nests under the preceding one sets its own level.</p>
        </nys-accordionitem>
      </nys-accordion>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-accordion headingLevel="h2">
  <nys-accordionitem heading="Sits at h2, inherited from the group">
    <p>Every item follows the group unless it says otherwise.</p>
  </nys-accordionitem>
  <nys-accordionitem headingLevel="h3" heading="Sits at h3, set on the item">
    <p>An item that nests under the preceding one sets its own level.</p>
  </nys-accordionitem>
</nys-accordion>`,
        type: "auto",
      },
    },
  },
};
