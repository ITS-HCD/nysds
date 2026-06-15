import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-breadcrumbs";

// Define the structure of the args used in the stories
interface NysBreadcrumbsArgs {
  id: string;
  ariaLabel: string;
  size: "sm" | "md";
  backToParent: boolean;
  collapsed: boolean;
  backgroundBar: boolean;
  disabled: boolean;
}

const meta: Meta<NysBreadcrumbsArgs> = {
  title: "Components/Breadcrumbs",
  component: "nys-breadcrumbs",
  argTypes: {
    id: { control: "text" },
    ariaLabel: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    backToParent: { control: "boolean", default: false },
    collapsed: { control: "boolean", default: false },
    backgroundBar: { control: "boolean", default: false },
    disabled: { control: "boolean", default: false },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" },
      inlineStories: true,
    },
  },
};

export default meta;
type Story = StoryObj<NysBreadcrumbsArgs>;

export const Basic: Story = {
  args: {},
  render: (args) => {
    return html`
      <nys-breadcrumbs
        .id=${args.id}
        ?backToParent=${args["backToParent"]}
        ?collapsed=${args["collapsed"]}
        ?backgroundBar=${args["backgroundBar"]}
        ?disabled=${args["disabled"]}
        .ariaLabel=${args["ariaLabel"]}
        .size=${args["size"]}
      >
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const CurrentPage: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li>Current Page</li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li>Current Page</li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const SingleItemList: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs>
        <ol>
          <li><a href="/services">Services</a></li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/services">Services</a></li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const LongList: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/government">Government</a></li>
          <li><a href="/government/agencies">Agencies</a></li>
          <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
          <li><a href="/parks/state-parks">State Parks</a></li>
          <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
          <li>
            <a href="/parks/state-parks/delaware/water-gap"
              >Delaware Water Gap</a
            >
          </li>
          <li>Trail Conditions</li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/government">Government</a></li>
    <li><a href="/government/agencies">Agencies</a></li>
    <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
    <li><a href="/parks/state-parks">State Parks</a></li>
    <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
    <li><a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a></li>
    <li>Trail Conditions</li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const SizeSmall: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs size="sm">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/government">Government</a></li>
          <li><a href="/government/agencies">Agencies</a></li>
          <li>Parks & Recreation</li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs size="sm">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/government">Government</a></li>
    <li><a href="/government/agencies">Agencies</a></li>
    <li>Parks & Recreation</li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const BackToParentMobile: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs backToParent>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/government">Government</a></li>
          <li><a href="/government/agencies">Agencies</a></li>
          <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
          <li><a href="/parks/state-parks">State Parks</a></li>
          <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
          <li>
            <a href="/parks/state-parks/delaware/water-gap"
              >Delaware Water Gap</a
            >
          </li>
          <li>Trail Conditions</li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs backToParent>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/government">Government</a></li>
    <li><a href="/government/agencies">Agencies</a></li>
    <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
    <li><a href="/parks/state-parks">State Parks</a></li>
    <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
    <li><a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a></li>
    <li>Trail Conditions</li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const BackgroundBar: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs backgroundBar>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/tickets">Ticket System</a></li>
          <li>Del Water Gap</li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs backgroundBar>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/tickets">Ticket System</a></li>
    <li>Del Water Gap</li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => {
    return html`
      <nys-breadcrumbs disabled>
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/tickets">Ticket System</a></li>
          <li>Del Water Gap</li>
        </ol>
      </nys-breadcrumbs>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs disabled>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/tickets">Ticket System</a></li>
    <li>Del Water Gap</li>
  </ol>
</nys-breadcrumbs>`,
        type: "auto",
      },
    },
  },
};
