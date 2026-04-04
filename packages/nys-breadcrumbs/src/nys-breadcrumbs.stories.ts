import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-breadcrumbs";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysBreadcrumbsArgs {
  id: string;
  collapsed: boolean;
  itemsBeforeCollapse: string;
  itemsAfterCollapse: string;
  maxItems: string;
}

const meta: Meta<NysBreadcrumbsArgs> = {
  title: "Components/Breadcrumbs",
  component: "nys-breadcrumbs",
  argTypes: {
    id: { control: "text" },
    collapsed: { control: "boolean" },
    itemsBeforeCollapse: { control: "text" },
    itemsAfterCollapse: { control: "text" },
    maxItems: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysBreadcrumbsArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "breadcrumbs1",
    collapsed: false,
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .collapsed=${args.collapsed}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
    >
      <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/services"
        label="Services"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/tickets"
        label="Ticket System"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem label="Del Water Gap"></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumb-item>
  <nys-breadcrumbitem link="/services" label="Services"></nys-breadcrumb-item>
  <nys-breadcrumbitem link="/tickets" label="Ticket System"></nys-breadcrumb-item>
  <nys-breadcrumbitem  label="Del Water Gap"></nys-breadcrumb-item>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const WithoutCurrentPage: Story = {
  args: {
    id: "breadcrumbs1",
    collapsed: false,
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .collapsed=${args.collapsed}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
    >
      <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/services"
        label="Services"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/tickets"
        label="Ticket System"
      ></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumb-item>
  <nys-breadcrumbitem link="/services" label="Services"></nys-breadcrumb-item>
  <nys-breadcrumbitem link="/tickets" label="Ticket System"></nys-breadcrumb-item>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const BackToParentPage: Story = {
  args: {
    id: "breadcrumbs1",
    collapsed: false,
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .collapsed=${args.collapsed}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
    >
      <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumb-item>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const LongTrailOfCrumbs: Story = {
  args: {
    id: "breadcrumbs1",
    collapsed: false,
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .collapsed=${args.collapsed}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
    >
      <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/government"
        label="Government"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/government/agencies"
        label="Agencies"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/government/agencies/parks"
        label="Parks & Recreation"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/parks/state-parks"
        label="State Parks"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/parks/state-parks/delaware"
        label="Delaware Region"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem
        link="/parks/state-parks/delaware/water-gap"
        label="Delaware Water Gap"
      ></nys-breadcrumbitem>
      <nys-breadcrumbitem label="Trail Conditions"></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/government" label="Government"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/government/agencies" label="Agencies"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/government/agencies/parks" label="Parks & Recreation"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/parks/state-parks" label="State Parks"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/parks/state-parks/delaware" label="Delaware Region"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/parks/state-parks/delaware/water-gap" label="Delaware Water Gap"></nys-breadcrumbitem>
  <nys-breadcrumbitem label="Trail Conditions"></nys-breadcrumbitem>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};
