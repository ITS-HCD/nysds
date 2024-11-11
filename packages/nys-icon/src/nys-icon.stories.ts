// To-do: Stories to be added.

import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components";
import "./nys-icon";

// Define the structure of the args used in the stories
interface NysIconArgs {
  name: string;
  label?: string;
  color?: string;
  rotate?: string;
  size?: string;
}

const meta: Meta<NysIconArgs> = {
  title: "Components/Icon",
  component: "nys-icon",
  argTypes: {
    label: { control: "text" },
    name: { control: "text" },
    color: { control: "text" },
    rotate: { control: "text" },
    size: {
      control: "select",
      options: [
        "nys-icon--size-xs",
        "nys-icon--size-s",
        "nys-icon--size-m",
        "nys-icon--size-l",
        "nys-icon--size-xl",
      ],
    },
  },
  parameters: {
    docs: {
      source: { type: "dynamic" }, // Enables live Source code tab
      inlineStories: true, // Ensures stories are rendered within the docs tab
    },
  },
};

export default meta;
type Story = StoryObj<NysIconArgs>;

/******************************** STORIES ********************************/
// Define stories without using args

// Story: NameProp
export const NameProp: Story = {
  args: {
    name: "publish",
  },
  render: (args) => html` <nys-icon .name=${args.name}></nys-icon> `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  name="publish"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Labels
export const Labels: Story = {
  args: {
    label: "edit-square icon",
    name: "edit-square",
  },
  render: (args) => html`
    <nys-icon .label=${args.label} .name=${args.name}></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="edit-square icon"
  name="edit-square"
  ></nys-icon>
        `,
        type: "auto",
      },
    },
  },
};

// Story: InheritSize
export const InheritSize: Story = {
  args: {
    label: "search icon",
    name: "search",
  },
  render: (args) => html`
    <div
      class="parent-container"
      style="display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;"
    >
      <p>
        Font size not found on the parent element. Defaulting to the root font
        size of 16px
        <nys-icon .label=${args.label} .name=${args.name}></nys-icon>
      </p>
    </div>
    <div
      class="parent-container"
      style="font-size: 1.5rem; display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;"
    >
      <p>
        The nearest parent container's font-size is set to 1.5rem
        <nys-icon .label=${args.label} .name=${args.name}></nys-icon>
      </p>
    </div>
    <div
      class="parent-container"
      style="font-size: 2rem; display:flex; align-items: center; border: 2px solid black; padding: 5px 20px;"
    >
      <p>
        The nearest parent container's font-size is set to 2rem
        <nys-icon .label=${args.label} .name=${args.name}></nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div class="parent-container" style="display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;">
  <p> The nearest parent container's font-size is not set <nys-icon
    <nys-icon label="search icon" name="search"></nys-icon> 
  </p>
</div>
<div class="parent-container" style="font-size: 1.5rem; display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;">
  <p> The nearest parent container's font-size is set to 1.5rem 
    <nys-icon
      label="search icon"
      name="search"
    ></nys-icon> 
  </p>
</div>
<div class="parent-container" style="font-size: 2rem; display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;">
  <p> The nearest parent container's font-size is set to 2rem <nys-icon
    <nys-icon
      label="search icon"
      name="search"
    ></nys-icon> 
  </p>
</div>
        `.trim(),
      },
    },
  },
};

// Story: CustomSize (ex: nys-icon--size-xl)
export const CustomSize: Story = {
  args: {
    label: "search icon",
    name: "search",
    size: "nys-icon--size-xl",
  },

  render: (args) => html`
    <div style="display: flex; gap: 30px; align-items: center;">
      <div>
        <label for="parent-font-size-input">Parent Font Size (px): </label>
        <input
          type="number"
          id="parent-font-size-input"
          value="16"
          @input="${(e: Event) => {
            const input = e.target as HTMLInputElement;
            document.documentElement.style.setProperty(
              "--parent-font-size",
              `${input.value}px`,
            );
          }}"
        />
      </div>
      <p>
        Font variant:
        <span style="font-weight: 600; color:#c9651b">${args.size}</span>
      </p>
    </div>
    <div
      class="parent-container"
      style="font-size: var(--parent-font-size, 16px);  display:flex; align-items: center; border: 2px solid black; padding: 5px 20px;"
    >
      <p>
        The font-size of the parent container is dynamically controlled.
        <nys-icon
          .label=${args.label}
          .name=${args.name}
          size=${args.size}
        ></nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <div class="parent-container" style="font-size: var(--parent-font-size, 16px);  display:flex; align-items: center; border: 2px solid black; padding: 5px 20px;">
    <p> The font-size of the parent container is dynamically controlled.
      <nys-icon
      label="search icon"
      name="search"
      size="nys-icon--size-xl"
      ></nys-icon>
    </p>
  </div>
        `.trim(),
      },
    },
  },
};

// Story: Color with inheritance
export const ColorInheritance: Story = {
  args: {
    label: "upload-file icon",
    name: "upload-file",
    size: "nys-icon--size-m",
  },
  render: (args) => html`
    <div
      class="parent"
      style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;"
    >
      <p style="display:flex; align-items: center;">
        The color of the nearest parent container is set to DarkBlue.
        <nys-icon
          .label=${args.label}
          .name=${args.name}
          size=${args.size}
        ></nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <div class="parent-container" style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;">
    <p style="display:flex; align-items: center;">The color of the nearest parent container is set to DarkBlue.
      <nys-icon
        label="upload-file icon"
        name="upload-file"
        size="nys-icon--size-m"
      ></nys-icon>
    </p>
  </div>
        `.trim(),
      },
    },
  },
};

// Story: Color change using custom css variable
export const ColorChange: Story = {
  args: {
    label: "upload-file icon",
    name: "upload-file",
    color: "#db117d",
    size: "nys-icon--size-m",
  },
  render: (args) => html`
    <div
      class="parent-container"
      style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;"
    >
      <p style="display:flex; align-items: center;">
        The color of the nearest parent container is set to DarkBlue.
        <nys-icon
          .label=${args.label}
          .name=${args.name}
          color=${args.color}
          size=${args.size}
        ></nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <div class="parent-container" style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;">
    <p style="display:flex; align-items: center;">The color of the nearest parent container is set to DarkBlue.
      <nys-icon
        label="upload-file icon"
        name="upload-file"
        color="#db117d"
        size="nys-icon--size-m"
      ></nys-icon>
    </p>
  </div>
        `.trim(),
      },
    },
  },
};

// Story: Rotate filter
export const Rotate: Story = {
  args: {
    label: "warning icon",
    name: "warning",
    rotate: "20",
    size: "nys-icon--size-m",
  },
  render: (args) => html`
    <nys-icon
      .label=${args.label}
      .name=${args.name}
      color=${args.color}
      rotate=${args.rotate}
      size=${args.size}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  label="warning icon"
  name="warning"
  rotate="20"
  size="nys-icon--size-m"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};
