import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-divider";

// Define the structure of the args used in the stories
interface NysDividerArgs {
  size: string;
  inverted: boolean;
}

const meta: Meta<NysDividerArgs> = {
  title: "Components/Divider",
  component: "nys-divider",
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    inverted: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysDividerArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {},
  render: (args) => html`
    <div>sample content</div>
    <nys-divider .size=${args.size} .inverted=${args.inverted}></nys-divider>
    <div>sample content</div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-divider></nys-divider>`,
        type: "auto",
      },
    },
  },
};

export const Size: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: var(--nys-space-200, 16px); padding: var(--nys-space-200, 16px);"
    >
      <nys-divider size="sm"></nys-divider>
      <nys-divider></nys-divider>
      <nys-divider size="lg"></nys-divider>
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

export const Inverted: Story = {
  render: () => html`
    <div
      style="display: flex; flex-direction: column; gap: var(--nys-space-200, 16px); background-color: var(--nys-color-ink, #1b1b1b); padding: var(--nys-space-200, 16px);"
    >
      <nys-divider inverted size="sm"></nys-divider>
      <nys-divider inverted></nys-divider>
      <nys-divider inverted size="lg"></nys-divider>
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

// export const Vertical: Story = {
//   args: { vertical: true },
//   render: (args) =>
//     html` <div style="display: flex; align-items: center; height: 50px;">
//       <div>sample vertical content</div>
//       <nys-divider
//         .size=${args.size}
//         .inverted=${args.inverted}
//         .vertical=${args.vertical}
//       ></nys-divider>
//       <div>sample vertical content</div>
//     </div>`,
//   parameters: {
//     docs: {
//       source: {
//         code: `
// <div
//   style="display: flex; align-items: center; height: 50px;"
// >
//   <div>sample vertical content</div>
//   <nys-divider vertical></nys-divider>
//   <div>sample vertical content</div>
//   </div>`,
//         type: "auto",
//       },
//     },
//   },
// };
