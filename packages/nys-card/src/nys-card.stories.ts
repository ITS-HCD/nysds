import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-card";

// Define the structure of the args used in the stories
interface NysCardArgs {
  id: string;
  onClick: () => void;
}

const meta: Meta<NysCardArgs> = {
  title: "Components/Card",
  component: "nys-card",
  argTypes: {
    id: { control: "text" },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysCardArgs>;

// Define stories without using args

export const Basic: Story = {
  args: {
    id: "card1",
  },
  render: () => html`
    <div class="nys-grid-row nys-grid-gap-200">
      <nys-card
        class="nys-grid-col-4"
        media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        mediaAccent="1/1"
        preheading="preheading"
        heading="heading"
        subheading="subheading"
        description="description"
        elevated
      >
        <div slot="footer-slot">this is my footer</div>
        <div slot="top-slot">this is my top</div>
        Slotted Content </nys-card
      ><nys-card
        class="nys-grid-col-4"
        media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        mediaAccent="1/1"
        preheading="preheading"
        heading="heading"
        subheading="subheading"
        description="description"
        elevated
      >
        <div slot="footer-slot">this is my footer</div>
        <div slot="top-slot">this is my top</div>
        Slotted Content </nys-card
      ><nys-card
        class="nys-grid-col-4"
        media="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        mediaAccent="1/1"
        preheading="preheading"
        heading="heading"
        subheading="subheading"
        description="description"
        elevated
      >
        <div slot="footer-slot">this is my footer</div>
        <div slot="top-slot">this is my top</div>
        Slotted Content
      </nys-card>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<nys-card
  id="card1"
></nys-card>`,
        type: "auto",
      },
    },
  },
};
