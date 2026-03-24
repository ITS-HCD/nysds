import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-icon";
import { registerIconLibrary } from "./nys-icon.registry";

// Register Font Awesome (free) as an external icon library.
registerIconLibrary("fa", {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/${name}.svg`,
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});

// Register Google Material Symbols as an external icon library.
registerIconLibrary("material", {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/@material-symbols/svg-400@0.27.2/outlined/${name}.svg`,
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});

// Define the structure of the args used in the stories
interface NysIconArgs {
  name: string;
  library: string;
  ariaLabel: string;
  color: string;
  rotate: string;
  flip: string;
  size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "12"
    | "14"
    | "16"
    | "18"
    | "20"
    | "24"
    | "32"
    | "40"
    | "50";
}

const meta: Meta<NysIconArgs> = {
  title: "Components/Icon",
  component: "nys-icon",
  argTypes: {
    ariaLabel: { control: "text" },
    name: { control: "text" },
    library: {
      control: "select",
      options: ["default", "fa", "material"],
    },
    color: { control: "text" },
    rotate: { control: "text" },
    flip: {
      control: "select",
      options: ["horizontal", "vertical", "both"],
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "12",
        "14",
        "16",
        "18",
        "20",
        "24",
        "32",
        "40",
        "50",
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

// Stories
// Define stories without using args

// Story: Basic
export const Basic: Story = {
  args: {
    name: "social_youtube",
    size: "4xl",
    color: "#b2071d",
  },
  render: (args) =>
    html` <nys-icon
      .ariaLabel=${args.ariaLabel}
      .name=${args.name}
      color=${args.color}
      rotate=${args.rotate}
      flip=${args.flip}
      size=${args.size}
    >
    </nys-icon>`,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  name="social_youtube"
  size="4xl"
  color="#1ca1ba"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: NameProp
export const NameProp: Story = {
  args: {
    name: "publish",
  },
  render: (args) =>
    html` <nys-icon
      .ariaLabel=${args.ariaLabel}
      .name=${args.name}
      color=${args.color}
      rotate=${args.rotate}
      flip=${args.flip}
      size=${args.size}
    >
    </nys-icon>`,
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
    ariaLabel: "Edit square icon",
    name: "edit_square",
  },
  render: (args) => html`
    <nys-icon
      .ariaLabel=${args.ariaLabel}
      .name=${args.name}
      color=${args.color}
      rotate=${args.rotate}
      flip=${args.flip}
      size=${args.size}
    >
    </nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  ariaLabel="Edit square icon"
  name="edit_square"
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
    ariaLabel: "Search icon",
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
        <nys-icon
          .ariaLabel=${args.ariaLabel}
          .name=${args.name}
          color=${args.color}
          rotate=${args.rotate}
          flip=${args.flip}
          size=${args.size}
        ></nys-icon>
      </p>
    </div>
    <div
      class="parent-container"
      style="font-size: 1.5rem !important; display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;"
    >
      <p>
        The nearest parent container's font-size is set to 1.5rem
        <nys-icon
          .ariaLabel=${args.ariaLabel}
          .name=${args.name}
          color=${args.color}
          rotate=${args.rotate}
          flip=${args.flip}
          size=${args.size}
        ></nys-icon>
      </p>
    </div>
    <div
      class="parent-container"
      style="font-size: 2rem !important; display:flex; align-items: center; border: 2px solid black; padding: 5px 20px;"
    >
      <p>
        The nearest parent container's font-size is set to 2rem
        <nys-icon
          .ariaLabel=${args.ariaLabel}
          .name=${args.name}
          color=${args.color}
          rotate=${args.rotate}
          flip=${args.flip}
          size=${args.size}
        ></nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
<div class="parent-container" style="display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;">
  <p> The nearest parent container's font-size is not set <nys-icon
    <nys-icon ariaLabel="Search icon" name="search"></nys-icon>
  </p>
</div>
<div class="parent-container" style="font-size: 1.5rem; display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;">
  <p> The nearest parent container's font-size is set to 1.5rem
    <nys-icon
      ariaLabel="Search icon"
      name="search"
    ></nys-icon>
  </p>
</div>
<div class="parent-container" style="font-size: 2rem; display:flex; align-items: center; border: 2px solid black; border-bottom:none; padding: 5px 20px;">
  <p> The nearest parent container's font-size is set to 2rem <nys-icon
    <nys-icon
      ariaLabel="Search icon"
      name="search"
    ></nys-icon>
  </p>
</div>
        `.trim(),
      },
    },
  },
};

// Story: CustomSize (ex: xl)
export const CustomSize: Story = {
  args: {
    ariaLabel: "Search icon",
    name: "search",
    size: "4xl",
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
      <p style="display:flex; align-items: center; gap: 5px;">
        The font-size of the parent container is dynamically controlled.
        <nys-icon
          .ariaLabel=${args.ariaLabel}
          .name=${args.name}
          color=${args.color}
          rotate=${args.rotate}
          flip=${args.flip}
          size=${args.size}
        >
        </nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <div class="parent-container" style="font-size: var(--parent-font-size, 16px);  display:flex; align-items: center; border: 2px solid black; padding: 5px 20px;">
    <p style="display:flex; align-items: center; gap: 5px;"> The font-size of the parent container is dynamically controlled.
      <nys-icon
      ariaLabel="Search icon"
      name="search"
      size="4xl"
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
    ariaLabel: "Upload file icon",
    name: "upload_file",
    size: "3xl",
  },
  render: (args) => html`
    <div
      class="parent-container"
      style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;"
    >
      <p class="nys-display-flex nys-flex-align-center" style="gap: 5px;">
        The color of the nearest parent container is set to DarkBlue.&nbsp;
        <nys-icon
          .ariaLabel=${args.ariaLabel}
          .name=${args.name}
          color=${args.color}
          rotate=${args.rotate}
          flip=${args.flip}
          size=${args.size}
        >
        </nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <div class="parent-container" style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;">
    <p style="display:flex; align-items: center; gap: 5px;">
      The color of the nearest parent container is set to DarkBlue.
      <nys-icon
        ariaLabel="Upload file icon"
        name="upload_file"
        size="3xl"
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
    ariaLabel: "Upload file icon",
    name: "upload_file",
    color: "#db117d",
    size: "3xl",
  },
  render: (args) => html`
    <div
      class="parent-container"
      style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;"
    >
      <p style="display:flex; align-items: center;">
        The color of the nearest parent container is set to DarkBlue.&nbsp;
        <nys-icon
          .ariaLabel=${args.ariaLabel}
          .name=${args.name}
          color=${args.color}
          rotate=${args.rotate}
          flip=${args.flip}
          size=${args.size}
        >
        </nys-icon>
      </p>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <div class="parent-container" style="color:DarkBlue; border: 2px solid black; padding: 5px 20px;">
    <p style="display:flex; align-items: center;">
      The color of the nearest parent container is set to DarkBlue.
      <nys-icon
        ariaLabel="Upload file icon"
        name="upload_file"
        color="#db117d"
        size="3xl"
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
    ariaLabel: "Warning icon",
    name: "warning",
    rotate: "20",
    size: "3xl",
  },
  render: (args) => html`
    <nys-icon
      .ariaLabel=${args.ariaLabel}
      .name=${args.name}
      color=${args.color}
      rotate=${args.rotate}
      flip=${args.flip}
      size=${args.size}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  ariaLabel="Warning icon"
  name="warning"
  rotate="20"
  size="3xl"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Flip prop
export const Flip: Story = {
  args: {
    ariaLabel: "Arrow back icon",
    name: "arrow_back",
    size: "3xl",
    flip: "horizontal",
  },
  render: (args) => html`
    <nys-icon
      .ariaLabel=${args.ariaLabel}
      .name=${args.name}
      color=${args.color}
      rotate=${args.rotate}
      flip=${args.flip}
      size=${args.size}
    ></nys-icon>
  `,
  parameters: {
    docs: {
      source: {
        code: `
  <nys-icon
  ariaLabel="Arrow back icon"
  name="arrow_back"
  flip="horizontal"
  size="3xl"
  ></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Font Awesome library
export const FontAwesome: Story = {
  args: {
    library: "fa",
    name: "solid/heart",
    size: "4xl",
    color: "#c9302c",
  },
  render: (args) => html`
    <p style="margin-bottom: 8px; font-size: 14px; color: #555;">
      Icons loaded from
      <strong>Font Awesome 6 Free</strong> via
      <code>registerIconLibrary("fa", ...)</code>
    </p>
    <div style="display: flex; gap: 24px; align-items: center;">
      <nys-icon
        library=${args.library}
        .name=${args.name}
        .ariaLabel=${args.ariaLabel}
        color=${args.color}
        size=${args.size}
        rotate=${args.rotate}
        flip=${args.flip}
      ></nys-icon>
      <nys-icon library="fa" name="solid/star" size="4xl" color="#f0ad4e"></nys-icon>
      <nys-icon library="fa" name="solid/circle-check" size="4xl" color="#5cb85c"></nys-icon>
      <nys-icon library="fa" name="brands/github" size="4xl"></nys-icon>
      <nys-icon library="fa" name="solid/bell" size="4xl" color="#337ab7"></nys-icon>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
import { registerIconLibrary } from "@nysds/nys-icon";

// Register once at app startup
registerIconLibrary("fa", {
  resolver: (name) =>
    \`https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/\${name}.svg\`,
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});

<!-- Then use in HTML -->
<nys-icon library="fa" name="solid/heart" size="4xl" color="#c9302c"></nys-icon>
<nys-icon library="fa" name="solid/star" size="4xl" color="#f0ad4e"></nys-icon>
<nys-icon library="fa" name="solid/circle-check" size="4xl" color="#5cb85c"></nys-icon>
<nys-icon library="fa" name="brands/github" size="4xl"></nys-icon>
<nys-icon library="fa" name="solid/bell" size="4xl" color="#337ab7"></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Google Material Symbols library
export const MaterialSymbols: Story = {
  args: {
    library: "material",
    name: "home",
    size: "4xl",
  },
  render: (args) => html`
    <p style="margin-bottom: 8px; font-size: 14px; color: #555;">
      Icons loaded from
      <strong>Google Material Symbols</strong> via
      <code>registerIconLibrary("material", ...)</code>
    </p>
    <div style="display: flex; gap: 24px; align-items: center;">
      <nys-icon
        library=${args.library}
        .name=${args.name}
        .ariaLabel=${args.ariaLabel}
        color=${args.color}
        size=${args.size}
        rotate=${args.rotate}
        flip=${args.flip}
      ></nys-icon>
      <nys-icon library="material" name="favorite" size="4xl" color="#c9302c"></nys-icon>
      <nys-icon library="material" name="settings" size="4xl"></nys-icon>
      <nys-icon library="material" name="delete" size="4xl" color="#d9534f"></nys-icon>
      <nys-icon library="material" name="thumb_up" size="4xl" color="#337ab7"></nys-icon>
    </div>
  `,
  parameters: {
    docs: {
      source: {
        code: `
import { registerIconLibrary } from "@nysds/nys-icon";

// Register once at app startup
registerIconLibrary("material", {
  resolver: (name) =>
    \`https://cdn.jsdelivr.net/npm/@material-symbols/svg-400@0.27.2/outlined/\${name}.svg\`,
  mutator: (svg) => svg.setAttribute("fill", "currentColor"),
});

<!-- Then use in HTML -->
<nys-icon library="material" name="home" size="4xl"></nys-icon>
<nys-icon library="material" name="favorite" size="4xl" color="#c9302c"></nys-icon>
<nys-icon library="material" name="settings" size="4xl"></nys-icon>
<nys-icon library="material" name="delete" size="4xl" color="#d9534f"></nys-icon>
<nys-icon library="material" name="thumb_up" size="4xl" color="#337ab7"></nys-icon>
        `.trim(),
      },
    },
  },
};
