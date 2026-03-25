import { html } from "lit";
import { Meta, StoryObj } from "@storybook/web-components-vite";
import "./nys-icon";
import { registerIconLibrary } from "./icon-library-registry";

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
    library: { control: "text" },
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

// Story: Font Awesome Library
export const FontAwesome: Story = {
  args: {
    name: "house",
    library: "fa",
    size: "4xl",
    color: "#1877F2",
  },
  render: (args) => {
    registerIconLibrary("fa", {
      resolver: (name) =>
        `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/${name}.svg`,
      mutator: (svg) => {
        svg.setAttribute("fill", "currentColor");
      },
    });

    return html`
      <div>
        <p style="margin-bottom: 8px;">
          Icons loaded from
          <strong>Font Awesome</strong>
          via a custom icon library:
        </p>
        <div style="display: flex; gap: 16px; align-items: center;">
          <nys-icon
            name=${args.name}
            library=${args.library}
            color=${args.color}
            size=${args.size}
          ></nys-icon>
          <nys-icon
            name="star"
            library="fa"
            color="#f5a623"
            size=${args.size}
          ></nys-icon>
          <nys-icon
            name="heart"
            library="fa"
            color="#e74c3c"
            size=${args.size}
          ></nys-icon>
          <nys-icon
            name="user"
            library="fa"
            color="#2ecc71"
            size=${args.size}
          ></nys-icon>
        </div>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
// Register Font Awesome as a custom icon library
import { registerIconLibrary } from '@nysds/nys-icon';

registerIconLibrary('fa', {
  resolver: name =>
    \`https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/\${name}.svg\`,
  mutator: svg => svg.setAttribute('fill', 'currentColor'),
});

<nys-icon name="house" library="fa" size="4xl" color="#1877F2"></nys-icon>
<nys-icon name="star" library="fa" size="4xl" color="#f5a623"></nys-icon>
<nys-icon name="heart" library="fa" size="4xl" color="#e74c3c"></nys-icon>
<nys-icon name="user" library="fa" size="4xl" color="#2ecc71"></nys-icon>
        `.trim(),
      },
    },
  },
};

// Story: Material Icons Library
export const MaterialIcons: Story = {
  args: {
    name: "home",
    library: "material",
    size: "4xl",
    color: "#4285F4",
  },
  render: (args) => {
    registerIconLibrary("material", {
      resolver: (name) =>
        `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/default/24px.svg`,
      mutator: (svg) => {
        svg.setAttribute("fill", "currentColor");
      },
    });

    return html`
      <div>
        <p style="margin-bottom: 8px;">
          Icons loaded from
          <strong>Google Material Symbols</strong>
          via a custom icon library:
        </p>
        <div style="display: flex; gap: 16px; align-items: center;">
          <nys-icon
            name=${args.name}
            library=${args.library}
            color=${args.color}
            size=${args.size}
          ></nys-icon>
          <nys-icon
            name="favorite"
            library="material"
            color="#EA4335"
            size=${args.size}
          ></nys-icon>
          <nys-icon
            name="settings"
            library="material"
            color="#34A853"
            size=${args.size}
          ></nys-icon>
          <nys-icon
            name="search"
            library="material"
            color="#FBBC05"
            size=${args.size}
          ></nys-icon>
        </div>
      </div>
    `;
  },
  parameters: {
    docs: {
      source: {
        code: `
// Register Material Symbols as a custom icon library
import { registerIconLibrary } from '@nysds/nys-icon';

registerIconLibrary('material', {
  resolver: name =>
    \`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/\${name}/default/24px.svg\`,
  mutator: svg => svg.setAttribute('fill', 'currentColor'),
});

<nys-icon name="home" library="material" size="4xl" color="#4285F4"></nys-icon>
<nys-icon name="favorite" library="material" size="4xl" color="#EA4335"></nys-icon>
<nys-icon name="settings" library="material" size="4xl" color="#34A853"></nys-icon>
<nys-icon name="search" library="material" size="4xl" color="#FBBC05"></nys-icon>
        `.trim(),
      },
    },
  },
};
