// nys-breadcrumbs.stories.ts
import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-breadcrumbs";
import "@nysds/nys-icon";

interface NysBreadcrumbsArgs {
  id: string;
  size: "md" | "sm" | "";
  // itemsBeforeCollapse: string;
  // itemsAfterCollapse: string;
  // maxItems: string;
  ariaLabel: string;
  collapsed: boolean;
  backToParent: boolean;
  backgroundBar: boolean;
  disabled: boolean;
}

const meta: Meta<NysBreadcrumbsArgs> = {
  title: "Components/Breadcrumbs",
  component: "nys-breadcrumbs",
  argTypes: {
    id: { control: "text" },
    size: { control: "select", options: ["", "md", "sm"] },
    // itemsBeforeCollapse: { control: "text" },
    // itemsAfterCollapse: { control: "text" },
    // maxItems: { control: "text" },
    ariaLabel: { control: "text" },
    collapsed: { control: "boolean" },
    backToParent: { control: "boolean" },
    backgroundBar: { control: "boolean" },
    disabled: { control: "boolean" },
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

const defaultArgs: NysBreadcrumbsArgs = {
  id: "",
  size: "",
  ariaLabel: "",
  // itemsBeforeCollapse: "",
  // itemsAfterCollapse: "",
  // maxItems: "",
  collapsed: false,
  backToParent: false,
  backgroundBar: false,
  disabled: false,
};

export const Basic: Story = {
  args: { ...defaultArgs, id: "breadcrumbs1" },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/tickets">Ticket System</a></li>
        <li><a href="/del-water-gap">Del Water Gap</a></li>
        <li>Current Page</li>
      </ol>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/tickets">Ticket System</a></li>
    <li><a href="/del-water-gap">Del Water Gap</a></li>
    <li>Current Page</li>
  </ol>
</nys-breadcrumbs>`,
      },
    },
  },
};

export const WithoutCurrentPage: Story = {
  args: { ...defaultArgs, id: "breadcrumbs2" },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/tickets">Ticket System</a></li>
        <li><a href="/tickets">Not a clickable</a></li>
      </ol>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/tickets">Ticket System</a></li>
  </ol>
</nys-breadcrumbs>`,
      },
    },
  },
};

export const SingleCrumb: Story = {
  args: { ...defaultArgs, id: "breadcrumbs3" },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
    >
      <ol>
        <li><a href="/">Home</a></li>
      </ol>
    </nys-breadcrumbs>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-breadcrumbs>
  <ol>
    <li><a href="/">Home</a></li>
  </ol>
</nys-breadcrumbs>`,
      },
    },
  },
};

export const LongTrailOfCrumbs: Story = {
  args: { ...defaultArgs, id: "breadcrumbs4" },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/government">Government</a></li>
        <li><a href="/government/agencies">Agencies</a></li>
        <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
        <li><a href="/parks/state-parks">State Parks</a></li>
        <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
        <li>
          <a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a>
        </li>
        <li>Trail Conditions</li>
      </ol>
    </nys-breadcrumbs>
  `,
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
      },
    },
  },
};

// export const MaxItems: Story = {
//   args: { ...defaultArgs, id: "breadcrumbs5", maxItems: "10" },
//   render: (args) => html`
//     <nys-breadcrumbs
//       .id=${args.id}
//       .size=${args.size}
//       .ariaLabel=${args.ariaLabel}
//
//
//       .collapsed=${args.collapsed}
//       .backToParent=${args.backToParent}
//     >
//       <ol>
//         <li><a href="/">Home</a></li>
//         <li><a href="/government">Government</a></li>
//         <li><a href="/government/agencies">Agencies</a></li>
//         <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
//         <li><a href="/parks/state-parks">State Parks</a></li>
//         <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
//         <li>
//           <a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a>
//         </li>
//         <li>Trail Conditions</li>
//       </ol>
//     </nys-breadcrumbs>
//   `,
//   parameters: {
//     docs: {
//       source: {
//         code: `
// <nys-breadcrumbs maxItems="10">
//   <ol>
//     <li><a href="/">Home</a></li>
//     <li><a href="/government">Government</a></li>
//     <li><a href="/government/agencies">Agencies</a></li>
//     <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
//     <li><a href="/parks/state-parks">State Parks</a></li>
//     <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
//     <li><a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a></li>
//     <li>Trail Conditions</li>
//   </ol>
// </nys-breadcrumbs>`,
//       },
//     },
//   },
// };

export const BackToParent: Story = {
  args: { ...defaultArgs, id: "breadcrumbs6", backToParent: true },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/government">Government</a></li>
        <li><a href="/government/agencies">Agencies</a></li>
        <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
        <li><a href="/parks/state-parks">State Parks</a></li>
        <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
        <li>
          <a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a>
        </li>
        <li>Trail Conditions</li>
      </ol>
    </nys-breadcrumbs>
  `,
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
      },
    },
  },
};

// export const BeforeAndAfterCollapse: Story = {
//   args: {
//     ...defaultArgs,
//     id: "breadcrumbs7",
//     itemsBeforeCollapse: "2",
//     itemsAfterCollapse: "3",
//   },
//   render: (args) => html`
//     <nys-breadcrumbs
//       .id=${args.id}
//       .size=${args.size}
//       .ariaLabel=${args.ariaLabel}
//       .collapsed=${args.collapsed}
//       .backToParent=${args.backToParent}
//     >
//       <ol>
//         <li><a href="/">Home</a></li>
//         <li><a href="/government">Government</a></li>
//         <li><a href="/government/agencies">Agencies</a></li>
//         <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
//         <li><a href="/parks/state-parks">State Parks</a></li>
//         <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
//         <li>
//           <a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a>
//         </li>
//         <li>Trail Conditions</li>
//       </ol>
//     </nys-breadcrumbs>
//   `,
//   parameters: {
//     docs: {
//       source: {
//         code: `
// <nys-breadcrumbs itemsBeforeCollapse="2" itemsAfterCollapse="3">
//   <ol>
//     <li><a href="/">Home</a></li>
//     <li><a href="/government">Government</a></li>
//     <li><a href="/government/agencies">Agencies</a></li>
//     <li><a href="/government/agencies/parks">Parks & Recreation</a></li>
//     <li><a href="/parks/state-parks">State Parks</a></li>
//     <li><a href="/parks/state-parks/delaware">Delaware Region</a></li>
//     <li><a href="/parks/state-parks/delaware/water-gap">Delaware Water Gap</a></li>
//     <li>Trail Conditions</li>
//   </ol>
// </nys-breadcrumbs>`,
//       },
//     },
//   },
// };

export const Size: Story = {
  args: { ...defaultArgs, id: "breadcrumbs8", size: "sm" },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/government">Government</a></li>
        <li><a href="/government/agencies">Agencies</a></li>
        <li>Parks & Recreation</li>
      </ol>
    </nys-breadcrumbs>
  `,
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
      },
    },
  },
};

export const BackgroundBar: Story = {
  args: { ...defaultArgs, id: "breadcrumbs9", backgroundBar: true },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
      .backgroundBar=${args.backgroundBar}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/tickets">Ticket System</a></li>
        <li>Del Water Gap</li>
      </ol>
    </nys-breadcrumbs>
  `,
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
      },
    },
  },
};

export const Disabled: Story = {
  args: { ...defaultArgs, id: "breadcrumbs10", disabled: true },
  render: (args) => html`
    <nys-breadcrumbs
      .id=${args.id}
      .size=${args.size}
      .ariaLabel=${args.ariaLabel}
      .collapsed=${args.collapsed}
      .backToParent=${args.backToParent}
      .backgroundBar=${args.backgroundBar}
      .disabled=${args.disabled}
    >
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/tickets">Ticket System</a></li>
        <li>Del Water Gap</li>
      </ol>
    </nys-breadcrumbs>
  `,
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
      },
    },
  },
};
