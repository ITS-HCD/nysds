import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-breadcrumbs";
import "@nysds/nys-icon";

// Define the structure of the args used in the stories
interface NysBreadcrumbsArgs {
  id: string;
  size: "md" | "sm" | "";
  itemsBeforeCollapse: string;
  itemsAfterCollapse: string;
  maxItems: string;
  collapsed: boolean;
  backToParentMobile: boolean;
}

const meta: Meta<NysBreadcrumbsArgs> = {
  title: "Components/Breadcrumbs",
  component: "nys-breadcrumbs",
  argTypes: {
    id: { control: "text" },
    size: { control: "select", options: ["", "md", "sm"] },
    itemsBeforeCollapse: { control: "text" },
    itemsAfterCollapse: { control: "text" },
    maxItems: { control: "text" },
    collapsed: { control: "boolean" },
    backToParentMobile: { control: "boolean" },
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
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
    size: "",
    collapsed: false,
    backToParentMobile: false,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/services" label="Services"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/tickets" label="Ticket System"></nys-breadcrumbitem>
  <nys-breadcrumbitem label="Del Water Gap"></nys-breadcrumbitem>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const WithoutCurrentPage: Story = {
  args: {
    id: "breadcrumbs2",
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
    size: "",
    collapsed: false,
    backToParentMobile: false,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/services" label="Services"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/tickets" label="Ticket System"></nys-breadcrumbitem>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const SingleCrumb: Story = {
  args: {
    id: "breadcrumbs3",
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
    size: "",
    collapsed: false,
    backToParentMobile: false,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
    id: "breadcrumbs4",
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
    size: "",
    collapsed: false,
    backToParentMobile: false,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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

export const MaxItems: Story = {
  args: {
    id: "breadcrumbs5",
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "10",
    collapsed: false,
    backToParentMobile: false,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
<nys-breadcrumbs maxItems="10">
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

export const BackToParentProp: Story = {
  args: {
    id: "breadcrumbs6",
    itemsBeforeCollapse: "",
    itemsAfterCollapse: "",
    maxItems: "",
    size: "",
    collapsed: false,
    backToParentMobile: true,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
<nys-breadcrumbs backToParentMobile>
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

export const BeforeAndAfterCollapse: Story = {
  args: {
    id: "breadcrumbs6",
    itemsBeforeCollapse: "2",
    itemsAfterCollapse: "3",
    maxItems: "",
    size: "",
    collapsed: false,
    backToParentMobile: true,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
<nys-breadcrumbs itemsBeforeCollapse="2" itemsAfterCollapse="3">
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

export const Size: Story = {
  args: {
    id: "breadcrumbs6",
    itemsBeforeCollapse: "2",
    itemsAfterCollapse: "3",
    maxItems: "",
    size: "sm",
    collapsed: false,
    backToParentMobile: true,
  },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .itemsBeforeCollapse=${args.itemsBeforeCollapse}
      .itemsAfterCollapse=${args.itemsAfterCollapse}
      .maxItems=${args.maxItems}
      .collapsed=${args.collapsed}
      .backToParentMobile=${args.backToParentMobile}
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
      <nys-breadcrumbitem label="Parks & Recreation"></nys-breadcrumbitem>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs size="sm">
  <nys-breadcrumbitem link="/" label="Home"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/government" label="Government"></nys-breadcrumbitem>
  <nys-breadcrumbitem link="/government/agencies" label="Agencies"></nys-breadcrumbitem>
  <nys-breadcrumbitem label="Parks & Recreation"></nys-breadcrumbitem>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};
